import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { OpenAI } from "openai";

const FMP_API_KEY = process.env.FMP_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";

const openAI = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.body;

  if (!query) {
    res.status(400).json({ message: "No query provided" });
    return;
  }

  try {
    // OPEN AI query
    const openaiResponse = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `The prompt is very financial focused where the data is returned in the following JSON format \n. 
               companies: [
                {
                  companyName: 'Company Name',
                  tickerSymbol: null
                },
                {
                  companyName: 'Company 2',
                  tickerSymbol: null
                }
              ],
              summary: 'Summary of the prompt'
              \n
              where if the company name or CEO name of the company is mentioned it will return the tickerSymbol if it exist, there can be multiple companies or CEOs mentioned in the prompt. Also return the answer of the prompt in a field called summary through various web searches or news articles, return only the summary of the prompt if queried company has not IPOed or been listed:\n"${query}"`,
        },
      ],
    });

    const companyNameSymbol = JSON.parse(
      openaiResponse.choices[0].message.content!
    );

    const summary = companyNameSymbol.summary;

    console.log("companyNameSymbol", companyNameSymbol);

    const searchResult = [];

    for (const company of companyNameSymbol.companies) {
      const tickerSymbol = company.tickerSymbol;
      console.log("tickerSymbol", tickerSymbol);

      //Need to find better error handling for companies that have not IPOed yet
      if (tickerSymbol == "N/A" || tickerSymbol == null) {
        res.status(200).json({
          searchResult,
          message:
            "No company ticker found, company has not IPOed yet or been listed",
          summary,
        });
      }
      const companyProfileResponse = await axios.get(
        `${FMP_BASE_URL}/profile/${tickerSymbol}?apikey=${FMP_API_KEY}`
      );
      console.log("companyProfileResponse", companyProfileResponse.data);

      //for some reason this api call requires v4 instead of v3
      const findlatestEarningsTranscript = await axios.get(
        `https://financialmodelingprep.com/api/v4/earning_call_transcript?symbol=${tickerSymbol}&apikey=${FMP_API_KEY}`
      );

      const latestEarningsTranscript = await axios.get(
        `${FMP_BASE_URL}/earning_call_transcript/${tickerSymbol}?year=${findlatestEarningsTranscript.data[0][1]}&quarter=${findlatestEarningsTranscript.data[0][0]}&apikey=${FMP_API_KEY}`
      );

      console.log("earningsTranscript", latestEarningsTranscript.data);

      const summarizeEarningsCall = await openAI.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Summarize the content of this earnings transcript based on what is given here :\n"${latestEarningsTranscript.data[0].content}"`,
          },
        ],
      });

      console.log(
        "summarizeEarningsCall",
        summarizeEarningsCall.choices[0].message.content
      );

      const companyFinancials = {
        tickerSymbol,
        companyProfile: companyProfileResponse.data,
        earningsTranscript: latestEarningsTranscript.data,
        earningsSummary: summarizeEarningsCall.choices[0].message.content,
      };

      searchResult.push(companyFinancials);
    }

    res.status(200).json({ searchResult, summary });
  } catch (error) {
    console.log(error);
  }
}

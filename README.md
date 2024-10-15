## Introduction



https://github.com/user-attachments/assets/b37821e0-7555-454a-9c65-ae0c83d50a73



This is a quick PoC to integrating OPENAI API as well as FMP APIs to summarize and retrieve the latest financial information/earnings about certain companies

This application takes a standard prompt such as the following and will then query OPENAI API for the latest info regarding said query, as well as tapping into FMP's api to fetch the latest earnings based on the prompt provided (It will extra the ticker symbol of said company)

```
"Summarize Spotify's latest conference call."

"What has Airbnb management said about profitability over the last few earnings calls?"

"What are Mark Zuckerberg's and Satya Nadella's recent comments about AI?"

"How many new large deals did ServiceNow sign in the last quarter?"
```

Raw inputs are returned in terminal through console.log via the `summary.ts` api and sent to FE via the call.

## Getting Started

First, create a local .env filed called `.env.local` and add the following env variables

```
OPENAI_API_KEY=YOUR_OPEN_AI_API_KEY
FMP_API_KEY=YOUR_FMP_API_KEY

```

install dependencies run the development server:

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the FE, type a query in the input box and it will generate results accordingly

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/summary](http://localhost:3000/api/summary). This endpoint can be edited in `pages/api/summary.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Key takeaway and learnings

Trying to build a smart summarizer that can take the user input and translate into company outlook is challenging, the model should ideally understand what the user is asking and return the correct info such as ticker symbol to be directly used in retrieving other relevant information such as earning report and company profile from FMP APIs. Can also further deep dive and return more complex query via FMP APIs

## Nice to haves/improvements

- A better front end (componentized and modular) + general code cleanup
- Better error handling when company cannot be parsed in FMP (private companies)
- Use a model that has more context into financially related stuff instead of a generic model
- Fine tune models to be better suited for financial understanding
- Use of Vector DB/Store to store queries/similar context as to stop requesting the API query each time and increase performance
- General efficiency/performance improvements
- More complex analysis through various FMP APIs or a combination of FMP APIs and backfed through OpenAI or other AI APIS/models

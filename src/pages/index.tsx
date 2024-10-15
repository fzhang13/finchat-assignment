import { useState } from "react";
import CompanyCard from "@/components/CompanyCard";
import { CompanyProfile } from "@/data/types";

type CompanyData = {
  companyProfile: [];
  earningsSummary: string;
  earningsTranscript: [];
  tickerSymbol: string;
  summary: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.message) {
        setError(data.message);
        setSummary(data.summary);
      }

      const companyData = data.searchResult.map((result: CompanyData) => ({
        companyProfile: result.companyProfile,
        earningsSummary: result.earningsSummary,
        earningsTranscript: result.earningsTranscript,
        tickerSymbol: result.tickerSymbol,
        summary: result.summary,
      }));

      setSummary(`Summary from OpenAI: ${data.summary}`);
      setEarnings(companyData);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Company Earnings Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a financial question about a company:
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            style={{ width: "300px", margin: "10px", color: "black" }}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {summary && (
        <div style={{ marginTop: "20px" }}>
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {earnings.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Company Profile</h2>
          {earnings.map((earning: CompanyData, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              {earning.companyProfile.map((company: CompanyProfile, index) => (
                <CompanyCard key={index} company={{ ...company }} />
              ))}
              <h3>{"Ticker Symbol: " + earning.tickerSymbol}</h3>
              <p>
                <strong>Latest Earnings Transcript Summary:</strong>{" "}
                {earning.earningsSummary}
              </p>
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

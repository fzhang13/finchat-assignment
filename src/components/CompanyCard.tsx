/* eslint-disable @next/next/no-img-element */
import { CompanyProfile } from "@/data/types";
import React, { useState } from "react";

interface CompanyCardProps {
  company: CompanyProfile;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const [showMore, setShowMore] = useState(false);

  const handleViewMoreClick = () => {
    setShowMore(!showMore);
  };

  return (
    <div style={styles.card}>
      <img
        src={company.image}
        alt={`${company.companyName} logo`}
        style={styles.logo}
      />
      <h2>{"Name: " + company.companyName}</h2>
      <p> {"Industry: " + company.industry}</p>
      <p> {"CEO: " + company.ceo}</p>
      <p> {"Website: " + company.website}</p>
      <p> {"Full Time Employee: " + company.fullTimeEmployees}</p>
      <p>{"IPO Date: " + company.ipoDate}</p>
      <p>{""}</p>
      <button onClick={handleViewMoreClick}>
        {showMore ? "Hide" : "View More"}
      </button>
      {showMore && (
        <div style={styles.more}>
          <p>{company.description}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    margin: "16px",
    maxWidth: "400px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    width: "100px",
    height: "100px",
  },
  more: {
    marginTop: "16px",
  },
};

export default CompanyCard;

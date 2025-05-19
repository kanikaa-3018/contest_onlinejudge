import React from "react";

const GoogleSheetSummary = () => {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1oGj0_KE1aE1BP1WsLd-Q9qShKPxaQY0yusIeiO8wz40/edit?gid=723096008";
  const notionUrl = "https://www.notion.so/your-notion-page-link";

  return (
    <>
      <style>
        {`
          .container {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 3rem;
            animation: fadeIn 0.8s ease forwards;
            opacity: 0;
            flex-wrap: wrap;
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }
          .btn {
            padding: 14px 32px;
            font-size: 17px;
            font-weight: 600;
            border: none;
            border-radius: 14px;
            cursor: pointer;
            color: white;
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
            transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            user-select: none;
          }
          .btn-google {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          }
          .btn-google:hover {
            transform: scale(1.07);
            box-shadow: 0 16px 32px rgba(38, 72, 224, 0.4);
          }
          .btn-notion {
            background: linear-gradient(135deg, #000000 0%, #434343 100%);
          }
          .btn-notion:hover {
            transform: scale(1.07);
            box-shadow: 0 16px 32px rgba(68, 68, 68, 0.5);
          }
          .btn svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
          }
          @media (max-width: 480px) {
            .container {
              flex-direction: column;
              gap: 1rem;
            }
            .btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>
      <div className="container">
        <button
          className="btn btn-google"
          onClick={() => window.open(sheetUrl, "_blank")}
          aria-label="Open Google Sheets Daily CP Summary"
        >
          🚀 View Daily CP Summary
        </button>

        <button
          className="btn btn-notion"
          onClick={() => window.open(notionUrl, "_blank")}
          aria-label="Open Notion Page"
        >
          {/* Notion Icon SVG */}
          <svg viewBox="0 0 256 256" aria-hidden="true" focusable="false">
            <path d="M24 24h208v208H24z" fill="none" />
            <path d="M120 40v176h32V40zM96 80v112h24V80zM56 120v56h24v-56z" />
          </svg>
          Notion Page
        </button>
      </div>
    </>
  );
};

export default GoogleSheetSummary;

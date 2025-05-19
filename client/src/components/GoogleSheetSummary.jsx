import React from "react";

const GoogleSheetSummary = () => {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1oGj0_KE1aE1BP1WsLd-Q9qShKPxaQY0yusIeiO8wz40/edit?gid=723096008";
  const notionUrl = "https://www.notion.so/your-notion-page-link";

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .fade-in {
            animation: fadeIn 0.8s ease forwards;
          }
        `}
      </style>

      <div className="flex flex-wrap justify-center gap-6 mt-4 opacity-0 fade-in flex-row">
        <button
          className="flex items-center gap-2 px-8 py-3 text-lg font-semibold rounded-2xl text-white cursor-pointer
            bg-gradient-to-br from-purple-700 to-blue-600
            shadow-lg shadow-blue-500/30
            transition-transform duration-300 ease-in-out
            hover:scale-105 hover:shadow-blue-600/50
            select-none
            sm:w-full sm:justify-center"
          onClick={() => window.open(sheetUrl, "_blank")}
          aria-label="Open Google Sheets Daily CP Summary"
        >
          🚀 View Daily CP Summary
        </button>

        <button
          className="flex items-center gap-2 px-8 py-3 text-lg font-semibold rounded-2xl text-white cursor-pointer
            bg-gradient-to-br from-black to-gray-700
            shadow-lg shadow-gray-700/40
            transition-transform duration-300 ease-in-out
            hover:scale-105 hover:shadow-gray-900/60
            select-none
            sm:w-full sm:justify-center"
          onClick={() => window.open(notionUrl, "_blank")}
          aria-label="Open Notion Page"
        >
          <svg
            className="w-5 h-5 fill-current"
            viewBox="0 0 256 256"
            aria-hidden="true"
            focusable="false"
          >
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

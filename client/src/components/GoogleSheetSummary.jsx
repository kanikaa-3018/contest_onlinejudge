import React from "react";

const GoogleSheetSummary = () => {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1oGj0_KE1aE1BP1WsLd-Q9qShKPxaQY0yusIeiO8wz40/edit?gid=723096008";
  const notionUrl = "https://www.notion.so/MY-CP-SUBMISSION-REPORT-1f8efa8d35398025b666fb14ae2a3b43";

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

      <div
        className="fade-in mx-auto mt-4 flex flex-col md:flex-row justify-center gap-4 px-4"
        style={{ maxWidth: 720 }}
        aria-label="Google Sheets and Notion quick access buttons"
      >
        <button
          type="button"
          className="
            flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-2xl text-white cursor-pointer
            bg-gradient-to-br from-purple-700 to-blue-600
            shadow-lg shadow-blue-500/30
            transition-transform duration-300 ease-in-out
            hover:scale-105 hover:shadow-blue-600/50
            select-none
            w-full md:w-auto
            md:flex-1
            justify-center
          "
          onClick={() => window.open(sheetUrl, "_blank")}
          aria-label="Open Google Sheets Daily CP Summary"
        >
          🚀 View Daily CP Summary
        </button>

        <button
          type="button"
          className="
            flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-2xl text-white cursor-pointer
            bg-gradient-to-br from-black to-gray-700
            shadow-lg shadow-gray-700/40
            transition-transform duration-300 ease-in-out
            hover:scale-105 hover:shadow-gray-900/60
            select-none
            w-full md:w-auto
            md:flex-1
            justify-center
          "
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

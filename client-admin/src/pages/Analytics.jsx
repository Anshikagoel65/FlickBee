import React from "react";
const POWERBI_URL = import.meta.env.VITE_POWERBI_URL;
const Analytics = () => {
  return (
    <div className="w-full h-[calc(100vh-80px)] bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow h-full overflow-hidden">
        <iframe
          title="Admin Analytics Dashboard"
          src={POWERBI_URL}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Analytics;

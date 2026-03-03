import React from "react";

const Analytics = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        title="Admin Analytics Dashboard"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/reportEmbed?reportId=d7aff714-63fc-47e8-9653-6bc1c09da379&groupId=4a390955-96cf-4b93-aee9-94554cd1d5a6&autoAuth=true"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
};

export default Analytics;

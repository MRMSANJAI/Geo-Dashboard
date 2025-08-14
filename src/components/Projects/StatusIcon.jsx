// StatusIcon.jsx
import React from "react";

const StatusIcon = ({ status }) => {
  const iconUrl = status === "Complete"
    ? "https://img.icons8.com/fluency/48/ok--v1.png"
    : "https://img.icons8.com/fluency/48/cancel.png";

  return (
    <img
      src={iconUrl}
      alt={status}
      className="h-5 w-5 inline-block"
    />
  );
};

export default StatusIcon;

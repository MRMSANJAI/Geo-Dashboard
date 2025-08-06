import React from "react";

const StatusIcon = ({ status }) => {
  const iconUrl = status
    ? "https://img.icons8.com/emoji/48/000000/check-mark-emoji.png"
    : "https://img.icons8.com/emoji/48/000000/cross-mark-emoji.png";

  return (
    <img
      src={iconUrl}
      alt={status ? "Complete" : "Incomplete"}
      className="h-5 w-5 inline-block"
    />
  );
};

export default StatusIcon;
import React from "react";

const Topbar = ({ title }) => {
  return (
    <div style={{
      height: "60px",
      background: "#f8fafc",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      fontWeight: "bold"
    }}>
      {title}
    </div>
  );
};

export default Topbar;

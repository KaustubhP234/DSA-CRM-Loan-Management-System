const StatusBadge = ({ status }) => {
  const map = {
    "In-Process": "warning",
    "Is-Disbursement": "primary",
    Completed: "success",
    Rejected: "danger",
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        color: "#fff",
        background: `var(--${map[status] || "secondary"})`,
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

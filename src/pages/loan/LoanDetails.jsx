import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ActivityTimeline from "../../components/activity/ActivityTimeline";
import { addActivity } from "../../utils/activityService";
import { addNotification } from "../../utils/notificationService";

const LoanDetails = () => {
  const { id } = useParams(); // STRING
  const navigate = useNavigate();

  const [loan, setLoan] = useState(null);

  useEffect(() => {
    const loans = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const found = loans.find((l) => String(l.id) === String(id));

    if (found) {
      setLoan(found);
      addActivity(found.id, "Loan details opened");
    }
  }, [id]);

  const updateStatus = (newStatus) => {
    const loans = JSON.parse(localStorage.getItem("loanFiles")) || [];

    const updatedLoans = loans.map((l) =>
      String(l.id) === String(id)
        ? { ...l, status: newStatus }
        : l
    );

    localStorage.setItem("loanFiles", JSON.stringify(updatedLoans));
    setLoan({ ...loan, status: newStatus });

    addActivity(id, `Status changed to ${newStatus}`);
    addNotification(`Loan #${id} status changed to ${newStatus}`);
  };

  if (!loan) return <p>Loan not found</p>;

  return (
    <div>
      <h1>Loan File Details</h1>

      <div style={styles.card}>
        <p><b>ID:</b> {loan.id}</p>
        <p><b>Name:</b> {loan.name}</p>
        <p><b>Loan Type:</b> {loan.loanType}</p>
        <p>
          <b>Status:</b>{" "}
          <span style={getStatusStyle(loan.status)}>
            {loan.status}
          </span>
        </p>

        <div style={styles.actions}>
          {loan.status === "In-Process" && (
            <>
              <button
                style={styles.primary}
                onClick={() => updateStatus("Is-Disbursement")}
              >
                Move to Disbursement
              </button>

              <button
                style={styles.danger}
                onClick={() => updateStatus("Rejected")}
              >
                Reject Loan
              </button>
            </>
          )}

          <button style={styles.secondary} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      <h2 style={{ marginTop: "30px" }}>Activity Timeline</h2>
      <p style={{ color: "red" }}>
  DEBUG loanId: {id}
</p>

      <ActivityTimeline loanId={id} />
    </div>
  );
};

export default LoanDetails;

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    maxWidth: "600px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  primary: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
  },
  danger: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
  },
  secondary: {
    background: "#6b7280",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
  },
};

const getStatusStyle = (status) => {
  const map = {
    "In-Process": "#f59e0b",
    "Is-Disbursement": "#3b82f6",
    Completed: "green",
    Rejected: "red",
  };
  return { fontWeight: "bold", color: map[status] };
};

import { useEffect, useState } from "react";

const AgentDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    inProcess: 0,
    disbursement: 0,
    completed: 0,
    rejected: 0,
  });

  const [myLoans, setMyLoans] = useState([]);

  useEffect(() => {
    const loans = JSON.parse(localStorage.getItem("loanFiles")) || [];

    const agentLoans = loans.filter(
      (loan) => loan.createdBy === "AGENT"
    );

    setMyLoans(agentLoans);

    setStats({
      total: agentLoans.length,
      inProcess: agentLoans.filter(l => l.status === "In-Process").length,
      disbursement: agentLoans.filter(l => l.status === "Is-Disbursement").length,
      completed: agentLoans.filter(l => l.status === "Completed").length,
      rejected: agentLoans.filter(l => l.status === "Rejected").length,
    });
  }, []);

  return (
    <div>
      <h1>Agent Dashboard</h1>
      <p>Overview of your loan files</p>

      {/* STATS */}
      <div style={styles.grid}>
        <StatCard title="Total Loans" value={stats.total} />
        <StatCard title="In-Process" value={stats.inProcess} />
        <StatCard title="Disbursement" value={stats.disbursement} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Rejected" value={stats.rejected} />
      </div>

      {/* TABLE */}
      <h2 style={{ marginTop: "30px" }}>My Loan Files</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Loan Type</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {myLoans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.name || "—"}</td>
              <td>{loan.loanType}</td>
              <td>
                <span style={getStatusStyle(loan.status)}>
                  {loan.status}
                </span>
              </td>
            </tr>
          ))}

          {myLoans.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No loans created yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AgentDashboard;

/* ---------------- STAT CARD ---------------- */

const StatCard = ({ title, value }) => (
  <div style={styles.card}>
    <h4>{title}</h4>
    <h1>{value}</h1>
  </div>
);

/* ---------------- STYLES ---------------- */

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    marginTop: "15px",
    borderCollapse: "collapse",
  },
};

/* ---------------- STATUS COLOR ---------------- */

const getStatusStyle = (status) => {
  const map = {
    "In-Process": "#f59e0b",
    "Is-Disbursement": "#3b82f6",
    Completed: "green",
    Rejected: "red",
  };

  return { fontWeight: "bold", color: map[status] };
};

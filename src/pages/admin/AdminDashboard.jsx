import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    inProcess: 0,
    disbursement: 0,
    completed: 0,
    rejected: 0,
  });

  /* ---------------- SEED DATA (ONE TIME) ---------------- */
  useEffect(() => {
    if (!localStorage.getItem("users")) {
      localStorage.setItem(
        "users",
        JSON.stringify([
          { id: 1, role: "ADMIN" },
          { id: 2, role: "AGENT" },
          { id: 3, role: "AGENT" },
          { id: 4, role: "DATA_OPERATOR" },
          { id: 5, role: "BANK_EXECUTIVE" },
          { id: 6, role: "BANK_EXECUTIVE" },
        ])
      );
    }

    if (!localStorage.getItem("banks")) {
      localStorage.setItem(
        "banks",
        JSON.stringify([
          { id: 1, name: "HDFC", active: true },
          { id: 2, name: "ICICI", active: true },
          { id: 3, name: "SBI", active: true },
          { id: 4, name: "Axis", active: false },
        ])
      );
    }

    if (!localStorage.getItem("documents")) {
      localStorage.setItem(
        "documents",
        JSON.stringify([
          { id: 1, status: "Pending" },
          { id: 2, status: "Pending" },
          { id: 3, status: "Submitted" },
          { id: 4, status: "Verified" },
          { id: 5, status: "Rejected" },
          { id: 6, status: "Verified" },
        ])
      );
    }
  }, []);

  /* ---------------- LOAD LOAN STATS ---------------- */
  useEffect(() => {
    const loans = (JSON.parse(localStorage.getItem("loanFiles")) || []).filter(
      (l) => l.status !== "Deleted"
    );

    setStats({
      total: loans.length,
      inProcess: loans.filter((l) => l.status === "In-Process").length,
      disbursement: loans.filter((l) => l.status === "Is-Disbursement").length,
      completed: loans.filter((l) => l.status === "Completed").length,
      rejected: loans.filter((l) => l.status === "Rejected").length,
    });
  }, []);

  /* ---------------- USER STATS ---------------- */
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userStats = {
    totalUsers: users.length,
    agents: users.filter((u) => u.role === "AGENT").length,
    dataOperators: users.filter((u) => u.role === "DATA_OPERATOR").length,
    bankExecutives: users.filter((u) => u.role === "BANK_EXECUTIVE").length,
  };

  /* ---------------- BANK STATS ---------------- */
  const banks = JSON.parse(localStorage.getItem("banks")) || [];
  const loans = JSON.parse(localStorage.getItem("loanFiles")) || [];

  const totalBanks = banks.length;
  const activeBanks = banks.filter((b) => b.active).length;
  const inactiveBanks = banks.filter((b) => !b.active).length;

  const bankLoanCount = {};
  loans.forEach((loan) => {
    if (!loan.bankName) return;
    bankLoanCount[loan.bankName] = (bankLoanCount[loan.bankName] || 0) + 1;
  });

  const topBank =
    Object.keys(bankLoanCount).length > 0
      ? Object.keys(bankLoanCount).reduce((a, b) =>
          bankLoanCount[a] > bankLoanCount[b] ? a : b
        )
      : "N/A";

  /* ---------------- DOCUMENT STATS ---------------- */
  const documents = JSON.parse(localStorage.getItem("documents")) || [];

  const docStats = {
    pending: documents.filter((d) => d.status === "Pending").length,
    submitted: documents.filter((d) => d.status === "Submitted").length,
    verified: documents.filter((d) => d.status === "Verified").length,
    rejected: documents.filter((d) => d.status === "Rejected").length,
  };

  /* ---------------- COMMISSION SNAPSHOT ---------------- */
  const COMMISSION_RATE = 0.01;

  const disbursedLoans = loans.filter(
    (loan) => loan.status === "Is-Disbursement"
  );

  const totalCommission = disbursedLoans.reduce((sum, loan) => {
    const amount = Number(String(loan.amount).replace(/,/g, "") || 0);
    return sum + amount * COMMISSION_RATE;
  }, 0);

  const paidCommission = totalCommission * 0.7;
  const pendingCommission = totalCommission * 0.3;

  /* ---------------- CHART DATA ---------------- */
  const barData = [
    { name: "In-Process", value: stats.inProcess },
    { name: "Disbursement", value: stats.disbursement },
    { name: "Completed", value: stats.completed },
    { name: "Rejected", value: stats.rejected },
  ];

  const pieData = [
    { name: "In-Process", value: stats.inProcess, color: "#FF6B35" },
    { name: "Disbursement", value: stats.disbursement, color: "#004E89" },
    { name: "Completed", value: stats.completed, color: "#1FA883" },
    { name: "Rejected", value: stats.rejected, color: "#DC2626" },
  ];

  const trendData = [
    { month: "Jan", loans: 8, revenue: 450 },
    { month: "Feb", loans: 12, revenue: 680 },
    { month: "Mar", loans: 15, revenue: 820 },
    { month: "Apr", loans: 10, revenue: 590 },
    { month: "May", loans: 18, revenue: 950 },
    { month: "Jun", loans: 22, revenue: 1200 },
  ];

  const completionRate =
    stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;

  const handleCreateLoan = () => {
    console.log("Create Loan clicked");
    navigate("/admin/create-loan");
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e8f0fe 100%);
          padding: 1.5rem;
          padding-top: 80px;
          max-width: 1600px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease-out;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px rgba(0, 78, 137, 0.08);
          animation: slideInRight 0.7s ease-out;
          position: relative;
          z-index: 10;
        }

        .header-content h1 {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 800;
          background: linear-gradient(135deg, #004E89 0%, #0066b2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.25rem 0;
          letter-spacing: -0.02em;
        }

        .header-content p {
          color: #64748b;
          font-size: clamp(0.75rem, 2vw, 0.875rem);
          margin: 0;
          font-weight: 400;
        }

        .header-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          position: relative;
          z-index: 11;
        }

        .create-btn, .logout-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          z-index: 12;
          pointer-events: auto;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .create-btn::before, .logout-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
          z-index: -1;
        }

        .create-btn:active, .logout-btn:active {
          transform: scale(0.95);
        }

        .create-btn:hover::before, .logout-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .create-btn {
          background: linear-gradient(135deg, #004E89 0%, #0066b2 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(0, 78, 137, 0.3);
        }

        .create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 78, 137, 0.4);
        }

        .logout-btn {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .logout-btn:hover {
          background: #fef2f2;
          color: #DC2626;
          border-color: #DC2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: scaleIn 0.5s ease-out backwards;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-card:hover {
          border-color: var(--hover-border, #cbd5e1);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.15s; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; }
        .stat-card:nth-child(5) { animation-delay: 0.3s; }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          background: var(--accent-bg);
          transition: transform 0.3s ease;
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .stat-label {
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
          font-family: 'JetBrains Mono', monospace;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .trend-up { 
          color: #10b981;
          animation: pulse 2s infinite;
        }
        .trend-down { 
          color: #ef4444;
        }

        /* Insight Cards */
        .insight-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .insight-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(226, 232, 240, 0.6);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out backwards;
        }

        .insight-card:nth-child(1) { animation-delay: 0.2s; }
        .insight-card:nth-child(2) { animation-delay: 0.3s; }
        .insight-card:nth-child(3) { animation-delay: 0.4s; }

        .insight-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-accent);
          transition: height 0.3s ease;
        }

        .insight-card:hover::before {
          height: 6px;
        }

        .insight-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
        }

        .insight-card h3 {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin: 0 0 1rem 0;
        }

        .insight-value {
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
          font-family: 'JetBrains Mono', monospace;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .insight-description {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.5;
        }

        /* Section Title */
        .section-title {
          font-size: clamp(1.125rem, 2.5vw, 1.25rem);
          font-weight: 700;
          color: #0f172a;
          margin: 2.5rem 0 1.25rem 0;
          padding-left: 1rem;
          border-left: 4px solid #004E89;
          animation: slideInRight 0.6s ease-out;
          position: relative;
          z-index: 1;
        }

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .chart-card {
          background: white;
          border-radius: 16px;
          padding: 1.75rem;
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: scaleIn 0.6s ease-out backwards;
        }

        .chart-card:nth-child(1) { animation-delay: 0.1s; }
        .chart-card:nth-child(2) { animation-delay: 0.2s; }
        .chart-card:nth-child(3) { animation-delay: 0.3s; }
        .chart-card:nth-child(4) { animation-delay: 0.4s; }

        .chart-card:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .chart-title {
          font-size: clamp(0.875rem, 2vw, 1rem);
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .chart-badge {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
          padding: 0.375rem 0.875rem;
          border-radius: 8px;
          font-size: 0.6875rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid #cbd5e1;
        }

        /* Color Variants */
        .stat-card.total { 
          --accent-bg: linear-gradient(135deg, rgba(0, 78, 137, 0.1) 0%, rgba(0, 78, 137, 0.05) 100%);
          --hover-border: #004E89;
        }
        .stat-card.process { 
          --accent-bg: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
          --hover-border: #FF6B35;
        }
        .stat-card.disbursement { 
          --accent-bg: linear-gradient(135deg, rgba(0, 78, 137, 0.1) 0%, rgba(0, 78, 137, 0.05) 100%);
          --hover-border: #004E89;
        }
        .stat-card.completed { 
          --accent-bg: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
          --hover-border: #10b981;
        }
        .stat-card.rejected { 
          --accent-bg: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
          --hover-border: #ef4444;
        }

        .insight-card:nth-child(1) { --card-accent: linear-gradient(90deg, #004E89 0%, #0066b2 100%); }
        .insight-card:nth-child(2) { --card-accent: linear-gradient(90deg, #10b981 0%, #059669 100%); }
        .insight-card:nth-child(3) { --card-accent: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }
        }

        @media (max-width: 968px) {
          .dashboard-container {
            padding: 1rem;
            padding-top: 80px;
          }

          .dashboard-header {
            padding: 1.25rem;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1rem;
          }

          .insight-cards {
            grid-template-columns: 1fr;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding-top: 75px;
          }

          .dashboard-header {
            z-index: 10;
          }

          .header-buttons {
            z-index: 11;
          }

          .create-btn, .logout-btn {
            z-index: 12;
            min-height: 44px;
          }
        }

        @media (max-width: 640px) {
          .dashboard-container {
            padding: 0.75rem;
            padding-top: 70px;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            padding: 1rem;
            z-index: 10;
          }

          .header-buttons {
            width: 100%;
            flex-direction: column;
            z-index: 11;
          }

          .create-btn, .logout-btn {
            width: 100%;
            justify-content: center;
            padding: 1rem 1.5rem;
            font-size: 0.9375rem;
            z-index: 12;
            min-height: 48px;
            -webkit-user-select: none;
            user-select: none;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1.25rem;
          }

          .insight-card {
            padding: 1.5rem;
          }

          .chart-card {
            padding: 1.25rem;
          }

          .section-title {
            font-size: 1.125rem;
            margin: 2rem 0 1rem 0;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding-top: 65px;
          }

          .create-btn, .logout-btn {
            font-size: 0.875rem;
            padding: 0.9375rem 1.25rem;
            min-height: 46px;
          }
        }

        @media (max-width: 400px) {
          .header-content h1 {
            font-size: 1.25rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .insight-value {
            font-size: 1.75rem;
          }

          .create-btn, .logout-btn {
            font-size: 0.875rem;
            padding: 0.875rem 1.125rem;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Comprehensive overview of loan operations and performance</p>
          </div>
          <div className="header-buttons">
            <button
              className="create-btn"
              onClick={handleCreateLoan}
              type="button"
            >
              <span>➕</span>
              <span>Create Loan</span>
            </button>
            <button
              className="logout-btn"
              onClick={handleLogout}
              type="button"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* PRIMARY STATS */}
        <div className="stats-grid">
          <StatCard
            icon="📊"
            label="Total Loans"
            value={stats.total}
            trend="+12%"
            trendUp={true}
            variant="total"
          />
          <StatCard
            icon="⏳"
            label="In-Process"
            value={stats.inProcess}
            trend="+5%"
            trendUp={true}
            variant="process"
          />
          <StatCard
            icon="💰"
            label="Disbursement"
            value={stats.disbursement}
            trend="+8%"
            trendUp={true}
            variant="disbursement"
          />
          <StatCard
            icon="✅"
            label="Completed"
            value={stats.completed}
            trend="+15%"
            trendUp={true}
            variant="completed"
          />
          <StatCard
            icon="❌"
            label="Rejected"
            value={stats.rejected}
            trend="-3%"
            trendUp={false}
            variant="rejected"
          />
        </div>

        {/* KEY INSIGHTS */}
        <div className="insight-cards">
          <div className="insight-card">
            <h3>Completion Rate</h3>
            <div className="insight-value">{completionRate}%</div>
            <p className="insight-description">
              Success rate across all loan applications
            </p>
          </div>
          <div className="insight-card">
            <h3>Active Users</h3>
            <div className="insight-value">{userStats.totalUsers}</div>
            <p className="insight-description">
              Team members managing operations
            </p>
          </div>
          <div className="insight-card">
            <h3>Bank Partners</h3>
            <div className="insight-value">{activeBanks}/{totalBanks}</div>
            <p className="insight-description">
              Active banking partnerships
            </p>
          </div>
        </div>

        {/* PERFORMANCE ANALYTICS */}
        <h2 className="section-title">Performance Analytics</h2>
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Loan Status Distribution</h3>
              <span className="chart-badge">Live</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis
                  dataKey="name"
                  stroke="#cbd5e1"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <YAxis
                  stroke="#cbd5e1"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#FF6B35"
                          : index === 1
                          ? "#004E89"
                          : index === 2
                          ? "#10b981"
                          : "#ef4444"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Status Overview</h3>
              <span className="chart-badge">Real-Time</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={55}
                  label={({ value }) => value > 0 ? value : ""}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">6-Month Loan Trend</h3>
              <span className="chart-badge">+45% Growth</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004E89" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#004E89" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#cbd5e1"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <YAxis
                  stroke="#cbd5e1"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="loans"
                  stroke="#004E89"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLoans)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Revenue Performance</h3>
              <span className="chart-badge">₹12.8M YTD</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <XAxis
                  dataKey="month"
                  stroke="#cbd5e1"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <YAxis
                  stroke="#cbd5e1"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TEAM OVERVIEW */}
        <h2 className="section-title">Team Overview</h2>
        <div className="stats-grid">
          <StatCard icon="👥" label="Total Users" value={userStats.totalUsers} variant="total" />
          <StatCard icon="🎯" label="Agents" value={userStats.agents} variant="process" />
          <StatCard icon="📝" label="Data Operators" value={userStats.dataOperators} variant="disbursement" />
          <StatCard icon="🏦" label="Bank Executives" value={userStats.bankExecutives} variant="completed" />
        </div>

        {/* BANK & DOCUMENTS */}
        <h2 className="section-title">Operations Status</h2>
        <div className="stats-grid">
          <StatCard icon="🏛️" label="Total Banks" value={totalBanks} variant="total" />
          <StatCard icon="✅" label="Active Banks" value={activeBanks} variant="completed" />
          <StatCard icon="⏸️" label="Inactive Banks" value={inactiveBanks} variant="rejected" />
          <StatCard icon="⏰" label="Pending Docs" value={docStats.pending} variant="process" />
          <StatCard icon="✓" label="Verified Docs" value={docStats.verified} variant="completed" />
        </div>

        {/* COMMISSION */}
        <h2 className="section-title">Commission Overview</h2>
        <div className="stats-grid">
          <StatCard
            icon="💰"
            label="Total Commission"
            value={`₹${(totalCommission/1000).toFixed(1)}K`}
            variant="total"
            isText={true}
          />
          <StatCard
            icon="✅"
            label="Paid"
            value={`₹${(paidCommission/1000).toFixed(1)}K`}
            variant="completed"
            isText={true}
          />
          <StatCard
            icon="⏳"
            label="Pending"
            value={`₹${(pendingCommission/1000).toFixed(1)}K`}
            variant="process"
            isText={true}
          />
          <StatCard
            icon="📋"
            label="Disbursed Files"
            value={disbursedLoans.length}
            variant="disbursement"
          />
        </div>
      </div>
    </>
  );
};

const StatCard = ({ icon, label, value, trend, trendUp, variant, isText }) => (
  <div className={`stat-card ${variant}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value" style={isText ? { fontSize: '1.5rem', fontFamily: 'Inter' } : {}}>
      {value}
    </div>
    {trend && (
      <div className={`stat-trend ${trendUp ? "trend-up" : "trend-down"}`}>
        <span>{trendUp ? "↗" : "↘"}</span>
        <span>{trend}</span>
      </div>
    )}
  </div>
);

export default AdminDashboard;
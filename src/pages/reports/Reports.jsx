import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Reports = () => {
  const navigate = useNavigate();

  /* ---------------- LOAD DATA & CALCULATE STATS ---------------- */
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalFiles: 0,
    totalCommission: 0,
    totalBanks: 0,
    activeFiles: 0,
    completedFiles: 0,
  });

  useEffect(() => {
    // Load all data from localStorage
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const loanFiles = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const commissions = JSON.parse(localStorage.getItem("commissions")) || [];
    const banks = JSON.parse(localStorage.getItem("banks")) || [];

    // Calculate commission total
    const totalCommissionAmount = commissions.reduce(
      (sum, comm) => sum + (comm.commission_amount || 0),
      0
    );

    // Count active and completed files (from status module)
    const statusData = JSON.parse(localStorage.getItem("fileStatus")) || [];
    const activeFilesCount = statusData.filter(
      (s) => s.current_status === "Under Review" || s.current_status === "Document Verification"
    ).length;
    const completedFilesCount = statusData.filter(
      (s) => s.current_status === "Approved" || s.current_status === "Disbursed"
    ).length;

    setStats({
      totalCustomers: customers.length,
      totalFiles: loanFiles.length,
      totalCommission: totalCommissionAmount,
      totalBanks: banks.length,
      activeFiles: activeFilesCount,
      completedFiles: completedFilesCount,
    });
  }, []);

  /* ---------------- FORMAT CURRENCY ---------------- */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /* ---------------- REPORT TYPES ---------------- */
  const reportTypes = [
    {
      id: 1,
      title: "Customer Reports",
      description: "View customer analytics, demographics, and loan history",
      icon: "👥",
      color: "#3b82f6",
      route: "/admin/reports/customers",
    },
    {
      id: 2,
      title: "Loan File Reports",
      description: "Analyze files by status, bank, loan type, and date range",
      icon: "📁",
      color: "#10b981",
      route: "/admin/reports/files",
    },
    {
      id: 3,
      title: "Commission Reports",
      description: "Track commissions, payment status, and earnings",
      icon: "💰",
      color: "#f59e0b",
      route: "/admin/reports/commissions",
    },
    {
      id: 4,
      title: "Bank Performance",
      description: "Compare bank-wise loan approvals and disbursements",
      icon: "🏦",
      color: "#8b5cf6",
      route: "/admin/reports/banks",
    },
    {
      id: 5,
      title: "Executive Performance",
      description: "Track executive assignments and completion rates",
      icon: "👔",
      color: "#ec4899",
      route: "/admin/reports/executives",
    },
    {
      id: 6,
      title: "Status Timeline",
      description: "View file status progression and processing time",
      icon: "📊",
      color: "#06b6d4",
      route: "/admin/reports/status",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .reports-container {
          font-family: 'Inter', sans-serif;
          padding: 2.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        /* Header */
        .reports-header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          margin-bottom: 2.5rem;
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.25);
          position: relative;
          overflow: hidden;
        }

        .reports-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .header-content {
          position: relative;
          z-index: 1;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          margin: 0 0 0.75rem 0;
          letter-spacing: -0.03em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .page-subtitle {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.1rem;
          margin: 0;
          font-weight: 500;
        }

        /* Stats Overview */
        .stats-overview {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: white;
          padding: 1.75rem;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, var(--stat-color), var(--stat-color-dark));
          color: white;
        }

        .stat-card.customers { --stat-color: #3b82f6; --stat-color-dark: #2563eb; }
        .stat-card.files { --stat-color: #10b981; --stat-color-dark: #059669; }
        .stat-card.commission { --stat-color: #f59e0b; --stat-color-dark: #d97706; }
        .stat-card.banks { --stat-color: #8b5cf6; --stat-color-dark: #7c3aed; }
        .stat-card.active { --stat-color: #06b6d4; --stat-color-dark: #0891b2; }
        .stat-card.completed { --stat-color: #10b981; --stat-color-dark: #059669; }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 900;
          color: #0f172a;
          font-family: 'JetBrains Mono', monospace;
        }

        /* Reports Grid */
        .reports-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .report-card {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .report-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-color);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .report-card:hover::before {
          transform: scaleX(1);
        }

        .report-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .report-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          background: var(--card-color);
          color: white;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .report-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.75rem 0;
        }

        .report-description {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .report-action {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--card-color);
          font-weight: 700;
          font-size: 0.95rem;
          transition: gap 0.3s;
        }

        .report-card:hover .report-action {
          gap: 1rem;
        }

        /* Responsive */
        @media (max-width: 1400px) {
          .stats-overview {
            grid-template-columns: repeat(3, 1fr);
          }

          .reports-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 968px) {
          .reports-container {
            padding: 1.5rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .stats-overview {
            grid-template-columns: repeat(2, 1fr);
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <div className="header-content">
            <h1 className="page-title">📊 Reports & Analytics</h1>
            <p className="page-subtitle">
              Generate comprehensive reports and analyze your business performance
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card customers">
            <div className="stat-icon">👥</div>
            <div className="stat-label">Total Customers</div>
            <div className="stat-value">{stats.totalCustomers}</div>
          </div>

          <div className="stat-card files">
            <div className="stat-icon">📁</div>
            <div className="stat-label">Total Files</div>
            <div className="stat-value">{stats.totalFiles}</div>
          </div>

          <div className="stat-card commission">
            <div className="stat-icon">💰</div>
            <div className="stat-label">Total Commission</div>
            <div className="stat-value">{formatCurrency(stats.totalCommission)}</div>
          </div>

          <div className="stat-card banks">
            <div className="stat-icon">🏦</div>
            <div className="stat-label">Total Banks</div>
            <div className="stat-value">{stats.totalBanks}</div>
          </div>

          <div className="stat-card active">
            <div className="stat-icon">🔄</div>
            <div className="stat-label">Active Files</div>
            <div className="stat-value">{stats.activeFiles}</div>
          </div>

          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completedFiles}</div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="reports-grid">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className="report-card"
              style={{ "--card-color": report.color }}
              onClick={() => navigate(report.route)}
            >
              <div className="report-icon">{report.icon}</div>
              <h3 className="report-title">{report.title}</h3>
              <p className="report-description">{report.description}</p>
              <div className="report-action">
                <span>View Report</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Reports;
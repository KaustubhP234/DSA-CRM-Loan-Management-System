import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const StatusDashboard = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [allFiles, setAllFiles] = useState([]);
  const [statusData, setStatusData] = useState([]);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    // Load all loan files
    const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
    setAllFiles(files);

    // Load status history
    const status = JSON.parse(localStorage.getItem("statusHistory")) || [];
    setStatusData(status);
  }, []);

  /* ---------------- CALCULATE STATISTICS ---------------- */
  const stats = {
    total: allFiles.length,
    inProcess: allFiles.filter(f => f.fileStatus === "In-Process" || f.status === "In-Process").length,
    login: allFiles.filter(f => f.fileStatus === "Login" || f.status === "Login").length,
    query: allFiles.filter(f => f.fileStatus === "Query" || f.status === "Query").length,
    active: allFiles.filter(f => f.fileStatus === "Active" || f.status === "Active").length,
    sanctioned: allFiles.filter(f => f.fileStatus === "Sanctioned" || f.status === "Sanctioned").length,
    rejected: allFiles.filter(f => f.fileStatus === "Rejected" || f.status === "Rejected").length,
    disbursement: allFiles.filter(f => f.fileStatus === "Disbursement" || f.status === "Disbursement").length,
  };

  /* ---------------- STATUS CARDS DATA ---------------- */
  const statusCards = [
    {
      id: "in-process",
      title: "In-Process",
      count: stats.inProcess,
      icon: "⏳",
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
      route: "/admin/status/in-process"
    },
    {
      id: "login",
      title: "Login",
      count: stats.login,
      icon: "🔐",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
      route: "/admin/status/login"
    },
    {
      id: "query",
      title: "Query",
      count: stats.query,
      icon: "❓",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      route: "/admin/status/query"
    },
    {
      id: "active",
      title: "Active",
      count: stats.active,
      icon: "✅",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      route: "/admin/status/active"
    },
    {
      id: "sanctioned",
      title: "Sanctioned",
      count: stats.sanctioned,
      icon: "💰",
      color: "#06b6d4",
      bgColor: "rgba(6, 182, 212, 0.1)",
      route: "/admin/status/sanctioned"
    },
    {
      id: "rejected",
      title: "Rejected",
      count: stats.rejected,
      icon: "❌",
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
      route: "/admin/status/rejected"
    },
    {
      id: "disbursement",
      title: "Disbursement",
      count: stats.disbursement,
      icon: "💸",
      color: "#14b8a6",
      bgColor: "rgba(20, 184, 166, 0.1)",
      route: "/admin/status/disbursement"
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .status-dashboard-container {
          font-family: 'Inter', sans-serif;
          padding: 2.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        /* Header */
        .page-header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(30, 41, 59, 0.25);
          position: relative;
          overflow: hidden;
        }

        .page-header-section::before {
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

        .update-status-btn {
          padding: 1rem 2rem;
          background: white;
          color: #1e293b;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 1;
        }

        .update-status-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        /* Overview Card */
        .overview-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 2.5rem;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .overview-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .overview-item {
          text-align: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 12px;
          border: 2px solid #e2e8f0;
        }

        .overview-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .overview-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #0f172a;
          font-family: 'JetBrains Mono', monospace;
        }

        /* Status Cards Grid */
        .status-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .status-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .status-card::before {
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

        .status-card:hover::before {
          transform: scaleX(1);
        }

        .status-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .status-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .status-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          background: var(--card-bg-color);
          color: var(--card-color);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .status-card-body h3 {
          font-size: 0.875rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0 0 0.75rem 0;
        }

        .status-count {
          font-size: 2.5rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 0.75rem 0;
          font-family: 'JetBrains Mono', monospace;
        }

        .view-details-link {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--card-color);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .view-details-link:hover {
          gap: 0.75rem;
        }

        /* Recent Activity */
        .recent-activity-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .activity-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 0.25rem 0;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #64748b;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        @media (max-width: 1200px) {
          .overview-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .status-cards-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .status-dashboard-container {
            padding: 1.5rem;
          }

          .page-header-section {
            flex-direction: column;
            gap: 1.5rem;
            padding: 2rem 1.5rem;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .status-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="status-dashboard-container">
        {/* Header */}
        <div className="page-header-section">
          <div className="header-content">
            <h1 className="page-title">📊 Status Management</h1>
            <p className="page-subtitle">Track and manage loan file statuses</p>
          </div>
          <button
            className="update-status-btn"
            onClick={() => navigate("/admin/status/update")}
          >
            <span>🔄</span>
            <span>Update Status</span>
          </button>
        </div>

        {/* Overview Card */}
        <div className="overview-card">
          <h2 className="overview-title">
            <span>📈</span>
            <span>Overview</span>
          </h2>
          <div className="overview-grid">
            <div className="overview-item">
              <div className="overview-label">Total Files</div>
              <div className="overview-value">{stats.total}</div>
            </div>
            <div className="overview-item">
              <div className="overview-label">Pending</div>
              <div className="overview-value">{stats.inProcess + stats.login + stats.query}</div>
            </div>
            <div className="overview-item">
              <div className="overview-label">Approved</div>
              <div className="overview-value">{stats.sanctioned}</div>
            </div>
            <div className="overview-item">
              <div className="overview-label">Completed</div>
              <div className="overview-value">{stats.disbursement}</div>
            </div>
          </div>
        </div>

        {/* Status Cards Grid */}
        <div className="status-cards-grid">
          {statusCards.map((card) => (
            <div
              key={card.id}
              className="status-card"
              style={{ "--card-color": card.color, "--card-bg-color": card.bgColor }}
              onClick={() => navigate(card.route)}
            >
              <div className="status-card-header">
                <div className="status-icon-box">
                  {card.icon}
                </div>
              </div>
              <div className="status-card-body">
                <h3>{card.title}</h3>
                <div className="status-count">{card.count}</div>
                <span className="view-details-link">
                  View Details
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="recent-activity-card">
          <h2 className="activity-title">
            <span>🕐</span>
            <span>Recent Status Changes</span>
          </h2>
          {statusData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No recent activity</h3>
              <p>Status changes will appear here</p>
            </div>
          ) : (
            <div className="activity-list">
              {statusData.slice(-5).reverse().map((item, index) => (
                <div key={index} className="activity-item">
                  <div
                    className="activity-icon"
                    style={{
                      background:
                        item.new_status === "Disbursement"
                          ? "rgba(20, 184, 166, 0.1)"
                          : item.new_status === "Sanctioned"
                          ? "rgba(6, 182, 212, 0.1)"
                          : item.new_status === "Rejected"
                          ? "rgba(239, 68, 68, 0.1)"
                          : "rgba(59, 130, 246, 0.1)",
                      color:
                        item.new_status === "Disbursement"
                          ? "#14b8a6"
                          : item.new_status === "Sanctioned"
                          ? "#06b6d4"
                          : item.new_status === "Rejected"
                          ? "#ef4444"
                          : "#3b82f6",
                    }}
                  >
                    {item.new_status === "Disbursement"
                      ? "💸"
                      : item.new_status === "Sanctioned"
                      ? "💰"
                      : item.new_status === "Rejected"
                      ? "❌"
                      : "📋"}
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">
                      File #{item.file_id} moved to {item.new_status}
                    </div>
                    <div className="activity-time">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StatusDashboard;
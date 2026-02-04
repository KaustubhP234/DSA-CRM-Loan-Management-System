import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const DataOperatorDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    todayCustomers: 0,
    todayFiles: 0,
    todayDocuments: 0,
    pendingTasks: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadStats();
    loadRecentActivity();
  }, []);

  const loadStats = () => {
    const today = new Date().toISOString().split('T')[0];

    // Get today's customers
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const todayCustomers = customers.filter(c => 
      (c.registrationDate || c.created_date || "").startsWith(today)
    ).length;

    // Get today's files
    const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const todayFiles = files.filter(f => 
      (f.createdDate || f.date_of_registration || "").startsWith(today)
    ).length;

    // Get today's documents
    const docs = JSON.parse(localStorage.getItem("documents")) || [];
    const todayDocuments = docs.filter(d => 
      (d.date || d.submission_date || d.date_of_submission || "").startsWith(today)
    ).length;

    // Get pending tasks (files without documents)
    const filesWithoutDocs = files.filter(file => {
      const fileDocs = docs.filter(d => String(d.file_id) === String(file.id));
      return fileDocs.length === 0;
    }).length;

    setStats({
      todayCustomers,
      todayFiles,
      todayDocuments,
      pendingTasks: filesWithoutDocs,
    });
  };

  const loadRecentActivity = () => {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const docs = JSON.parse(localStorage.getItem("documents")) || [];

    const activities = [];

    // Recent customers
    customers.slice(-5).reverse().forEach(c => {
      activities.push({
        type: "customer",
        icon: "👤",
        title: "New Customer Registered",
        description: c.name,
        date: c.registrationDate || c.created_date,
        color: "#3b82f6",
      });
    });

    // Recent files
    files.slice(-5).reverse().forEach(f => {
      activities.push({
        type: "file",
        icon: "📋",
        title: "New Loan File Created",
        description: `${f.id} - ${f.customerName || f.customer_name}`,
        date: f.createdDate || f.date_of_registration,
        color: "#8b5cf6",
      });
    });

    // Recent documents
    docs.slice(-5).reverse().forEach(d => {
      activities.push({
        type: "document",
        icon: "📄",
        title: "Document Uploaded",
        description: `${d.name || d.document_name} for ${d.customer_name}`,
        date: d.date || d.submission_date,
        color: "#10b981",
      });
    });

    // Sort by date and take top 10
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentActivity(activities.slice(0, 10));
  };

  const quickActions = [
    {
      title: "Register Customer",
      description: "Add new customer to system",
      icon: "👤",
      color: "#3b82f6",
      path: "/data-operator/create-customer",
    },
    {
      title: "Create Loan File",
      description: "Create new loan application",
      icon: "📋",
      color: "#8b5cf6",
      path: "/data-operator/create-loan",
    },
    {
      title: "Upload Document",
      description: "Upload customer documents",
      icon: "📄",
      color: "#10b981",
      path: "/data-operator/upload-document",
    },
    {
      title: "View Customers",
      description: "Browse all customers",
      icon: "👥",
      color: "#f59e0b",
      path: "/data-operator/customers",
    },
    {
      title: "View Loan Files",
      description: "Browse all loan files",
      icon: "📁",
      color: "#ec4899",
      path: "/data-operator/loan-files",
    },
    {
      title: "View Documents",
      description: "Browse all documents",
      icon: "📑",
      color: "#06b6d4",
      path: "/data-operator/documents",
    },
  ];

  // Refresh stats when window regains focus (when user comes back from other pages)
  useEffect(() => {
    const handleFocus = () => {
      loadStats();
      loadRecentActivity();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .data-operator-dashboard {
          font-family: 'Inter', sans-serif;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        /* Header */
        .dashboard-header {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
          color: white;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .welcome-text h1 {
          font-size: 2rem;
          font-weight: 900;
          margin: 0 0 0.5rem 0;
        }

        .welcome-text p {
          font-size: 1rem;
          margin: 0;
          opacity: 0.9;
        }

        .current-date {
          font-size: 0.875rem;
          opacity: 0.9;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 2px solid #e2e8f0;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--stat-color);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: var(--stat-bg);
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 0.25rem 0;
          font-family: monospace;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Quick Actions */
        .section-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .action-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 2px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          border-color: var(--action-color);
        }

        .action-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--action-color);
          transform: scaleX(0);
          transition: transform 0.3s;
        }

        .action-card:hover::after {
          transform: scaleX(1);
        }

        .action-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          background: var(--action-bg);
          margin-bottom: 1rem;
        }

        .action-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
        }

        .action-description {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        /* Recent Activity */
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .activity-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 2px solid #e2e8f0;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 10px;
          border-left: 3px solid var(--activity-color);
          transition: all 0.2s;
        }

        .activity-item:hover {
          background: #f1f5f9;
          transform: translateX(4px);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          background: white;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.25rem 0;
        }

        .activity-description {
          font-size: 0.8125rem;
          color: #64748b;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .activity-date {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 0.25rem;
        }

        /* Tips Card */
        .tips-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 12px;
          padding: 1.5rem;
          border: 2px solid #86efac;
        }

        .tips-title {
          font-size: 1rem;
          font-weight: 700;
          color: #166534;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tip-item {
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          margin-bottom: 0.75rem;
          border-left: 3px solid #22c55e;
        }

        .tip-item:last-child {
          margin-bottom: 0;
        }

        .tip-text {
          font-size: 0.8125rem;
          color: #166534;
          margin: 0;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.4;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .data-operator-dashboard {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions-grid {
            grid-template-columns: 1fr;
          }

          .header-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>

      <div className="data-operator-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-top">
            <div className="welcome-text">
              <h1>👋 Welcome, Data Operator!</h1>
              <p>Quick access to your daily tasks and operations</p>
            </div>
            <div className="current-date">
              📅 {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card" style={{ '--stat-color': '#3b82f6', '--stat-bg': '#dbeafe' }}>
            <div className="stat-header">
              <div className="stat-icon">👤</div>
            </div>
            <div className="stat-value">{stats.todayCustomers}</div>
            <div className="stat-label">Customers Today</div>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#8b5cf6', '--stat-bg': '#ede9fe' }}>
            <div className="stat-header">
              <div className="stat-icon">📋</div>
            </div>
            <div className="stat-value">{stats.todayFiles}</div>
            <div className="stat-label">Files Created Today</div>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#10b981', '--stat-bg': '#d1fae5' }}>
            <div className="stat-header">
              <div className="stat-icon">📄</div>
            </div>
            <div className="stat-value">{stats.todayDocuments}</div>
            <div className="stat-label">Documents Uploaded</div>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#f59e0b', '--stat-bg': '#fef3c7' }}>
            <div className="stat-header">
              <div className="stat-icon">⏳</div>
            </div>
            <div className="stat-value">{stats.pendingTasks}</div>
            <div className="stat-label">Pending Tasks</div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="section-title">⚡ Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="action-card"
              style={{ '--action-color': action.color, '--action-bg': action.color + '15' }}
              onClick={() => navigate(action.path)}
            >
              <div className="action-icon" style={{ background: action.color + '15' }}>
                {action.icon}
              </div>
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity & Tips */}
        <div className="content-grid">
          {/* Recent Activity */}
          <div className="activity-card">
            <h2 className="section-title">📊 Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No recent activity</h3>
                <p>Your recent actions will appear here</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="activity-item"
                    style={{ '--activity-color': activity.color }}
                  >
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.title}</div>
                      <div className="activity-description">{activity.description}</div>
                      <div className="activity-date">{activity.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Productivity Tips */}
          <div className="tips-card">
            <h3 className="tips-title">💡 Productivity Tips</h3>
            <div className="tip-item">
              <p className="tip-text">
                <strong>Tip 1:</strong> Always verify customer details before creating a loan file
              </p>
            </div>
            <div className="tip-item">
              <p className="tip-text">
                <strong>Tip 2:</strong> Upload all required documents immediately after file creation
              </p>
            </div>
            <div className="tip-item">
              <p className="tip-text">
                <strong>Tip 3:</strong> Double-check document types to avoid rejection
              </p>
            </div>
            <div className="tip-item">
              <p className="tip-text">
                <strong>Tip 4:</strong> Use clear, descriptive names for documents
              </p>
            </div>
            <div className="tip-item">
              <p className="tip-text">
                <strong>Tip 5:</strong> Review pending tasks daily to stay on track
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataOperatorDashboard;
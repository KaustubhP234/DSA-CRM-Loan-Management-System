import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BankExecutiveDashboard = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const executiveName = loggedInUser.name || loggedInUser.email?.split("@")[0] || "Executive";
  const executiveEmail = loggedInUser.email || "";

  const [assignedFiles, setAssignedFiles] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const allAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    
    const myAssignments = allAssignments.filter((assignment) => {
      const emailMatch = assignment.executive_email?.toLowerCase() === executiveEmail.toLowerCase();
      const nameMatch = 
        assignment.executive_name?.toLowerCase() === executiveName.toLowerCase() ||
        assignment.executive_name?.toLowerCase().includes(executiveName.toLowerCase()) ||
        executiveName.toLowerCase().includes(assignment.executive_name?.toLowerCase());
      
      return emailMatch || nameMatch;
    });

    setAssignedFiles(myAssignments);
    setStats({
      total: myAssignments.length,
      pending: myAssignments.filter((a) => a.assignment_status === "Pending").length,
      inProgress: myAssignments.filter((a) => a.assignment_status === "Active").length,
      completed: myAssignments.filter((a) => a.assignment_status === "Completed").length,
    });
  }, [executiveName, executiveEmail]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .dashboard-content {
          padding: 1.75rem;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 100vh;
          background: #f8fafc;
        }
        
        /* Header */
        .page-header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          padding: 1.75rem 2rem;
          border-radius: 12px;
          margin-bottom: 1.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .header-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          letter-spacing: 0.8px;
        }
        
        .header-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.35rem 0;
          letter-spacing: -0.02em;
        }
        
        .header-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
          font-weight: 400;
        }
        
        /* Stats Cards */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.75rem;
        }
        
        .stat-card {
          background: white;
          padding: 1.25rem 1.5rem;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--accent-color);
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
          border-color: var(--accent-color);
        }
        
        .stat-card:nth-child(1) { --accent-color: #3b82f6; }
        .stat-card:nth-child(2) { --accent-color: #f59e0b; }
        .stat-card:nth-child(3) { --accent-color: #8b5cf6; }
        .stat-card:nth-child(4) { --accent-color: #10b981; }
        
        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          background: var(--accent-color);
          color: white;
          opacity: 0.9;
        }
        
        .stat-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.35rem;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          line-height: 1;
        }
        
        /* Files Section */
        .files-section {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.75rem;
          border-bottom: 1px solid #e5e7eb;
          background: #fafbfc;
        }
        
        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .section-title::before {
          content: '📋';
          font-size: 1.25rem;
        }
        
        .btn-view-all {
          padding: 0.5rem 1.25rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-view-all:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }
        
        /* File Cards */
        .files-list {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .file-item {
          background: #fafbfc;
          padding: 1.25rem 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
          cursor: pointer;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 1.5rem;
          align-items: center;
        }

        .file-item:hover {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .file-id-badge {
          background: #eff6ff;
          color: #1e40af;
          padding: 0.625rem 1rem;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          border: 1px solid #bfdbfe;
        }

        .file-details-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .file-detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .file-detail-label {
          font-size: 0.7rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .file-detail-value {
          font-size: 0.9rem;
          color: #111827;
          font-weight: 600;
        }

        .file-customer-name {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .file-status-badge {
          padding: 0.4rem 0.875rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .status-active {
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #93c5fd;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        }

        .status-completed {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }
        
        .no-files {
          text-align: center;
          padding: 3rem 2rem;
        }
        
        .no-files-icon {
          font-size: 3rem;
          opacity: 0.3;
          margin-bottom: 0.75rem;
        }
        
        .no-files-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.35rem 0;
        }
        
        .no-files-text {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }

          .file-details-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-content {
            padding: 1rem;
          }

          .stats-container {
            grid-template-columns: 1fr;
          }

          .file-item {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .file-details-grid {
            grid-template-columns: 1fr;
          }

          .header-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="dashboard-content">
        {/* Header */}
        <div className="page-header">
          <div className="header-badge">Bank Executive Portal</div>
          <h1 className="header-title">Welcome, {executiveName}!</h1>
          <p className="header-subtitle">Manage your assigned loan files and track progress efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">📋</div>
            </div>
            <div className="stat-label">Total Files</div>
            <div className="stat-value">{stats.total}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">⏳</div>
            </div>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">🔄</div>
            </div>
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{stats.inProgress}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">✅</div>
            </div>
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completed}</div>
          </div>
        </div>

        {/* Files Section */}
        <div className="files-section">
          <div className="section-header">
            <h2 className="section-title">Assigned Files</h2>
            <button className="btn-view-all" onClick={() => navigate("/bank-executive/my-files")}>
              View All Files →
            </button>
          </div>

          <div className="files-list">
            {assignedFiles.length === 0 ? (
              <div className="no-files">
                <div className="no-files-icon">📂</div>
                <h3 className="no-files-title">No Files Assigned</h3>
                <p className="no-files-text">Files assigned to you will appear here</p>
              </div>
            ) : (
              assignedFiles.slice(0, 5).map((file) => (
                <div
                  key={file.id}
                  className="file-item"
                  onClick={() => navigate(`/bank-executive/file/${file.file_id}`)}
                >
                  <div className="file-id-badge">{file.file_id}</div>

                  <div>
                    <div className="file-customer-name">{file.customer_name}</div>
                    <div className="file-details-grid">
                      <div className="file-detail-item">
                        <span className="file-detail-label">Loan Type</span>
                        <span className="file-detail-value">{file.loan_type}</span>
                      </div>
                      <div className="file-detail-item">
                        <span className="file-detail-label">Amount</span>
                        <span className="file-detail-value">{formatCurrency(file.loan_amount)}</span>
                      </div>
                      <div className="file-detail-item">
                        <span className="file-detail-label">Bank</span>
                        <span className="file-detail-value">{file.bank_name}</span>
                      </div>
                      <div className="file-detail-item">
                        <span className="file-detail-label">Assigned Date</span>
                        <span className="file-detail-value">{file.assigned_date}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`file-status-badge status-${file.assignment_status.toLowerCase()}`}>
                    {file.assignment_status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BankExecutiveDashboard;
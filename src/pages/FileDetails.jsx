import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const FileDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  /* ---------- CONTEXT DETECTION ---------- */
  const isExecutiveContext = location.pathname.includes("/bank-executive");
  const isAdminContext = location.pathname.includes("/admin");
  const isDataOperatorContext = location.pathname.includes("/data-operator");

  /* ---------- STATE ---------- */
  const [file, setFile] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const foundFile = files.find(f => String(f.id) === String(id));

    if (!foundFile) {
      navigate(-1);
      return;
    }

    setFile(foundFile);

    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    setCustomer(
      customers.find(c =>
        String(c.id) === String(foundFile.customerId || foundFile.customer_id)
      )
    );

    const assignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    const foundAssignment = assignments.find(a => String(a.file_id) === String(id));
    setAssignment(foundAssignment);

    setLoading(false);
  }, [id, navigate]);

  /* ---------- NAVIGATION ---------- */
  const handleBackNavigation = () => {
    if (isExecutiveContext) navigate("/bank-executive/my-files");
    else if (isAdminContext) navigate("/admin/loan-files");
    else if (isDataOperatorContext) navigate("/data-operator/loan-files");
    else navigate(-1);
  };

  const handleUpdateStatusNavigation = () => {
    if (isExecutiveContext) {
      navigate(`/bank-executive/update-status?fileId=${id}`);
    } else if (isAdminContext) {
      navigate(`/admin/update-status?fileId=${id}`);
    }
  };

  /* ---------- HELPERS ---------- */
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const getStatusColor = (status) => {
    const colors = {
      "Active": { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
      "Pending": { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" },
      "Completed": { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
      "In-Process": { bg: "#e0e7ff", color: "#3730a3", border: "#a5b4fc" },
      "Query": { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
    };
    return colors[status] || { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" };
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          
          .loading-container {
            font-family: 'Inter', sans-serif;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 1.5rem;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .loading-text {
            font-size: 1.25rem;
            font-weight: 600;
          }
        `}</style>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading file details...</div>
        </div>
      </>
    );
  }

  if (!file || !assignment) return null;

  const statusColor = getStatusColor(assignment.assignment_status);

  /* ---------- UI ---------- */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .file-details-container {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 2.5rem;
        }
        
        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .page-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }
        
        .header-content {
          position: relative;
          z-index: 1;
        }
        
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          margin-bottom: 1.5rem;
        }
        
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateX(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        .file-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .file-title {
          font-size: 2.75rem;
          font-weight: 900;
          color: white;
          margin: 0;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .status-badge-large {
          padding: 0.875rem 1.75rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          border: 3px solid;
        }
        
        .quick-actions {
          display: flex;
          gap: 1rem;
        }
        
        .action-btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .btn-primary {
          background: white;
          color: #667eea;
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
        }
        
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(255, 255, 255, 0.4);
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2.5rem;
        }
        
        .info-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .info-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }
        
        .info-card:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 3px solid #f1f5f9;
        }
        
        .card-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .card-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.75rem;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .info-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .info-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          word-break: break-word;
        }
        
        .info-value.large {
          font-size: 1.75rem;
          color: #667eea;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .summary-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 2.5rem;
          color: white;
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .summary-card::before {
          content: '';
          position: absolute;
          top: -30%;
          right: -20%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          border-radius: 50%;
        }
        
        .summary-content {
          position: relative;
          z-index: 1;
        }
        
        .summary-title {
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 2rem;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .summary-item {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .summary-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .summary-label {
          font-size: 0.8rem;
          opacity: 0.85;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .summary-value {
          font-size: 1.25rem;
          font-weight: 800;
        }
        
        @media (max-width: 1200px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .file-details-container {
            padding: 1.5rem;
          }
          
          .page-header {
            padding: 2rem;
          }
          
          .file-title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }
          
          .file-title {
            font-size: 2rem;
          }
          
          .quick-actions {
            width: 100%;
            flex-direction: column;
          }
          
          .action-btn {
            width: 100%;
            justify-content: center;
          }
          
          .info-card {
            padding: 1.75rem;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="file-details-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <button className="back-btn" onClick={handleBackNavigation}>
              <span>←</span>
              <span>Back to Files</span>
            </button>
            
            <div className="file-title-row">
              <h1 className="file-title">File #{file.id}</h1>
              <div
                className="status-badge-large"
                style={{
                  background: statusColor.bg,
                  color: statusColor.color,
                  borderColor: statusColor.border
                }}
              >
                {assignment.assignment_status}
              </div>
            </div>
            
            {(isExecutiveContext || isAdminContext) && (
              <div className="quick-actions">
                <button className="action-btn btn-primary" onClick={handleUpdateStatusNavigation}>
                  <span>🔄</span>
                  <span>Update Status</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Left Column */}
          <div className="info-section">
            {/* Customer Information */}
            <div className="info-card">
              <div className="card-header">
                <div className="card-icon">👤</div>
                <h2 className="card-title">Customer Information</h2>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Customer Name</div>
                  <div className="info-value">
                    {customer?.name || file.customerName || file.customer_name || "N/A"}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Email</div>
                  <div className="info-value">{customer?.email || "N/A"}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Phone</div>
                  <div className="info-value">
                    {customer?.phone || customer?.mobile || customer?.contact || "N/A"}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">WhatsApp</div>
                  <div className="info-value">{customer?.whatsapp || "N/A"}</div>
                </div>
              </div>
            </div>

            {/* Loan Information */}
            <div className="info-card">
              <div className="card-header">
                <div className="card-icon">💰</div>
                <h2 className="card-title">Loan Information</h2>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Loan Type</div>
                  <div className="info-value">{file.loanType || file.loan_type}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Loan Amount</div>
                  <div className="info-value large">
                    {formatCurrency(file.amount || file.loanAmount)}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Bank</div>
                  <div className="info-value">{file.bankName || file.bank_name}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Created Date</div>
                  <div className="info-value">
                    {file.createdDate || file.date_of_registration || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Information */}
            {assignment && (
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon">👨‍💼</div>
                  <h2 className="card-title">Assignment Details</h2>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Executive Name</div>
                    <div className="info-value">{assignment.executive_name}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Executive Email</div>
                    <div className="info-value">{assignment.executive_email}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Assigned Date</div>
                    <div className="info-value">{assignment.assigned_date}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Last Updated</div>
                    <div className="info-value">
                      {assignment.last_updated || "Not updated"}
                    </div>
                  </div>
                  {assignment.remarks && (
                    <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                      <div className="info-label">Remarks</div>
                      <div className="info-value">{assignment.remarks}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="sidebar">
            <div className="summary-card">
              <div className="summary-content">
                <h3 className="summary-title">Quick Summary</h3>
                
                <div className="summary-item">
                  <div className="summary-label">Loan Amount</div>
                  <div className="summary-value">
                    {formatCurrency(file.amount || file.loanAmount)}
                  </div>
                </div>
                
                <div className="summary-item">
                  <div className="summary-label">Status</div>
                  <div className="summary-value">{assignment.assignment_status}</div>
                </div>
                
                <div className="summary-item">
                  <div className="summary-label">Bank</div>
                  <div className="summary-value">{file.bankName || file.bank_name}</div>
                </div>
                
                <div className="summary-item">
                  <div className="summary-label">Loan Type</div>
                  <div className="summary-value">{file.loanType || file.loan_type}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileDetails;
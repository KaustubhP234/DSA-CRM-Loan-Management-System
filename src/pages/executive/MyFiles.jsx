import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const MyFiles = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [myFiles, setMyFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bankFilter, setBankFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState("grid");
  const [debugInfo, setDebugInfo] = useState(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
    console.log("=== MY FILES DEBUG ===");
    console.log("Logged in user:", loggedInUser);
    
    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    // Get all assignments
    const allAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    console.log("All assignments:", allAssignments);
    
    // Get my assignments with improved matching
    const myAssignments = allAssignments.filter(a => {
      const emailMatch = a.executive_email && loggedInUser.email && 
                        a.executive_email.toLowerCase() === loggedInUser.email.toLowerCase();
      const nameMatch = a.executive_name && loggedInUser.name && 
                       a.executive_name.toLowerCase() === loggedInUser.name.toLowerCase();
      return emailMatch || nameMatch;
    });
    
    console.log("My assignments:", myAssignments);
    console.log("Number of my assignments:", myAssignments.length);

    // Get all loan files
    const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
    console.log("All loan files:", files);
    console.log("Number of all files:", files.length);

    // Match files with improved logic
    const assignedFiles = files.filter(file => {
      const fileId = String(file.id || file.file_id || "").trim();
      const hasMatch = myAssignments.some(a => {
        const assignmentFileId = String(a.file_id || "").trim();
        const match = fileId === assignmentFileId;
        if (match) {
          console.log(`✅ Match found: File ${fileId} = Assignment ${assignmentFileId}`);
        }
        return match;
      });
      return hasMatch;
    });

    console.log("Assigned files for executive:", assignedFiles);
    console.log("Number of assigned files:", assignedFiles.length);

    // Set debug info
    setDebugInfo({
      userEmail: loggedInUser.email,
      userName: loggedInUser.name,
      totalAssignments: allAssignments.length,
      myAssignmentsCount: myAssignments.length,
      totalFiles: files.length,
      assignedFilesCount: assignedFiles.length,
      myAssignmentIds: myAssignments.map(a => a.file_id),
      fileIds: files.map(f => f.id)
    });

    setMyFiles(assignedFiles);
    setFilteredFiles(assignedFiles);
  }, [navigate]);

  /* ---------------- APPLY FILTERS ---------------- */
  useEffect(() => {
    let result = [...myFiles];

    if (searchTerm) {
      result = result.filter(file =>
        String(file.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.customerName || file.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.bankName || file.bank_name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(file =>
        (file.fileStatus || file.status) === statusFilter
      );
    }

    if (bankFilter !== "All") {
      result = result.filter(file =>
        (file.bankName || file.bank_name) === bankFilter
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdDate || b.date_of_registration) - new Date(a.createdDate || a.date_of_registration);
        case "date-asc":
          return new Date(a.createdDate || a.date_of_registration) - new Date(b.createdDate || b.date_of_registration);
        case "amount-desc":
          return (b.amount || b.loanAmount || 0) - (a.amount || a.loanAmount || 0);
        case "amount-asc":
          return (a.amount || a.loanAmount || 0) - (b.amount || b.loanAmount || 0);
        case "customer-asc":
          return (a.customerName || a.customer_name || "").localeCompare(b.customerName || b.customer_name || "");
        default:
          return 0;
      }
    });

    setFilteredFiles(result);
  }, [myFiles, searchTerm, statusFilter, bankFilter, sortBy]);

  const uniqueBanks = [...new Set(myFiles.map(f => f.bankName || f.bank_name))];
  const statusOptions = ["All", "In-Process", "Login", "Query", "Active", "Sanctioned", "Rejected", "Disbursement", "Completed"];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      "In-Process": { bg: "#dbeafe", color: "#1e40af" },
      "Login": { bg: "#ede9fe", color: "#5b21b6" },
      "Query": { bg: "#fef3c7", color: "#92400e" },
      "Active": { bg: "#d1fae5", color: "#065f46" },
      "Sanctioned": { bg: "#dbeafe", color: "#1e40af" },
      "Rejected": { bg: "#fee2e2", color: "#991b1b" },
      "Disbursement": { bg: "#d1f4ff", color: "#0369a1" },
      "Completed": { bg: "#d1fae5", color: "#065f46" },
    };
    return colors[status] || { bg: "#f1f5f9", color: "#475569" };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .my-files-enhanced-container {
          font-family: 'Inter', sans-serif;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        .debug-panel {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .debug-title {
          font-weight: 800;
          color: #92400e;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .debug-item {
          font-size: 0.875rem;
          color: #78350f;
          margin: 0.5rem 0;
          font-family: monospace;
        }

        .debug-item strong {
          color: #92400e;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }

        .header-left h1 {
          font-size: 2rem;
          font-weight: 900;
          margin: 0 0 0.5rem 0;
        }

        .header-left p {
          font-size: 1rem;
          margin: 0;
          opacity: 0.9;
        }

        .view-toggle {
          display: flex;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.375rem;
          border-radius: 10px;
        }

        .view-btn {
          padding: 0.625rem 1rem;
          background: transparent;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .view-btn.active {
          background: white;
          color: #667eea;
        }

        .view-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.1);
        }

        .filters-bar {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1rem;
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .search-input,
        .filter-select {
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s;
          background: #f8fafc;
        }

        .search-input {
          background: #f8fafc url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E") no-repeat;
          background-position: right 1rem center;
          padding-right: 3rem;
        }

        .search-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          background-color: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .results-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 0 0.5rem;
        }

        .results-count {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 600;
        }

        .results-count strong {
          color: #0f172a;
          font-size: 1.1rem;
        }

        .clear-filters-btn {
          padding: 0.625rem 1.25rem;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .clear-filters-btn:hover {
          background: #e2e8f0;
          color: #334155;
        }

        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .file-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 2px solid #e2e8f0;
          transition: all 0.3s;
          cursor: pointer;
        }

        .file-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
        }

        .file-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .file-id {
          font-size: 1.25rem;
          font-weight: 800;
          color: #667eea;
          font-family: monospace;
        }

        .status-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .file-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .info-label {
          color: #64748b;
          font-weight: 600;
        }

        .info-value {
          color: #0f172a;
          font-weight: 700;
          text-align: right;
        }

        .amount-value {
          color: #667eea;
          font-size: 1.1rem;
          font-family: monospace;
        }

        .files-list {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .list-table {
          width: 100%;
          border-collapse: collapse;
        }

        .list-table thead {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .list-table th {
          padding: 1.25rem 1.5rem;
          text-align: left;
          font-size: 0.8rem;
          font-weight: 800;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .list-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-size: 0.95rem;
        }

        .list-table tbody tr {
          transition: all 0.2s;
          cursor: pointer;
        }

        .list-table tbody tr:hover {
          background: linear-gradient(to right, #f8fafc, #ffffff);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        .list-file-id {
          font-weight: 800;
          color: #667eea;
          font-family: monospace;
          font-size: 1rem;
        }

        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
          opacity: 0.4;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          font-size: 1rem;
        }

        @media (max-width: 1200px) {
          .filters-grid {
            grid-template-columns: 1fr 1fr;
          }
          .files-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .my-files-enhanced-container {
            padding: 1rem;
          }
          .header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          .filters-grid {
            grid-template-columns: 1fr;
          }
          .files-grid {
            grid-template-columns: 1fr;
          }
          .list-table {
            font-size: 0.85rem;
          }
          .list-table th,
          .list-table td {
            padding: 0.875rem;
          }
          .results-info {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="my-files-enhanced-container">
        {/* Debug Panel */}
        {debugInfo && debugInfo.assignedFilesCount === 0 && (
          <div className="debug-panel">
            <div className="debug-title">🔍 Debug Information</div>
            <div className="debug-item">
              <strong>User:</strong> {debugInfo.userName} ({debugInfo.userEmail})
            </div>
            <div className="debug-item">
              <strong>Total Assignments in System:</strong> {debugInfo.totalAssignments}
            </div>
            <div className="debug-item">
              <strong>My Assignments:</strong> {debugInfo.myAssignmentsCount}
            </div>
            <div className="debug-item">
              <strong>My Assignment File IDs:</strong> {debugInfo.myAssignmentIds.join(", ") || "None"}
            </div>
            <div className="debug-item">
              <strong>Total Files in System:</strong> {debugInfo.totalFiles}
            </div>
            <div className="debug-item">
              <strong>All File IDs:</strong> {debugInfo.fileIds.join(", ") || "None"}
            </div>
            <div className="debug-item">
              <strong>Matched Files:</strong> {debugInfo.assignedFilesCount}
            </div>
            <div className="debug-item" style={{ marginTop: '1rem', color: '#dc2626', fontWeight: 'bold' }}>
              ⚠️ Open browser console (F12) for detailed matching logs
            </div>
          </div>
        )}

        <div className="page-header">
          <div className="header-content">
            <div className="header-left">
              <h1>📋 My Files</h1>
              <p>Manage and track your assigned loan files</p>
            </div>
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                ⊞ Grid
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                ☰ List
              </button>
            </div>
          </div>
        </div>

        <div className="filters-bar">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search by File ID, Customer, Bank..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Bank</label>
              <select
                className="filter-select"
                value={bankFilter}
                onChange={(e) => setBankFilter(e.target.value)}
              >
                <option value="All">All Banks</option>
                {uniqueBanks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
                <option value="customer-asc">Customer Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="results-info">
          <div className="results-count">
            Showing <strong>{filteredFiles.length}</strong> of <strong>{myFiles.length}</strong> files
          </div>
          {(searchTerm || statusFilter !== "All" || bankFilter !== "All") && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setBankFilter("All");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No files found</h3>
            <p>
              {myFiles.length === 0 
                ? "You don't have any assigned files yet. Check the debug panel above for details."
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="files-grid">
            {filteredFiles.map((file) => {
              const statusColor = getStatusColor(file.fileStatus || file.status);
              return (
                <div
                  key={file.id}
                  className="file-card"
                  onClick={() => navigate(`/bank-executive/file/${file.id}`)}
                >
                  <div className="file-header">
                    <div className="file-id">{file.id}</div>
                    <div
                      className="status-badge"
                      style={{
                        background: statusColor.bg,
                        color: statusColor.color
                      }}
                    >
                      {file.fileStatus || file.status || "New"}
                    </div>
                  </div>

                  <div className="file-info">
                    <div className="info-row">
                      <span className="info-label">Customer</span>
                      <span className="info-value">
                        {file.customerName || file.customer_name}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Loan Type</span>
                      <span className="info-value">
                        {file.loanType || file.loan_type}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Amount</span>
                      <span className="info-value amount-value">
                        {formatCurrency(file.amount || file.loanAmount || 0)}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Bank</span>
                      <span className="info-value">
                        {file.bankName || file.bank_name}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Date</span>
                      <span className="info-value">
                        {file.createdDate || file.date_of_registration || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="files-list">
            <table className="list-table">
              <thead>
                <tr>
                  <th>File ID</th>
                  <th>Customer</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Bank</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => {
                  const statusColor = getStatusColor(file.fileStatus || file.status);
                  return (
                    <tr
                      key={file.id}
                      onClick={() => navigate(`/bank-executive/file/${file.id}`)}
                    >
                      <td>
                        <span className="list-file-id">{file.id}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {file.customerName || file.customer_name}
                      </td>
                      <td>{file.loanType || file.loan_type}</td>
                      <td style={{ fontWeight: 700, color: '#667eea', fontFamily: 'monospace' }}>
                        {formatCurrency(file.amount || file.loanAmount || 0)}
                      </td>
                      <td>{file.bankName || file.bank_name}</td>
                      <td>
                        <div
                          className="status-badge"
                          style={{
                            background: statusColor.bg,
                            color: statusColor.color,
                            display: 'inline-block'
                          }}
                        >
                          {file.fileStatus || file.status || "New"}
                        </div>
                      </td>
                      <td>{file.createdDate || file.date_of_registration || "N/A"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MyFiles;
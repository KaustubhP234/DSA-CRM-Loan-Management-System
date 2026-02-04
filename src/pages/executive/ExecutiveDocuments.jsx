import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ExecutiveDocuments = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [allDocuments, setAllDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [myFiles, setMyFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileFilter, setFileFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    // Get my assigned files
    const allAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    const myAssignments = allAssignments.filter(a => 
      a.executive_email === loggedInUser.email || 
      a.executive_name === loggedInUser.name
    );

    const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const assignedFiles = files.filter(file =>
      myAssignments.some(a => String(a.file_id) === String(file.id))
    );
    setMyFiles(assignedFiles);

    // Get all documents for my files
    const docs = JSON.parse(localStorage.getItem("documents")) || [];
    const myDocs = docs.filter(doc =>
      assignedFiles.some(file => String(file.id) === String(doc.file_id))
    );
    setAllDocuments(myDocs);
    setFilteredDocuments(myDocs);
  }, [navigate]);

  /* ---------------- APPLY FILTERS ---------------- */
  useEffect(() => {
    let result = [...allDocuments];

    // Search filter
    if (searchTerm) {
      result = result.filter(doc =>
        (doc.name || doc.document_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(doc.file_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.type || doc.document_type || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // File filter
    if (fileFilter !== "All") {
      result = result.filter(doc => String(doc.file_id) === String(fileFilter));
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter(doc => (doc.verification_status || "Pending") === statusFilter);
    }

    // Type filter
    if (typeFilter !== "All") {
      result = result.filter(doc => (doc.type || doc.document_type) === typeFilter);
    }

    setFilteredDocuments(result);
  }, [allDocuments, searchTerm, fileFilter, statusFilter, typeFilter]);

  /* ---------------- GET UNIQUE TYPES ---------------- */
  const uniqueTypes = [...new Set(allDocuments.map(d => d.type || d.document_type))];

  /* ---------------- GET FILE INFO ---------------- */
  const getFileInfo = (fileId) => {
    return myFiles.find(f => String(f.id) === String(fileId));
  };

  /* ---------------- STATISTICS ---------------- */
  const stats = {
    total: allDocuments.length,
    pending: allDocuments.filter(d => !d.verification_status || d.verification_status === "Pending").length,
    approved: allDocuments.filter(d => d.verification_status === "Approved").length,
    rejected: allDocuments.filter(d => d.verification_status === "Rejected").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .documents-enhanced-container {
          font-family: 'Inter', sans-serif;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        /* Header */
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
          margin-bottom: 1.5rem;
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

        .verify-btn {
          padding: 0.875rem 1.75rem;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .verify-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.2);
          padding: 1.25rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .stat-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: white;
          font-family: monospace;
        }

        /* Filters Bar */
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

        /* Results Info */
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

        /* Documents Grid */
        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .document-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 2px solid #e2e8f0;
          transition: all 0.3s;
        }

        .document-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
        }

        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .doc-icon-name {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .doc-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .doc-name {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.25rem 0;
        }

        .doc-type {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
        }

        .status-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .badge-approved {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .badge-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .doc-info-grid {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .doc-info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .doc-info-label {
          color: #64748b;
          font-weight: 600;
        }

        .doc-info-value {
          color: #0f172a;
          font-weight: 700;
          text-align: right;
        }

        .file-link {
          color: #667eea;
          font-family: monospace;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }

        .file-link:hover {
          text-decoration: underline;
          color: #764ba2;
        }

        .doc-remarks {
          background: #f8fafc;
          padding: 0.875rem;
          border-radius: 8px;
          margin-top: 1rem;
          border-left: 3px solid #667eea;
        }

        .remarks-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .remarks-text {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.5;
        }

        .doc-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.875rem;
        }

        .btn-view {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-view:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        /* Empty State */
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

        /* Responsive */
        @media (max-width: 1200px) {
          .filters-grid {
            grid-template-columns: 1fr 1fr;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .documents-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .documents-enhanced-container {
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

          .stats-row {
            grid-template-columns: 1fr;
          }

          .documents-grid {
            grid-template-columns: 1fr;
          }

          .results-info {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="documents-enhanced-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-left">
              <h1>📄 Documents</h1>
              <p>View and manage documents from your assigned files</p>
            </div>
            <button
              className="verify-btn"
              onClick={() => navigate("/bank-executive/verify-documents")}
            >
              <span>✅</span>
              <span>Verify Documents</span>
            </button>
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Total Documents</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending</div>
              <div className="stat-value">{stats.pending}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Approved</div>
              <div className="stat-value">{stats.approved}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Rejected</div>
              <div className="stat-value">{stats.rejected}</div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search by document name, file ID, type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">File</label>
              <select
                className="filter-select"
                value={fileFilter}
                onChange={(e) => setFileFilter(e.target.value)}
              >
                <option value="All">All Files</option>
                {myFiles.map(file => (
                  <option key={file.id} value={file.id}>
                    {file.id} - {file.customerName || file.customer_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Type</label>
              <select
                className="filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <div className="results-count">
            Showing <strong>{filteredDocuments.length}</strong> of <strong>{allDocuments.length}</strong> documents
          </div>
          {(searchTerm || fileFilter !== "All" || statusFilter !== "All" || typeFilter !== "All") && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm("");
                setFileFilter("All");
                setStatusFilter("All");
                setTypeFilter("All");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No documents found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="documents-grid">
            {filteredDocuments.map((doc) => {
              const fileInfo = getFileInfo(doc.file_id);
              const verificationStatus = doc.verification_status || "Pending";
              
              return (
                <div key={doc.id} className="document-card">
                  <div className="doc-header">
                    <div className="doc-icon-name">
                      <div className="doc-icon">📄</div>
                      <div>
                        <h3 className="doc-name">{doc.name || doc.document_name}</h3>
                        <div className="doc-type">{doc.type || doc.document_type}</div>
                      </div>
                    </div>
                    <div
                      className={`status-badge badge-${verificationStatus.toLowerCase()}`}
                    >
                      {verificationStatus}
                    </div>
                  </div>

                  <div className="doc-info-grid">
                    <div className="doc-info-row">
                      <span className="doc-info-label">File ID</span>
                      <span
                        className="doc-info-value file-link"
                        onClick={() => navigate(`/bank-executive/file/${doc.file_id}`)}
                      >
                        {doc.file_id}
                      </span>
                    </div>
                    {fileInfo && (
                      <div className="doc-info-row">
                        <span className="doc-info-label">Customer</span>
                        <span className="doc-info-value">
                          {fileInfo.customerName || fileInfo.customer_name}
                        </span>
                      </div>
                    )}
                    <div className="doc-info-row">
                      <span className="doc-info-label">Submitted</span>
                      <span className="doc-info-value">
                        {doc.date || doc.submission_date || "N/A"}
                      </span>
                    </div>
                    {doc.verified_by && (
                      <>
                        <div className="doc-info-row">
                          <span className="doc-info-label">Verified By</span>
                          <span className="doc-info-value">{doc.verified_by}</span>
                        </div>
                        <div className="doc-info-row">
                          <span className="doc-info-label">Verified On</span>
                          <span className="doc-info-value">{doc.verification_date}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {doc.verification_remarks && (
                    <div className="doc-remarks">
                      <div className="remarks-label">Remarks</div>
                      <div className="remarks-text">{doc.verification_remarks}</div>
                    </div>
                  )}

                  <div className="doc-actions">
                    <button
                      className="action-btn btn-view"
                      onClick={() => navigate(`/bank-executive/file/${doc.file_id}`)}
                    >
                      View File Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ExecutiveDocuments;
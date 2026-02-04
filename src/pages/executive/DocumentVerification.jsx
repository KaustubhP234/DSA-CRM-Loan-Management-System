import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const DocumentVerification = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [myFiles, setMyFiles] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

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

    // Load all documents
    const docs = JSON.parse(localStorage.getItem("documents")) || [];
    setAllDocuments(docs);
  }, [navigate]);

  /* ---------------- GET DOCUMENTS FOR FILE ---------------- */
  const getDocumentsForFile = (fileId) => {
    console.log("=== Getting documents for file:", fileId);
    console.log("Total documents available:", allDocuments.length);
    
    const docs = allDocuments.filter(doc => {
      // Try multiple field name variations
      const docFileId = doc.file_id || doc.fileId || doc.loan_file_id || doc.loanFileId;
      const match = String(docFileId) === String(fileId);
      
      if (match) {
        console.log("✅ Found matching document:", doc.name || doc.document_name);
      }
      
      return match;
    });
    
    console.log(`Found ${docs.length} documents for file ${fileId}`);
    
    if (docs.length === 0) {
      console.warn("⚠️ No documents found. Check:");
      console.warn("1. Documents have file_id field");
      console.warn("2. file_id matches the loan file ID");
      console.warn("All documents:", allDocuments);
    }
    
    return docs;
  };

  /* ---------------- HANDLE VERIFICATION ---------------- */
  const handleVerification = (docId, status, remarks) => {
    const docs = JSON.parse(localStorage.getItem("documents")) || [];
    const updatedDocs = docs.map(doc => {
      if (String(doc.id) === String(docId)) {
        return {
          ...doc,
          verification_status: status,
          verification_remarks: remarks,
          verified_by: JSON.parse(localStorage.getItem("loggedInUser")).name,
          verification_date: new Date().toISOString().split('T')[0],
        };
      }
      return doc;
    });

    localStorage.setItem("documents", JSON.stringify(updatedDocs));
    setAllDocuments(updatedDocs);
    alert(`Document ${status === "Approved" ? "approved" : "rejected"} successfully!`);
  };

  /* ---------------- FILTER FILES ---------------- */
  const filteredFiles = myFiles.filter(file => {
    const fileDocs = getDocumentsForFile(file.id);
    
    if (filterStatus === "All") return true;
    if (filterStatus === "Pending") {
      return fileDocs.some(doc => !doc.verification_status || doc.verification_status === "Pending");
    }
    if (filterStatus === "Verified") {
      return fileDocs.every(doc => doc.verification_status === "Approved");
    }
    if (filterStatus === "Rejected") {
      return fileDocs.some(doc => doc.verification_status === "Rejected");
    }
    return true;
  });

  /* ---------------- FORMAT CURRENCY ---------------- */
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .doc-verification-container {
          font-family: 'Inter', sans-serif;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        /* Header */
        .page-header {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .back-btn {
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .page-title {
          font-size: 2rem;
          font-weight: 900;
          color: white;
          margin: 0;
        }

        .page-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          margin: 0.5rem 0 0 0;
        }

        /* Filter Bar */
        .filter-bar {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        /* Files Grid */
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
          border-color: #6366f1;
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
          font-size: 0.875rem;
          font-weight: 700;
          color: #6366f1;
          font-family: monospace;
        }

        .verification-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .badge-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-verified {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .file-info {
          margin-bottom: 1rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.875rem;
        }

        .info-label {
          color: #64748b;
          font-weight: 600;
        }

        .info-value {
          color: #0f172a;
          font-weight: 700;
        }

        .docs-count {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .count-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .count-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }

        .view-docs-btn {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .view-docs-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          padding: 2rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 16px 16px 0 0;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 1.5rem;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .modal-body {
          padding: 2rem;
        }

        .doc-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .doc-item {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .doc-name {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .doc-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
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
          text-transform: uppercase;
          font-size: 0.875rem;
        }

        .btn-approve {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .btn-approve:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-reject {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .btn-reject:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .remarks-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          resize: vertical;
          min-height: 60px;
          margin-top: 0.5rem;
        }

        .remarks-input:focus {
          outline: none;
          border-color: #6366f1;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .files-grid {
            grid-template-columns: 1fr;
          }

          .doc-details {
            grid-template-columns: 1fr;
          }

          .doc-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="doc-verification-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-top">
            <button className="back-btn" onClick={() => navigate("/bank-executive")}>
              <span>←</span>
              <span>Back to Dashboard</span>
            </button>
          </div>
          <h1 className="page-title">📋 Document Verification</h1>
          <p className="page-subtitle">Review and verify documents for assigned loan files</p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <span className="filter-label">Filter:</span>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Files</option>
            <option value="Pending">Pending Verification</option>
            <option value="Verified">Fully Verified</option>
            <option value="Rejected">Has Rejected Docs</option>
          </select>
        </div>

        {/* Files Grid */}
        {filteredFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No files found</h3>
            <p>No files match the selected filter</p>
          </div>
        ) : (
          <div className="files-grid">
            {filteredFiles.map((file) => {
              const docs = getDocumentsForFile(file.id);
              const pendingDocs = docs.filter(d => !d.verification_status || d.verification_status === "Pending").length;
              const approvedDocs = docs.filter(d => d.verification_status === "Approved").length;
              const rejectedDocs = docs.filter(d => d.verification_status === "Rejected").length;

              const overallStatus = 
                docs.length === 0 ? "No Docs" :
                docs.every(d => d.verification_status === "Approved") ? "Verified" :
                docs.some(d => d.verification_status === "Rejected") ? "Rejected" :
                "Pending";

              return (
                <div key={file.id} className="file-card" onClick={() => setSelectedFile(file)}>
                  <div className="file-header">
                    <div className="file-id">{file.id}</div>
                    <div className={`verification-badge badge-${overallStatus.toLowerCase()}`}>
                      {overallStatus}
                    </div>
                  </div>

                  <div className="file-info">
                    <div className="info-row">
                      <span className="info-label">Customer:</span>
                      <span className="info-value">{file.customerName || file.customer_name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Loan Type:</span>
                      <span className="info-value">{file.loanType || file.loan_type}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Amount:</span>
                      <span className="info-value">{formatCurrency(file.amount || file.loanAmount || 0)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Bank:</span>
                      <span className="info-value">{file.bankName || file.bank_name}</span>
                    </div>
                  </div>

                  <div className="docs-count">
                    <div className="count-item">
                      <div className="count-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
                        {pendingDocs}
                      </div>
                      <span>Pending</span>
                    </div>
                    <div className="count-item">
                      <div className="count-icon" style={{ background: '#d1fae5', color: '#065f46' }}>
                        {approvedDocs}
                      </div>
                      <span>Approved</span>
                    </div>
                    <div className="count-item">
                      <div className="count-icon" style={{ background: '#fee2e2', color: '#991b1b' }}>
                        {rejectedDocs}
                      </div>
                      <span>Rejected</span>
                    </div>
                  </div>

                  <button className="view-docs-btn">
                    View Documents ({docs.length})
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for Document Verification */}
        {selectedFile && (
          <div className="modal-overlay" onClick={() => setSelectedFile(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div className="modal-title">Documents for {selectedFile.id}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.5rem' }}>
                    {selectedFile.customerName || selectedFile.customer_name}
                  </div>
                </div>
                <button className="close-btn" onClick={() => setSelectedFile(null)}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                {getDocumentsForFile(selectedFile.id).length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📄</div>
                    <h3>No documents uploaded</h3>
                    <p>No documents have been uploaded for this file yet</p>
                  </div>
                ) : (
                  <div className="doc-list">
                    {getDocumentsForFile(selectedFile.id).map((doc) => (
                      <div key={doc.id} className="doc-item">
                        <div className="doc-header">
                          <div className="doc-name">📎 {doc.name || doc.document_name}</div>
                          <div className={`verification-badge badge-${(doc.verification_status || "Pending").toLowerCase()}`}>
                            {doc.verification_status || "Pending"}
                          </div>
                        </div>

                        <div className="doc-details">
                          <div>
                            <strong>Type:</strong> {doc.type || doc.document_type}
                          </div>
                          <div>
                            <strong>Submitted:</strong> {doc.date || doc.submission_date}
                          </div>
                          {doc.verified_by && (
                            <>
                              <div>
                                <strong>Verified By:</strong> {doc.verified_by}
                              </div>
                              <div>
                                <strong>Verified On:</strong> {doc.verification_date}
                              </div>
                            </>
                          )}
                        </div>

                        {doc.verification_remarks && (
                          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff', borderRadius: '8px', fontSize: '0.875rem' }}>
                            <strong>Remarks:</strong> {doc.verification_remarks}
                          </div>
                        )}

                        {(!doc.verification_status || doc.verification_status === "Pending") && (
                          <>
                            <textarea
                              className="remarks-input"
                              placeholder="Add verification remarks..."
                              id={`remarks-${doc.id}`}
                            />
                            <div className="doc-actions">
                              <button
                                className="action-btn btn-approve"
                                onClick={() => {
                                  const remarks = document.getElementById(`remarks-${doc.id}`).value;
                                  handleVerification(doc.id, "Approved", remarks || "Document approved");
                                }}
                              >
                                ✓ Approve
                              </button>
                              <button
                                className="action-btn btn-reject"
                                onClick={() => {
                                  const remarks = document.getElementById(`remarks-${doc.id}`).value;
                                  if (!remarks) {
                                    alert("Please provide remarks for rejection");
                                    return;
                                  }
                                  handleVerification(doc.id, "Rejected", remarks);
                                }}
                              >
                                ✗ Reject
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentVerification;
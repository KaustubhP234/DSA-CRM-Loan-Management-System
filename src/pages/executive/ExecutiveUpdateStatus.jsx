import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ExecutiveUpdateStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileIdFromUrl = searchParams.get('fileId');
  
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const executiveEmail = loggedInUser.email || "";
  
  const [myFiles, setMyFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const allAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    const executiveName = loggedInUser.name || loggedInUser.email?.split("@")[0];
    
    const filteredFiles = allAssignments.filter(
      (assignment) => 
        assignment.executive_email === executiveEmail ||
        assignment.executive_name?.toLowerCase().includes(executiveName?.toLowerCase())
    );
    
    setMyFiles(filteredFiles);

    // Auto-select file if fileId is in URL
    if (fileIdFromUrl && filteredFiles.length > 0) {
      const preSelectedFile = filteredFiles.find(f => String(f.file_id) === String(fileIdFromUrl));
      if (preSelectedFile) {
        setSelectedFile(preSelectedFile);
        setNewStatus(preSelectedFile.assignment_status || "");
      }
    }
  }, [executiveEmail, loggedInUser.name, fileIdFromUrl]);

  const handleFileSelect = (e) => {
    const selectedId = e.target.value;
    const file = myFiles.find(f => f.id === selectedId);
    setSelectedFile(file || null);
    setNewStatus(file?.assignment_status || "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const allAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    const updatedAssignments = allAssignments.map((a) => {
      if (a.id === selectedFile.id) {
        return {
          ...a,
          assignment_status: newStatus,
          remarks: remarks || a.remarks,
          last_updated: new Date().toISOString().split('T')[0],
        };
      }
      return a;
    });

    localStorage.setItem("executiveAssignments", JSON.stringify(updatedAssignments));
    alert("✅ Status updated successfully!");
    
    // Reset form
    setSelectedFile(null);
    setNewStatus("");
    setRemarks("");
    
    // Reload files
    const executiveName = loggedInUser.name || loggedInUser.email?.split("@")[0];
    const filteredFiles = updatedAssignments.filter(
      (assignment) => 
        assignment.executive_email === executiveEmail ||
        assignment.executive_name?.toLowerCase().includes(executiveName?.toLowerCase())
    );
    setMyFiles(filteredFiles);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '2rem',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .update-page-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 2.5rem 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          color: white;
        }
        
        .update-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 1rem;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        
        .update-back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-3px);
        }
        
        .update-title {
          font-size: 2rem;
          font-weight: 900;
          margin: 0 0 0.5rem 0;
        }
        
        .update-subtitle {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-box {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #667eea;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 2rem;
        }
        
        .form-box {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }
        
        .form-box-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .input-group {
          margin-bottom: 2rem;
        }
        
        .input-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .required-mark {
          color: #ef4444;
        }
        
        .input-select,
        .input-textarea {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s;
          background: white;
          color: #0f172a;
          font-family: inherit;
        }
        
        .input-select:focus,
        .input-textarea:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .input-select:disabled,
        .input-textarea:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .input-textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .preview-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          border-radius: 16px;
          color: white;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          height: fit-content;
          position: sticky;
          top: 2rem;
        }
        
        .preview-title {
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .preview-row {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
        }
        
        .preview-label {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-bottom: 0.35rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .preview-value {
          font-size: 1.05rem;
          font-weight: 700;
        }
        
        .preview-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
          margin: 1.25rem 0;
        }
        
        .empty-preview {
          text-align: center;
          padding: 3rem 2rem;
          opacity: 0.7;
        }
        
        .empty-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-text {
          font-size: 0.95rem;
          opacity: 0.8;
        }
        
        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 2px solid #f1f5f9;
        }
        
        .action-btn {
          padding: 1.1rem 2rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: inherit;
        }
        
        .btn-submit {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          flex: 1;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
        }

        .btn-submit:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .btn-cancel {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
          padding: 1rem 1.5rem;
        }
        
        .btn-cancel:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .preselected-notice {
          background: #dbeafe;
          border: 2px solid #3b82f6;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #1e40af;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        @media (max-width: 1200px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .preview-box {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .update-page-header {
            padding: 1.5rem;
          }

          .update-title {
            font-size: 1.5rem;
          }

          .form-box {
            padding: 1.5rem;
          }

          .button-group {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="update-page-header">
        <button className="update-back-btn" onClick={() => navigate("/bank-executive/my-files")}>
          <span>←</span>
          <span>Back to My Files</span>
        </button>
        <h1 className="update-title">🔄 Update Status</h1>
        <p className="update-subtitle">Update the status of your assigned files</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">Total Files</div>
          <div className="stat-value">{myFiles.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Active Files</div>
          <div className="stat-value">
            {myFiles.filter(f => f.assignment_status === "Active").length}
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Completed</div>
          <div className="stat-value">
            {myFiles.filter(f => f.assignment_status === "Completed").length}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-box">
            <h2 className="form-box-title">
              <span>📝</span>
              <span>Status Update Form</span>
            </h2>

            {fileIdFromUrl && selectedFile && (
              <div className="preselected-notice">
                <span>ℹ️</span>
                <span>File pre-selected from My Files</span>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">
                Select File <span className="required-mark">*</span>
              </label>
              <select
                className="input-select"
                value={selectedFile?.id || ""}
                onChange={handleFileSelect}
                required
              >
                <option value="">-- Choose a file to update --</option>
                {myFiles.map((file) => (
                  <option key={file.id} value={file.id}>
                    File #{file.file_id} - {file.customer_name} ({file.assignment_status})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">
                New Status <span className="required-mark">*</span>
              </label>
              <select
                className="input-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                required
                disabled={!selectedFile}
              >
                <option value="">-- Select new status --</option>
                <option value="Active">✅ Active</option>
                <option value="Pending">⏳ Pending</option>
                <option value="Completed">🎉 Completed</option>
                <option value="In-Process">🔄 In-Process</option>
                <option value="Query">❓ Query</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Remarks (Optional)</label>
              <textarea
                className="input-textarea"
                placeholder="Add any notes, comments, or updates about this file..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={!selectedFile}
              />
            </div>

            <div className="button-group">
              <button type="submit" className="action-btn btn-submit" disabled={!selectedFile}>
                <span>✅</span>
                <span>Update Status</span>
              </button>
              <button
                type="button"
                className="action-btn btn-cancel"
                onClick={() => navigate("/bank-executive/my-files")}
              >
                <span>✖</span>
                <span>Cancel</span>
              </button>
            </div>
          </div>

          <div className="preview-box">
            <h3 className="preview-title">📄 File Preview</h3>

            {selectedFile ? (
              <>
                <div className="preview-row">
                  <div className="preview-label">File ID</div>
                  <div className="preview-value">#{selectedFile.file_id}</div>
                </div>

                <div className="preview-divider"></div>

                <div className="preview-row">
                  <div className="preview-label">Customer Name</div>
                  <div className="preview-value">{selectedFile.customer_name}</div>
                </div>

                <div className="preview-row">
                  <div className="preview-label">Bank</div>
                  <div className="preview-value">{selectedFile.bank_name}</div>
                </div>

                <div className="preview-divider"></div>

                <div className="preview-row">
                  <div className="preview-label">Loan Type</div>
                  <div className="preview-value">{selectedFile.loan_type}</div>
                </div>

                <div className="preview-row">
                  <div className="preview-label">Loan Amount</div>
                  <div className="preview-value">{formatCurrency(selectedFile.loan_amount)}</div>
                </div>

                <div className="preview-divider"></div>

                <div className="preview-row">
                  <div className="preview-label">Current Status</div>
                  <div className="preview-value">
                    {selectedFile.assignment_status}
                  </div>
                </div>

                {selectedFile.assigned_date && (
                  <div className="preview-row">
                    <div className="preview-label">Assigned Date</div>
                    <div className="preview-value">{selectedFile.assigned_date}</div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-preview">
                <div className="empty-icon">📁</div>
                <p className="empty-text">Select a file to see details</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExecutiveUpdateStatus;
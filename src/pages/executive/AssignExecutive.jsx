import { useState, useEffect } from "react";

const AssignExecutive = () => {
  const [formData, setFormData] = useState({
    file_id: "",
    executive_id: "",
    remarks: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [loanFiles, setLoanFiles] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
    setLoanFiles(files);

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const bankExecutives = allUsers.filter(user => {
      const role = (user.login_role || user.role || "").toString().toLowerCase();
      return role === "bank executive" || role === "bank_executive" || 
             (role.includes("bank") && role.includes("executive"));
    });
    
    setExecutives(bankExecutives);
  }, []);

  const handleFileSelect = (e) => {
    const fileId = e.target.value;
    setFormData({ ...formData, file_id: fileId });
    if (errors.file_id) setErrors({ ...errors, file_id: "" });

    const file = loanFiles.find(f => String(f.id) === String(fileId));
    setSelectedFile(file || null);
  };

  const handleExecutiveSelect = (e) => {
    const executiveId = e.target.value;
    setFormData({ ...formData, executive_id: executiveId });
    if (errors.executive_id) setErrors({ ...errors, executive_id: "" });

    const executive = executives.find(ex => String(ex.id) === String(executiveId));
    setSelectedExecutive(executive || null);
  };

  const generateAssignmentId = () => {
    const existingAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    const lastId = existingAssignments.length > 0 
      ? parseInt(existingAssignments[existingAssignments.length - 1].assignment_id.replace("ASN", ""))
      : 0;
    return `ASN${String(lastId + 1).padStart(3, "0")}`;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.file_id) newErrors.file_id = "Please select a loan file";
    if (!formData.executive_id) newErrors.executive_id = "Please select a bank executive";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setLoading(true);

    const newAssignment = {
      id: Date.now().toString(),
      assignment_id: generateAssignmentId(),
      file_id: selectedFile.id,
      customer_name: selectedFile.customerName || selectedFile.customer_name,
      bank_name: selectedFile.bankName || selectedFile.bank_name,
      loan_type: selectedFile.loanType || selectedFile.loan_type,
      loan_amount: selectedFile.amount || selectedFile.loanAmount || 0,
      executive_name: selectedExecutive.name,
      executive_email: selectedExecutive.email,
      executive_phone: selectedExecutive.contact_number || selectedExecutive.phone || selectedExecutive.mobile || "N/A",
      assigned_date: new Date().toISOString().split('T')[0],
      assignment_status: "Active",
      remarks: formData.remarks || "File assigned for processing",
    };

    const existingAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    existingAssignments.push(newAssignment);
    localStorage.setItem("executiveAssignments", JSON.stringify(existingAssignments));

    alert("✅ Executive assigned successfully!");
    setTimeout(() => {
      window.location.href = "/admin/executive-assignment";
    }, 500);
  };

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .assign-container {
          padding: 32px;
          background: #f8fafc;
          min-height: 100vh;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .header-content h1 {
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .header-content p {
          font-size: 15px;
          color: #64748b;
        }

        .back-btn {
          padding: 10px 20px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .info-alert {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          border: 2px solid #3b82f6;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 32px;
          display: flex;
          gap: 12px;
          align-items: start;
        }

        .alert-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .alert-content {
          flex: 1;
        }

        .alert-title {
          font-size: 14px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 6px;
        }

        .alert-text {
          font-size: 13px;
          color: #1e3a8a;
          line-height: 1.6;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
          display: block;
        }

        .required {
          color: #ef4444;
        }

        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
        }

        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #10b981;
          background: white;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .form-select.error {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .error-message {
          font-size: 12px;
          color: #ef4444;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .preview-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          margin-bottom: 24px;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
        }

        .preview-grid {
          display: grid;
          gap: 16px;
        }

        .preview-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preview-label {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .preview-value {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }

        .preview-value.highlight {
          font-size: 16px;
          color: #10b981;
          font-family: 'JetBrains Mono', monospace;
        }

        .empty-preview {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 12px;
          opacity: 0.3;
        }

        .empty-text {
          font-size: 14px;
          color: #64748b;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 2px solid #e2e8f0;
        }

        .btn-cancel {
          flex: 1;
          padding: 14px;
          background: white;
          color: #475569;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 15px;
        }

        .btn-cancel:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .btn-submit {
          flex: 1;
          padding: 14px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 15px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .assign-container {
            padding: 16px;
          }

          .form-card {
            padding: 20px;
          }

          .page-header {
            flex-direction: column;
            gap: 16px;
          }

          .form-actions {
            flex-direction: column-reverse;
          }
        }
      `}</style>

      <div className="assign-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Assign Executive</h1>
            <p>Assign loan file to a bank executive for processing</p>
          </div>
          <button className="back-btn" onClick={() => (window.location.href = "/admin/executive-assignment")}>
            <span>←</span>
            Back
          </button>
        </div>

        {/* Info Alert */}
        <div className="info-alert">
          <span className="alert-icon">💡</span>
          <div className="alert-content">
            <div className="alert-title">Assignment Guidelines</div>
            <div className="alert-text">
              • Select a loan file and assign it to a bank executive<br/>
              • Executive will receive notification about the assignment<br/>
              • Track assignment progress in the Executive Assignment dashboard
            </div>
          </div>
        </div>

        {executives.length === 0 && (
          <div className="info-alert" style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)", borderColor: "#f59e0b" }}>
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">
              <div className="alert-title" style={{ color: "#92400e" }}>No Bank Executives Available</div>
              <div className="alert-text" style={{ color: "#78350f" }}>
                Please create users with role "Bank Executive" first before assigning files.
              </div>
            </div>
          </div>
        )}

        <div className="content-grid">
          {/* Left Column - Form */}
          <div className="form-card">
            <h2 className="section-title">Assignment Details</h2>

            <div className="form-group">
              <label className="form-label">
                Select Loan File <span className="required">*</span>
              </label>
              <select
                className={`form-select ${errors.file_id ? 'error' : ''}`}
                value={formData.file_id}
                onChange={handleFileSelect}
              >
                <option value="">-- Choose a loan file --</option>
                {loanFiles.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.id} - {file.customerName || file.customer_name} ({file.loanType || file.loan_type})
                  </option>
                ))}
              </select>
              {errors.file_id && (
                <div className="error-message">⚠️ {errors.file_id}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Select Bank Executive <span className="required">*</span>
              </label>
              <select
                className={`form-select ${errors.executive_id ? 'error' : ''}`}
                value={formData.executive_id}
                onChange={handleExecutiveSelect}
              >
                <option value="">-- Choose an executive --</option>
                {executives.map((executive) => (
                  <option key={executive.id} value={executive.id}>
                    {executive.name} - {executive.email}
                  </option>
                ))}
              </select>
              {errors.executive_id && (
                <div className="error-message">⚠️ {errors.executive_id}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Remarks (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Add any special instructions or notes..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button className="btn-cancel" onClick={() => {
                if (window.confirm("Discard changes?")) {
                  window.location.href = "/admin/executive-assignment";
                }
              }}>
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={loading || executives.length === 0}
              >
                {loading ? "Assigning..." : "✅ Assign Executive"}
              </button>
            </div>
          </div>

          {/* Right Column - Previews */}
          <div>
            {/* File Preview */}
            <div className="preview-card">
              <div className="preview-header">
                <span>📄</span>
                <span>File Preview</span>
              </div>

              {selectedFile ? (
                <div className="preview-grid">
                  <div className="preview-item">
                    <span className="preview-label">File ID</span>
                    <span className="preview-value">{selectedFile.id}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Customer Name</span>
                    <span className="preview-value">{selectedFile.customerName || selectedFile.customer_name}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Bank</span>
                    <span className="preview-value">{selectedFile.bankName || selectedFile.bank_name}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Loan Type</span>
                    <span className="preview-value">{selectedFile.loanType || selectedFile.loan_type}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Loan Amount</span>
                    <span className="preview-value highlight">
                      {formatCurrency(selectedFile.amount || selectedFile.loanAmount || 0)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="empty-preview">
                  <div className="empty-icon">📁</div>
                  <div className="empty-text">Select a loan file to see details</div>
                </div>
              )}
            </div>

            {/* Executive Preview */}
            <div className="preview-card">
              <div className="preview-header">
                <span>👤</span>
                <span>Executive Preview</span>
              </div>

              {selectedExecutive ? (
                <div className="preview-grid">
                  <div className="preview-item">
                    <span className="preview-label">Name</span>
                    <span className="preview-value">{selectedExecutive.name}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Email</span>
                    <span className="preview-value">{selectedExecutive.email}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Phone</span>
                    <span className="preview-value">
                      {selectedExecutive.contact_number || selectedExecutive.phone || selectedExecutive.mobile || "N/A"}
                    </span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Role</span>
                    <span className="preview-value">{selectedExecutive.login_role || selectedExecutive.role}</span>
                  </div>
                </div>
              ) : (
                <div className="empty-preview">
                  <div className="empty-icon">👤</div>
                  <div className="empty-text">Select an executive to see details</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignExecutive;
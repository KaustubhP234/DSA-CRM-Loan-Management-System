import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const UpdateStatus = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [formData, setFormData] = useState({
    file_id: "",
    new_status: "",
    description: "",
    remark: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [loanFiles, setLoanFiles] = useState([]);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
    setLoanFiles(files);
  }, []);

  /* ---------------- STATUS OPTIONS ---------------- */
  const statusOptions = [
    { value: "In-Process", label: "⏳ In-Process", color: "#3b82f6" },
    { value: "Login", label: "🔐 Login", color: "#8b5cf6" },
    { value: "Query", label: "❓ Query", color: "#f59e0b" },
    { value: "Active", label: "✅ Active", color: "#10b981" },
    { value: "Sanctioned", label: "💰 Sanctioned", color: "#06b6d4" },
    { value: "Rejected", label: "❌ Rejected", color: "#ef4444" },
    { value: "Disbursement", label: "💸 Disbursement", color: "#14b8a6" },
  ];

  /* ---------------- HANDLE FILE SELECTION ---------------- */
  const handleFileSelect = (e) => {
    const fileId = e.target.value;
    setFormData({ ...formData, file_id: fileId });

    const file = loanFiles.find(f => String(f.id) === String(fileId));
    setSelectedFile(file || null);
  };

  /* ---------------- HANDLE SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.file_id) {
      alert("Please select a loan file");
      return;
    }

    if (!formData.new_status) {
      alert("Please select a status");
      return;
    }

    // Create status entry
    const statusEntry = {
      id: Date.now().toString(),
      status_id: `STS${Date.now()}`,
      file_id: selectedFile.id,
      customer_id: selectedFile.customerId || selectedFile.customer_id,
      customer_name: selectedFile.customerName || selectedFile.customer_name,
      old_status: selectedFile.fileStatus || selectedFile.status || "New",
      new_status: formData.new_status,
      description: formData.description,
      remark: formData.remark,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
    };

    // Save to status history
    const statusHistory = JSON.parse(localStorage.getItem("statusHistory")) || [];
    statusHistory.push(statusEntry);
    localStorage.setItem("statusHistory", JSON.stringify(statusHistory));

    // Update file status
    const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const updatedFiles = files.map(f =>
      String(f.id) === String(selectedFile.id)
        ? { ...f, fileStatus: formData.new_status, status: formData.new_status }
        : f
    );
    localStorage.setItem("loanFiles", JSON.stringify(updatedFiles));

    alert("✅ Status updated successfully!");
    navigate("/admin/status");
  };

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .update-status-container {
          font-family: 'Inter', sans-serif;
          padding: 2.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        /* Header */
        .page-header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          margin-bottom: 2.5rem;
          box-shadow: 0 20px 60px rgba(30, 41, 59, 0.25);
          position: relative;
          overflow: hidden;
        }

        .page-header::before {
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

        /* Form Layout */
        .form-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 2rem;
        }

        .form-card {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .form-card-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .required {
          color: #ef4444;
          margin-left: 0.25rem;
        }

        .form-select,
        .form-textarea {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s;
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', sans-serif;
        }

        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #1e293b;
          background: white;
          box-shadow: 0 0 0 4px rgba(30, 41, 59, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .status-option {
          padding: 0.5rem;
          font-weight: 600;
        }

        /* Preview Card */
        .preview-card {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 1.5rem;
          color: white;
          box-shadow: 0 8px 24px rgba(30, 41, 59, 0.3);
        }

        .preview-title {
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .preview-grid {
          display: grid;
          gap: 1rem;
        }

        .preview-item {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .preview-label {
          font-size: 0.75rem;
          opacity: 0.8;
          font-weight: 600;
        }

        .preview-value {
          font-size: 1rem;
          font-weight: 700;
        }

        .preview-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
          margin: 1rem 0;
        }

        .empty-preview {
          text-align: center;
          padding: 3rem 2rem;
          color: white;
          opacity: 0.7;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .current-status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 700;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn-primary {
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          flex: 1;
          box-shadow: 0 10px 25px rgba(30, 41, 59, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(30, 41, 59, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        @media (max-width: 1200px) {
          .form-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .update-status-container {
            padding: 1.5rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="update-status-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">🔄 Update Status</h1>
            <p className="page-subtitle">Change loan file status and add remarks</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-layout">
            {/* Left Column - Form */}
            <div className="form-card">
              <h2 className="form-card-title">
                <span>📋</span>
                <span>Status Update Form</span>
              </h2>

              {/* Select File */}
              <div className="form-group">
                <label className="form-label">
                  Select Loan File <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.file_id}
                  onChange={handleFileSelect}
                  required
                >
                  <option value="">-- Choose a loan file --</option>
                  {loanFiles.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.id} - {file.customerName || file.customer_name} ({file.loanType || file.loan_type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Status */}
              <div className="form-group">
                <label className="form-label">
                  New Status <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.new_status}
                  onChange={(e) => setFormData({ ...formData, new_status: e.target.value })}
                  required
                >
                  <option value="">-- Choose a status --</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value} className="status-option">
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe the status change..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Remark */}
              <div className="form-group">
                <label className="form-label">Remark</label>
                <textarea
                  className="form-textarea"
                  placeholder="Add any additional remarks..."
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                />
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  ✅ Update Status
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/status")}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div>
              <div className="preview-card">
                <h3 className="preview-title">
                  <span>📄</span>
                  <span>File Preview</span>
                </h3>

                {selectedFile ? (
                  <div className="preview-grid">
                    <div className="preview-item">
                      <span className="preview-label">File ID</span>
                      <span className="preview-value">{selectedFile.id}</span>
                    </div>

                    <div className="preview-divider"></div>

                    <div className="preview-item">
                      <span className="preview-label">Customer Name</span>
                      <span className="preview-value">
                        {selectedFile.customerName || selectedFile.customer_name}
                      </span>
                    </div>

                    <div className="preview-item">
                      <span className="preview-label">Bank</span>
                      <span className="preview-value">
                        {selectedFile.bankName || selectedFile.bank_name}
                      </span>
                    </div>

                    <div className="preview-divider"></div>

                    <div className="preview-item">
                      <span className="preview-label">Loan Type</span>
                      <span className="preview-value">
                        {selectedFile.loanType || selectedFile.loan_type}
                      </span>
                    </div>

                    <div className="preview-item">
                      <span className="preview-label">Loan Amount</span>
                      <span className="preview-value">
                        {formatCurrency(selectedFile.amount || selectedFile.loanAmount || 0)}
                      </span>
                    </div>

                    <div className="preview-divider"></div>

                    <div className="preview-item">
                      <span className="preview-label">Current Status</span>
                      <span className="current-status-badge">
                        {selectedFile.fileStatus || selectedFile.status || "New"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="empty-preview">
                    <div className="empty-icon">📁</div>
                    <p>Select a loan file to see details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateStatus;
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AssignExecutive = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [formData, setFormData] = useState({
    file_id: "",
    executive_id: "",
    remarks: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedExecutive, setSelectedExecutive] = useState(null);

  /* ---------------- LOAD DATA ---------------- */
  const [loanFiles, setLoanFiles] = useState([]);
  const [executives, setExecutives] = useState([]);

  useEffect(() => {
    // Load loan files
    const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
    console.log("=== LOAN FILES ===");
    console.log("Total files found:", files.length);
    console.log("Files:", files);
    setLoanFiles(files);

    // Load all users
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    console.log("=== ALL USERS ===");
    console.log("Total users found:", allUsers.length);
    console.log("All users:", allUsers);
    
    // ✅ ULTRA-ROBUST MATCHING: Try multiple strategies
    const bankExecutives = allUsers.filter(user => {
      if (!user.login_role && !user.role) {
        console.log(`User ${user.name} has no role field`);
        return false;
      }

      // Get the role (try both fields)
      const role = (user.login_role || user.role || "").toString();
      const roleLower = role.toLowerCase();
      
      console.log(`Checking user: ${user.name}, role field: "${role}"`);

      // Strategy 1: Exact match (case-insensitive)
      if (roleLower === "bank executive" || roleLower === "bank_executive") {
        console.log(`✅ Match Strategy 1: Exact match for ${user.name}`);
        return true;
      }

      // Strategy 2: Contains both "bank" AND "executive"
      if (roleLower.includes("bank") && roleLower.includes("executive")) {
        console.log(`✅ Match Strategy 2: Contains both keywords for ${user.name}`);
        return true;
      }

      // Strategy 3: Check if role equals common variations
      const commonVariations = [
        "bankexecutive",
        "bank executive",
        "bank_executive", 
        "bank-executive",
        "executive bank",
        "executive_bank",
      ];
      
      if (commonVariations.some(v => roleLower === v)) {
        console.log(`✅ Match Strategy 3: Matches variation for ${user.name}`);
        return true;
      }

      console.log(`❌ No match for ${user.name}`);
      return false;
    });
    
    console.log("=== BANK EXECUTIVES FOUND ===");
    console.log("Total executives:", bankExecutives.length);
    console.log("Executives:", bankExecutives);
    
    setExecutives(bankExecutives);
  }, []);

  /* ---------------- HANDLE FILE SELECTION ---------------- */
  const handleFileSelect = (e) => {
    const fileId = e.target.value;
    setFormData({ ...formData, file_id: fileId });

    // ✅ FIX: Convert both to string for comparison
    const file = loanFiles.find(f => String(f.id) === String(fileId));
    console.log("Selected file ID:", fileId);
    console.log("Selected file:", file);
    setSelectedFile(file || null);
  };

  /* ---------------- HANDLE EXECUTIVE SELECTION ---------------- */
  const handleExecutiveSelect = (e) => {
    const executiveId = e.target.value;
    setFormData({ ...formData, executive_id: executiveId });

    // ✅ FIX: Convert both to string for comparison
    const executive = executives.find(ex => String(ex.id) === String(executiveId));
    console.log("Selected executive ID:", executiveId);
    console.log("Selected executive:", executive);
    setSelectedExecutive(executive || null);
  };

  /* ---------------- GENERATE ASSIGNMENT ID ---------------- */
  const generateAssignmentId = () => {
    const existingAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    const lastId = existingAssignments.length > 0 
      ? parseInt(existingAssignments[existingAssignments.length - 1].assignment_id.replace("ASN", ""))
      : 0;
    return `ASN${String(lastId + 1).padStart(3, "0")}`;
  };

  /* ---------------- SUBMIT FORM ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.file_id) {
      alert("Please select a loan file");
      return;
    }

    if (!formData.executive_id) {
      alert("Please select a bank executive");
      return;
    }

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

    console.log("Creating assignment:", newAssignment);

    const existingAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    existingAssignments.push(newAssignment);
    localStorage.setItem("executiveAssignments", JSON.stringify(existingAssignments));

    alert("✅ Executive assigned successfully!");
    navigate("/admin/executive-assignment");
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

        .assign-executive-container {
          font-family: 'Inter', sans-serif;
          padding: 2.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        .page-header {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          margin-bottom: 2.5rem;
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.25);
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

        .debug-info {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .debug-title {
          font-weight: 700;
          color: #92400e;
          margin-bottom: 0.5rem;
        }

        .debug-text {
          font-size: 0.875rem;
          color: #78350f;
          margin: 0.25rem 0;
        }

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
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .error-text {
          font-size: 0.875rem;
          color: #dc2626;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .preview-card {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 1.5rem;
          color: white;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
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

        .executive-card {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          padding: 2rem;
          border-radius: 16px;
          color: white;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
        }

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
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          flex: 1;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
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
          .assign-executive-container {
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

      <div className="assign-executive-container">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">👤 Assign Executive</h1>
            <p className="page-subtitle">Assign loan file to a bank executive</p>
          </div>
        </div>

        {executives.length === 0 && (
          <div className="debug-info">
            <div className="debug-title">⚠️ No bank executives available. Please create users with role "Bank Executive" first.</div>
            <div className="debug-text">Open browser console (F12) to see detailed debug information</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-layout">
            <div className="form-card">
              <h2 className="form-card-title">
                <span>📋</span>
                <span>Assignment Details</span>
              </h2>

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

              <div className="form-group">
                <label className="form-label">
                  Select Bank Executive <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.executive_id}
                  onChange={handleExecutiveSelect}
                  required
                >
                  <option value="">-- Choose an executive --</option>
                  {executives.map((executive) => (
                    <option key={executive.id} value={executive.id}>
                      {executive.name} - {executive.email} [{executive.login_role || executive.role}]
                    </option>
                  ))}
                </select>
                {executives.length === 0 && (
                  <div className="error-text">
                    ⚠️ No bank executives available. Please create users with role "Bank Executive" first.
                  </div>
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
                <button type="submit" className="btn btn-primary">
                  ✅ Assign Executive
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    console.log("Cancel clicked, navigating back...");
                    navigate("/admin/executive-assignment");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

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
                  </div>
                ) : (
                  <div className="empty-preview">
                    <div className="empty-icon">📁</div>
                    <p>Select a loan file to see details</p>
                  </div>
                )}
              </div>

              <div className="executive-card">
                <h3 className="preview-title">
                  <span>👤</span>
                  <span>Executive Preview</span>
                </h3>

                {selectedExecutive ? (
                  <div className="preview-grid">
                    <div className="preview-item">
                      <span className="preview-label">Name</span>
                      <span className="preview-value">{selectedExecutive.name}</span>
                    </div>

                    <div className="preview-divider"></div>

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

                    <div className="preview-divider"></div>

                    <div className="preview-item">
                      <span className="preview-label">Role</span>
                      <span className="preview-value">{selectedExecutive.login_role || selectedExecutive.role}</span>
                    </div>
                  </div>
                ) : (
                  <div className="empty-preview">
                    <div className="empty-icon">👤</div>
                    <p>Select an executive to see details</p>
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

export default AssignExecutive;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditLoan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    loanType: "",
    amount: "",
    status: "In-Process",
    email: "",
    phone: "",
    bankName: "",
  });

  /* ---------------- LOAD EXISTING LOAN ---------------- */
  useEffect(() => {
    const loans = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const loan = loans.find((l) => String(l.id) === String(id));

    if (!loan) {
      alert("Loan not found");
      navigate(-1);
      return;
    }

    setForm({
      name: loan.name || "",
      loanType: loan.loanType || "",
      amount: loan.amount || "",
      status: loan.status || "In-Process",
      email: loan.email || "",
      phone: loan.phone || "",
      bankName: loan.bankName || "",
    });
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ---------------- SAVE UPDATE ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.loanType || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    const loans = JSON.parse(localStorage.getItem("loanFiles")) || [];

    const updatedLoans = loans.map((l) =>
      String(l.id) === String(id) ? { ...l, ...form } : l
    );

    localStorage.setItem("loanFiles", JSON.stringify(updatedLoans));

    navigate(`/admin/loan-files/${id}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        .edit-loan-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .edit-loan-wrapper {
          max-width: 900px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-header {
          margin-bottom: 2rem;
        }

        .form-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
        }

        .form-header p {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
          font-weight: 500;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          color: #64748b;
        }

        .breadcrumb a {
          color: #004E89;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
          cursor: pointer;
        }

        .breadcrumb a:hover {
          color: #003366;
        }

        .breadcrumb span {
          color: #94a3b8;
        }

        .form-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .required {
          color: #DC2626;
          font-weight: 700;
        }

        .form-input,
        .form-select {
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          color: #1e293b;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #004E89;
          box-shadow: 0 0 0 3px rgba(0, 78, 137, 0.1);
          transform: translateY(-1px);
        }

        .form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%2364748b' d='M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        .input-icon {
          position: relative;
        }

        .input-icon-symbol {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1.1rem;
          pointer-events: none;
        }

        .input-icon .form-input {
          padding-left: 2.75rem;
        }

        .form-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid #f1f5f9;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #004E89, #003366);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 2px solid #f1f5f9;
        }

        .btn {
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, #004E89 0%, #003366 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 78, 137, 0.25);
          flex: 1;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 78, 137, 0.35);
        }

        .btn-secondary {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #475569;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .status-in-process {
          background: rgba(255, 107, 53, 0.1);
          color: #FF6B35;
        }

        .status-is-disbursement {
          background: rgba(0, 78, 137, 0.1);
          color: #004E89;
        }

        .status-completed {
          background: rgba(31, 168, 131, 0.1);
          color: #1FA883;
        }

        .status-rejected {
          background: rgba(220, 38, 38, 0.1);
          color: #DC2626;
        }

        .warning-box {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-left: 4px solid #f59e0b;
          padding: 1.25rem;
          border-radius: 12px;
          margin-top: 1.5rem;
        }

        .warning-box-title {
          font-weight: 700;
          color: #92400e;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .warning-box-text {
          color: #92400e;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .edit-loan-container {
            padding: 1rem;
          }

          .form-card {
            padding: 1.5rem;
          }

          .form-header h1 {
            font-size: 1.75rem;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="edit-loan-container">
        <div className="edit-loan-wrapper">
          <div className="breadcrumb">
            <a onClick={() => navigate("/admin/dashboard")}>Dashboard</a>
            <span>›</span>
            <a onClick={() => navigate("/admin/loan-files")}>Loan Files</a>
            <span>›</span>
            <span>Edit Loan</span>
          </div>

          <div className="form-header">
            <h1>Edit Loan File</h1>
            <p>Update loan information and save changes</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-card">
              {/* Customer Information */}
              <div className="section-title">
                <div className="section-icon">👤</div>
                Customer Information
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Customer Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-icon">
                    <span className="input-icon-symbol">✉️</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="customer@example.com"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="input-icon">
                    <span className="input-icon-symbol">📞</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="form-section">
                <div className="section-title">
                  <div className="section-icon">💰</div>
                  Loan Details
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Loan Type <span className="required">*</span>
                    </label>
                    <select
                      name="loanType"
                      value={form.loanType}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select loan type</option>
                      <option value="Home Loan">🏠 Home Loan</option>
                      <option value="Vehicle Loan">🚗 Vehicle Loan</option>
                      <option value="Personal Loan">👤 Personal Loan</option>
                      <option value="Business Loan">💼 Business Loan</option>
                      <option value="Education Loan">🎓 Education Loan</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Loan Amount <span className="required">*</span>
                    </label>
                    <div className="input-icon">
                      <span className="input-icon-symbol">₹</span>
                      <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Enter loan amount"
                        className="form-input"
                        required
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bank Partner</label>
                    <select
                      name="bankName"
                      value={form.bankName}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select bank</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="Axis">Axis Bank</option>
                      <option value="Kotak">Kotak Mahindra Bank</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="In-Process">⏳ In-Process</option>
                      <option value="Is-Disbursement">
                        💰 Is-Disbursement
                      </option>
                      <option value="Completed">✅ Completed</option>
                      <option value="Rejected">❌ Rejected</option>
                    </select>
                    <div
                      className={`status-badge status-${form.status
                        .toLowerCase()
                        .replace("-", "")}`}
                    >
                      <span>●</span>
                      <span>{form.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Box */}
              <div className="warning-box">
                <div className="warning-box-title">
                  <span>⚠️</span>
                  Important Notice
                </div>
                <p className="warning-box-text">
                  Please review all changes carefully before saving. Updates to
                  loan status may trigger notifications to relevant stakeholders
                  and affect workflow processes.
                </p>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <span>💾</span>
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  <span>←</span>
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditLoan;
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBank = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bankName: "",
    branch: "",
    ifscCode: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    minInterestRate: "",
    maxInterestRate: "",
    minLoanAmount: "",
    maxLoanAmount: "",
    status: "Active",
    loanTypes: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [bankNotFound, setBankNotFound] = useState(false);

  const availableLoanTypes = [
    "Home Loan",
    "Vehicle Loan",
    "Personal Loan",
    "Business Loan",
    "Education Loan",
    "Gold Loan",
    "Loan Against Property",
  ];

  // Load bank data
  useEffect(() => {
    const banks = JSON.parse(localStorage.getItem("banks")) || [];
    const bank = banks.find((b) => b.id === parseInt(id));

    if (bank) {
      setFormData({
        bankName: bank.bank_name || "",
        branch: bank.branch || "",
        ifscCode: bank.ifsc_code || "",
        contactPerson: bank.contact_person || "",
        contactNumber: bank.contact_number || "",
        email: bank.email || "",
        address: bank.address || "",
        city: bank.city || "",
        state: bank.state || "",
        pincode: bank.pincode || "",
        minInterestRate: bank.interest_rate_min || "",
        maxInterestRate: bank.interest_rate_max || "",
        minLoanAmount: bank.min_loan_amount || "",
        maxLoanAmount: bank.max_loan_amount || "",
        status: bank.status || "Active",
        loanTypes: bank.loan_types || [],
      });
      setLoading(false);
    } else {
      setBankNotFound(true);
      setLoading(false);
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle loan type selection
  const handleLoanTypeToggle = (loanType) => {
    setFormData((prev) => ({
      ...prev,
      loanTypes: prev.loanTypes.includes(loanType)
        ? prev.loanTypes.filter((type) => type !== loanType)
        : [...prev.loanTypes, loanType],
    }));
    if (errors.loanTypes) {
      setErrors((prev) => ({ ...prev, loanTypes: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = "⚠️ Bank name is required";
    }
    if (!formData.branch.trim()) {
      newErrors.branch = "⚠️ Branch name is required";
    }
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "⚠️ IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = "⚠️ Invalid IFSC code format";
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "⚠️ Contact person name is required";
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "⚠️ Contact number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.contactNumber.replace(/[^0-9]/g, ""))) {
      newErrors.contactNumber = "⚠️ Invalid mobile number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "⚠️ Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "⚠️ Invalid email format";
    }
    if (!formData.address.trim()) {
      newErrors.address = "⚠️ Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "⚠️ City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "⚠️ State is required";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "⚠️ Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "⚠️ Pincode must be 6 digits";
    }
    if (!formData.minInterestRate) {
      newErrors.minInterestRate = "⚠️ Min interest rate is required";
    } else if (isNaN(formData.minInterestRate) || formData.minInterestRate <= 0) {
      newErrors.minInterestRate = "⚠️ Must be a positive number";
    }
    if (!formData.maxInterestRate) {
      newErrors.maxInterestRate = "⚠️ Max interest rate is required";
    } else if (isNaN(formData.maxInterestRate) || formData.maxInterestRate <= 0) {
      newErrors.maxInterestRate = "⚠️ Must be a positive number";
    } else if (parseFloat(formData.maxInterestRate) < parseFloat(formData.minInterestRate)) {
      newErrors.maxInterestRate = "⚠️ Max rate must be ≥ min rate";
    }
    if (!formData.minLoanAmount) {
      newErrors.minLoanAmount = "⚠️ Min loan amount is required";
    } else if (isNaN(formData.minLoanAmount) || formData.minLoanAmount <= 0) {
      newErrors.minLoanAmount = "⚠️ Must be a positive number";
    }
    if (!formData.maxLoanAmount) {
      newErrors.maxLoanAmount = "⚠️ Max loan amount is required";
    } else if (isNaN(formData.maxLoanAmount) || formData.maxLoanAmount <= 0) {
      newErrors.maxLoanAmount = "⚠️ Must be a positive number";
    } else if (parseFloat(formData.maxLoanAmount) < parseFloat(formData.minLoanAmount)) {
      newErrors.maxLoanAmount = "⚠️ Max amount must be ≥ min amount";
    }
    if (formData.loanTypes.length === 0) {
      newErrors.loanTypes = "⚠️ Select at least one loan type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("❌ Please fix all errors before submitting");
      return;
    }

    const banks = JSON.parse(localStorage.getItem("banks")) || [];
    const updatedBanks = banks.map((bank) =>
      bank.id === parseInt(id)
        ? {
            ...bank,
            bank_name: formData.bankName,
            branch: formData.branch,
            ifsc_code: formData.ifscCode,
            contact_person: formData.contactPerson,
            contact_number: formData.contactNumber,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            status: formData.status,
            loan_types: formData.loanTypes,
            interest_rate_min: parseFloat(formData.minInterestRate),
            interest_rate_max: parseFloat(formData.maxInterestRate),
            min_loan_amount: parseFloat(formData.minLoanAmount),
            max_loan_amount: parseFloat(formData.maxLoanAmount),
          }
        : bank
    );

    localStorage.setItem("banks", JSON.stringify(updatedBanks));
    alert("✅ Bank updated successfully!");
    navigate("/admin/banks");
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm("⚠️ Discard changes and go back?")) {
      navigate("/admin/banks");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p>Loading bank data...</p>
      </div>
    );
  }

  if (bankNotFound) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <h2>❌ Bank Not Found</h2>
        <p>The bank you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/admin/banks")}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Back to Banks
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

        * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .edit-bank-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0;
        }

        .page-header {
          margin-bottom: 1.5rem;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.75rem;
        }

        .breadcrumb a {
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.2s;
        }

        .breadcrumb a:hover {
          color: #2563eb;
        }

        .page-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .bank-id-badge {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 0.375rem 0.875rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
        }

        .page-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }

        .warning-box {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-left: 4px solid #f59e0b;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .warning-box p {
          margin: 0;
          font-size: 0.875rem;
          color: #92400e;
          line-height: 1.5;
        }

        .form-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }

        .form-grid-full {
          grid-column: 1 / -1;
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
          gap: 0.25rem;
        }

        .required {
          color: #ef4444;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 0.75rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .error-message {
          font-size: 0.8rem;
          color: #ef4444;
          margin-top: 0.25rem;
        }

        .input-hint {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 0.25rem;
        }

        .loan-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .loan-type-checkbox {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.75rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .loan-type-checkbox:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .loan-type-checkbox.selected {
          background: #dbeafe;
          border-color: #3b82f6;
        }

        .loan-type-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #3b82f6;
        }

        .loan-type-checkbox label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
          cursor: pointer;
          user-select: none;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f1f5f9;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .loan-types-grid {
            grid-template-columns: 1fr;
          }

          .page-title {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="edit-bank-container">
        {/* Header */}
        <div className="page-header">
          <div className="breadcrumb">
            <a href="/admin/banks">Banks</a>
            <span>›</span>
            <span>Edit Bank</span>
          </div>
          <h1 className="page-title">
            <span>✏️ Edit Bank</span>
            <span className="bank-id-badge">ID: {id}</span>
          </h1>
          <p className="page-subtitle">Update banking partner information</p>
        </div>

        {/* Warning Box */}
        <div className="warning-box">
          <p>
            ⚠️ <strong>Important:</strong> Changes made here will affect all
            related loan files and records. Please ensure all information is
            accurate.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Bank Information */}
          <div className="form-card">
            <h2 className="section-title">
              <span>🏢</span> Bank Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Bank Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., HDFC Bank"
                />
                {errors.bankName && (
                  <span className="error-message">{errors.bankName}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Branch Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Mumbai Central"
                />
                {errors.branch && (
                  <span className="error-message">{errors.branch}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  IFSC Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., HDFC0001234"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                />
                {errors.ifscCode && (
                  <span className="error-message">{errors.ifscCode}</span>
                )}
                <span className="input-hint">Format: ABCD0123456</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Status <span className="required">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-card">
            <h2 className="section-title">
              <span>👤</span> Contact Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Contact Person <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Rajesh Kumar"
                />
                {errors.contactPerson && (
                  <span className="error-message">{errors.contactPerson}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Contact Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 9876543210"
                  maxLength="15"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                />
                {errors.contactNumber && (
                  <span className="error-message">{errors.contactNumber}</span>
                )}
                <span className="input-hint">10-digit mobile number</span>
              </div>

              <div className="form-group form-grid-full">
                <label className="form-label">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., rajesh@hdfcbank.com"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="form-card">
            <h2 className="section-title">
              <span>📍</span> Address Information
            </h2>
            <div className="form-grid">
              <div className="form-group form-grid-full">
                <label className="form-label">
                  Address <span className="required">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Enter complete address..."
                ></textarea>
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  City <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Mumbai"
                />
                {errors.city && (
                  <span className="error-message">{errors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  State <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Maharashtra"
                />
                {errors.state && (
                  <span className="error-message">{errors.state}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Pincode <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 400001"
                  maxLength="6"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                />
                {errors.pincode && (
                  <span className="error-message">{errors.pincode}</span>
                )}
                <span className="input-hint">6-digit pincode</span>
              </div>
            </div>
          </div>

          {/* Loan Products */}
          <div className="form-card">
            <h2 className="section-title">
              <span>💰</span> Loan Products
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Min Interest Rate (%) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="minInterestRate"
                  value={formData.minInterestRate}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 8.5"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                />
                {errors.minInterestRate && (
                  <span className="error-message">
                    {errors.minInterestRate}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Max Interest Rate (%) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="maxInterestRate"
                  value={formData.maxInterestRate}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 12.5"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                />
                {errors.maxInterestRate && (
                  <span className="error-message">
                    {errors.maxInterestRate}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Min Loan Amount (₹) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="minLoanAmount"
                  value={formData.minLoanAmount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 100000"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                />
                {errors.minLoanAmount && (
                  <span className="error-message">{errors.minLoanAmount}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Max Loan Amount (₹) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="maxLoanAmount"
                  value={formData.maxLoanAmount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 10000000"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                />
                {errors.maxLoanAmount && (
                  <span className="error-message">{errors.maxLoanAmount}</span>
                )}
              </div>

              <div className="form-group form-grid-full">
                <label className="form-label">
                  Loan Types <span className="required">*</span>
                </label>
                <div className="loan-types-grid">
                  {availableLoanTypes.map((loanType) => (
                    <div
                      key={loanType}
                      className={`loan-type-checkbox ${
                        formData.loanTypes.includes(loanType) ? "selected" : ""
                      }`}
                      onClick={() => handleLoanTypeToggle(loanType)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.loanTypes.includes(loanType)}
                        onChange={() => handleLoanTypeToggle(loanType)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label>{loanType}</label>
                    </div>
                  ))}
                </div>
                {errors.loanTypes && (
                  <span className="error-message">{errors.loanTypes}</span>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              <span>✕</span>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <span>✓</span>
              Update Bank
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditBank;    
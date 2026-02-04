import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBank = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    zonal_code: "",
    address: "",
    contact_person_name: "",
    contact_person_number: "",
    
    // Boolean Flags
    isCibil: false,
    ownProperty: false,
    isRented: false,
    isITR: false,
    
    // Loan Limits
    min_loan_amount: "",
    max_loan_amount: "",
    
    // Status
    bank_status: "Active",
    bank_reg_date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Bank name is required";
    }

    if (!formData.zonal_code.trim()) {
      newErrors.zonal_code = "Zonal code is required";
    }

    if (!formData.contact_person_name.trim()) {
      newErrors.contact_person_name = "Contact person name is required";
    }

    if (!formData.contact_person_number.trim()) {
      newErrors.contact_person_number = "Contact number is required";
    } else if (!/^[+]?[0-9]{10,15}$/.test(formData.contact_person_number.replace(/\s/g, ""))) {
      newErrors.contact_person_number = "Invalid contact number";
    }

    if (formData.min_loan_amount && formData.max_loan_amount) {
      if (parseFloat(formData.min_loan_amount) >= parseFloat(formData.max_loan_amount)) {
        newErrors.min_loan_amount = "Min amount must be less than max amount";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Get existing banks
    const banks = JSON.parse(localStorage.getItem("banks")) || [];

    // Check for duplicate
    if (banks.some((b) => b.name.toLowerCase() === formData.name.toLowerCase())) {
      alert("A bank with this name already exists!");
      return;
    }

    // Create new bank
    const newBank = {
      id: banks.length > 0 ? Math.max(...banks.map((b) => b.id)) + 1 : 1,
      ...formData,
      created_at: new Date().toISOString(),
    };

    // Save to localStorage
    banks.push(newBank);
    localStorage.setItem("banks", JSON.stringify(banks));

    alert("✅ Bank registered successfully!");
    navigate("/admin/banks");
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      navigate("/admin/banks");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .create-bank-enhanced {
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 2rem;
          background: #f8fafc;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 0.95rem;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 2px solid #e2e8f0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-icon {
          font-size: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
        }

        .required {
          color: #DC2626;
          margin-left: 0.25rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #004E89;
          box-shadow: 0 0 0 3px rgba(0, 78, 137, 0.1);
        }

        .form-input.error,
        .form-select.error,
        .form-textarea.error {
          border-color: #DC2626;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .error-message {
          font-size: 0.8rem;
          color: #DC2626;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .input-hint {
          font-size: 0.8rem;
          color: #64748b;
        }

        /* Checkbox Group */
        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.3s;
          cursor: pointer;
        }

        .checkbox-item:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .checkbox-item.checked {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .checkbox-input {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #004E89;
        }

        .checkbox-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-description {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        /* Info Box */
        .info-box {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 1px solid #93c5fd;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-box-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-box-text {
          font-size: 0.8rem;
          color: #1e3a8a;
          line-height: 1.5;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1.5rem;
          border-top: 2px solid #e2e8f0;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .btn-primary {
          background: #004E89;
          color: white;
          box-shadow: 0 2px 4px rgba(0, 78, 137, 0.2);
        }

        .btn-primary:hover {
          background: #003d6b;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 78, 137, 0.3);
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
          .create-bank-enhanced {
            padding: 1rem;
          }

          .form-grid,
          .checkbox-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="create-bank-enhanced">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">🏦 Bank Registration (Enhanced)</h1>
          <p className="page-subtitle">Register a new bank with complete details</p>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <div className="info-box-title">
            <span>ℹ️</span>
            <span>Enhanced Bank Registration</span>
          </div>
          <p className="info-box-text">
            This enhanced form includes additional fields for CIBIL requirements, property status, 
            ITR status, and loan amount limits to help better qualify customers.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-card">
          {/* Basic Information */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">🏢</span>
              Basic Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Bank Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  className={`form-input ${errors.name ? "error" : ""}`}
                />
                {errors.name && <span className="error-message">⚠️ {errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Zonal Code<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="zonal_code"
                  value={formData.zonal_code}
                  onChange={handleChange}
                  placeholder="e.g., ZONE001"
                  className={`form-input ${errors.zonal_code ? "error" : ""}`}
                />
                {errors.zonal_code && <span className="error-message">⚠️ {errors.zonal_code}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter bank address"
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Contact Person Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="contact_person_name"
                  value={formData.contact_person_name}
                  onChange={handleChange}
                  placeholder="Enter contact person name"
                  className={`form-input ${errors.contact_person_name ? "error" : ""}`}
                />
                {errors.contact_person_name && (
                  <span className="error-message">⚠️ {errors.contact_person_name}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Contact Person Number<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="contact_person_number"
                  value={formData.contact_person_number}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className={`form-input ${errors.contact_person_number ? "error" : ""}`}
                />
                {errors.contact_person_number && (
                  <span className="error-message">⚠️ {errors.contact_person_number}</span>
                )}
              </div>
            </div>
          </div>

          {/* Requirements & Flags */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">✅</span>
              Customer Requirements
            </h2>
            <p className="input-hint" style={{ marginBottom: '1rem' }}>
              Select the requirements this bank needs from customers
            </p>
            <div className="checkbox-grid">
              <div className={`checkbox-item ${formData.isCibil ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  id="isCibil"
                  name="isCibil"
                  checked={formData.isCibil}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <div>
                  <label htmlFor="isCibil" className="checkbox-label">
                    📊 CIBIL Score Required
                  </label>
                  <div className="checkbox-description">
                    Customer must have CIBIL score
                  </div>
                </div>
              </div>

              <div className={`checkbox-item ${formData.ownProperty ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  id="ownProperty"
                  name="ownProperty"
                  checked={formData.ownProperty}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <div>
                  <label htmlFor="ownProperty" className="checkbox-label">
                    🏠 Own Property Required
                  </label>
                  <div className="checkbox-description">
                    Customer must own property
                  </div>
                </div>
              </div>

              <div className={`checkbox-item ${formData.isRented ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  id="isRented"
                  name="isRented"
                  checked={formData.isRented}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <div>
                  <label htmlFor="isRented" className="checkbox-label">
                    🏘️ Rented Property Acceptable
                  </label>
                  <div className="checkbox-description">
                    Allows customers with rented property
                  </div>
                </div>
              </div>

              <div className={`checkbox-item ${formData.isITR ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  id="isITR"
                  name="isITR"
                  checked={formData.isITR}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <div>
                  <label htmlFor="isITR" className="checkbox-label">
                    📄 ITR Required
                  </label>
                  <div className="checkbox-description">
                    Customer must have Income Tax Returns
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Limits */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">💰</span>
              Loan Amount Limits
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Minimum Loan Amount</label>
                <input
                  type="number"
                  name="min_loan_amount"
                  value={formData.min_loan_amount}
                  onChange={handleChange}
                  placeholder="e.g., 100000"
                  className={`form-input ${errors.min_loan_amount ? "error" : ""}`}
                  min="0"
                  step="1000"
                />
                {errors.min_loan_amount && (
                  <span className="error-message">⚠️ {errors.min_loan_amount}</span>
                )}
                {!errors.min_loan_amount && (
                  <span className="input-hint">Minimum loan amount this bank offers</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Loan Amount</label>
                <input
                  type="number"
                  name="max_loan_amount"
                  value={formData.max_loan_amount}
                  onChange={handleChange}
                  placeholder="e.g., 10000000"
                  className="form-input"
                  min="0"
                  step="1000"
                />
                <span className="input-hint">Maximum loan amount this bank offers</span>
              </div>
            </div>
          </div>

          {/* Status & Date */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">📅</span>
              Status & Registration
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Bank Status</label>
                <select
                  name="bank_status"
                  value={formData.bank_status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Registration Date</label>
                <input
                  type="date"
                  name="bank_reg_date"
                  value={formData.bank_reg_date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Bank
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateBank;
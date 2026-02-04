import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCustomer = () => {
  const navigate = useNavigate();

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    whatsapp: "",
    pin: "",
    district: "",
    login_status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- SMART NAVIGATION ---------------- */
  const getNavigationPath = (path) => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/data-operator')) {
      return path.replace('/admin', '/data-operator');
    }
    return path;
  };

  /* ---------------- HANDLE INPUT CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Check if email already exists
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    if (customers.some((c) => c.email === formData.email)) {
      newErrors.email = "Email already exists";
    }

    // Contact number validation
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^[+]?[0-9]{10,15}$/.test(formData.contact.replace(/\s/g, ""))) {
      newErrors.contact = "Invalid contact number (10-15 digits)";
    }

    // WhatsApp validation (optional, but if provided must be valid)
    if (formData.whatsapp && !/^[+]?[0-9]{10,15}$/.test(formData.whatsapp.replace(/\s/g, ""))) {
      newErrors.whatsapp = "Invalid WhatsApp number (10-15 digits)";
    }

    // PIN code validation
    if (!formData.pin.trim()) {
      newErrors.pin = "PIN code is required";
    } else if (!/^[0-9]{6}$/.test(formData.pin)) {
      newErrors.pin = "PIN code must be 6 digits";
    }

    // District validation
    if (!formData.district.trim()) {
      newErrors.district = "District is required";
    } else if (formData.district.trim().length < 2) {
      newErrors.district = "District name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- HANDLE SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Get existing customers
    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    // Create new customer object
    const newCustomer = {
      id: customers.length > 0 ? Math.max(...customers.map((c) => c.id)) + 1 : 1,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      contact: formData.contact.trim(),
      whatsapp: formData.whatsapp.trim() || formData.contact.trim(),
      pin: formData.pin.trim(),
      district: formData.district.trim(),
      date_of_registration: new Date().toISOString().split("T")[0],
      registrationDate: new Date().toISOString().split("T")[0],
      created_date: new Date().toISOString().split("T")[0],
      login_status: formData.login_status,
      user_id: 1, // Current logged-in user (you can update this based on your auth)
    };

    // Add new customer
    customers.push(newCustomer);
    localStorage.setItem("customers", JSON.stringify(customers));

    // Show success message
    alert("Customer registered successfully!");

    // Smart navigation - go to correct path based on context
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(getNavigationPath("/admin/customers"));
    }, 500);
  };

  /* ---------------- HANDLE CANCEL ---------------- */
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All data will be lost.")) {
      navigate(getNavigationPath("/admin/customers"));
    }
  };

  /* ---------------- HANDLE BACK ---------------- */
  const handleBack = () => {
    navigate(getNavigationPath("/admin/customers"));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .create-customer-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          animation: fadeIn 0.5s ease-out;
          padding: 2rem;
          background: #f8fafc;
          min-height: 100vh;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-header-create {
          margin-bottom: 1.5rem;
        }

        .header-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .back-btn {
          padding: 0.5rem 0.75rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .back-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .page-title {
          font-size: 1.875rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
          font-weight: 500;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
          max-width: 1200px;
          margin: 0 auto;
        }

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
          margin: 0;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
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
        .form-select {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s;
          background: white;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #004E89;
          box-shadow: 0 0 0 3px rgba(0, 78, 137, 0.1);
        }

        .form-input.error,
        .form-select.error {
          border-color: #DC2626;
        }

        .error-message {
          font-size: 0.8rem;
          color: #DC2626;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .input-hint {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

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

        .btn-primary:hover:not(:disabled) {
          background: #003d6b;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 78, 137, 0.3);
        }

        .btn-primary:disabled {
          background: #94a3b8;
          cursor: not-allowed;
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
          .create-customer-container {
            padding: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-card {
            padding: 1.5rem;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="create-customer-container">
        {/* Header */}
        <div className="page-header-create">
          <div className="header-top">
            <button className="back-btn" onClick={handleBack}>
              ←
            </button>
            <div>
              <h1 className="page-title">Register New Customer</h1>
              <p className="page-subtitle">Add a new customer to the system</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <div className="info-box-title">
            <span>ℹ️</span>
            <span>Customer Registration</span>
          </div>
          <p className="info-box-text">
            Please fill in all required fields marked with (*). Email must be unique.
            WhatsApp number will default to contact number if not provided.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-card">
          {/* Personal Information */}
          <div className="form-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">
                  Full Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter customer full name"
                  className={`form-input ${errors.name ? "error" : ""}`}
                />
                {errors.name && (
                  <span className="error-message">⚠️ {errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email Address<span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                  className={`form-input ${errors.email ? "error" : ""}`}
                />
                {errors.email && (
                  <span className="error-message">⚠️ {errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Contact Number<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className={`form-input ${errors.contact ? "error" : ""}`}
                />
                {errors.contact && (
                  <span className="error-message">⚠️ {errors.contact}</span>
                )}
                {!errors.contact && (
                  <span className="input-hint">Include country code (e.g., +91)</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Number</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+91 9876543210 (optional)"
                  className={`form-input ${errors.whatsapp ? "error" : ""}`}
                />
                {errors.whatsapp && (
                  <span className="error-message">⚠️ {errors.whatsapp}</span>
                )}
                {!errors.whatsapp && (
                  <span className="input-hint">
                    Leave empty to use contact number
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="form-section">
            <h2 className="section-title">Address Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  PIN Code<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  placeholder="110001"
                  maxLength="6"
                  className={`form-input ${errors.pin ? "error" : ""}`}
                />
                {errors.pin && (
                  <span className="error-message">⚠️ {errors.pin}</span>
                )}
                {!errors.pin && (
                  <span className="input-hint">6-digit PIN code</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  District<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Enter district name"
                  className={`form-input ${errors.district ? "error" : ""}`}
                />
                {errors.district && (
                  <span className="error-message">⚠️ {errors.district}</span>
                )}
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="form-section">
            <h2 className="section-title">Account Status</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Login Status<span className="required">*</span>
                </label>
                <select
                  name="login_status"
                  value={formData.login_status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Active">Active - Customer can access system</option>
                  <option value="Inactive">Inactive - Customer cannot access</option>
                </select>
                <span className="input-hint">
                  Status can be changed later from customer list
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Registering Customer..." : "Register Customer"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateCustomer;
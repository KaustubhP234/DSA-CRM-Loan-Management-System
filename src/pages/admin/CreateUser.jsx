import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();

  /* ---------------- SMART NAVIGATION ---------------- */
  const getNavigationPath = (path) => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/data-operator')) {
      return path.replace('/admin', '/data-operator');
    }
    return path;
  };

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    username: "",
    password: "",
    confirmPassword: "",
    login_role: "DATA_OPERATOR",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Contact number validation
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = "Contact number is required";
    } else if (!/^[+]?[0-9]{10,15}$/.test(formData.contact_number.replace(/\s/g, ""))) {
      newErrors.contact_number = "Invalid contact number (10-15 digits)";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Check if username already exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.username === formData.username)) {
      newErrors.username = "Username already exists";
    }

    // Check if email already exists
    if (users.some((u) => u.email === formData.email)) {
      newErrors.email = "Email already exists";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    // Get existing users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Create new user object
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      contact_number: formData.contact_number.trim(),
      username: formData.username.trim(),
      password: formData.password, // In production, this should be hashed
      login_role: formData.login_role,
      role: formData.login_role,
      status: formData.status,
      date_of_registration: new Date().toISOString().split("T")[0],
      created_date: new Date().toISOString().split("T")[0],
    };

    // Add new user
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Show success message
    alert("User created successfully!");

    // Smart navigation
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(getNavigationPath("/admin/users"));
    }, 500);
  };

  /* ---------------- HANDLE CANCEL ---------------- */
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      navigate(getNavigationPath("/admin/users"));
    }
  };

  /* ---------------- HANDLE BACK ---------------- */
  const handleBack = () => {
    navigate(getNavigationPath("/admin/users"));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .create-user-container {
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

        .password-strength {
          margin-top: 0.5rem;
        }

        .strength-bar {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.25rem;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s;
        }

        .strength-text {
          font-size: 0.75rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .create-user-container {
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

      <div className="create-user-container">
        {/* Header */}
        <div className="page-header-create">
          <div className="header-top">
            <button className="back-btn" onClick={handleBack}>
              ←
            </button>
            <div>
              <h1 className="page-title">Create New User</h1>
              <p className="page-subtitle">Add a new user to the system</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <div className="info-box-title">
            <span>ℹ️</span>
            <span>Important Information</span>
          </div>
          <p className="info-box-text">
            Please fill in all required fields marked with (*). Username must be unique and
            cannot be changed later. Choose the appropriate role based on user responsibilities.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-card">
          {/* Personal Information */}
          <div className="form-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Full Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
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
                  placeholder="user@example.com"
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
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className={`form-input ${errors.contact_number ? "error" : ""}`}
                />
                {errors.contact_number && (
                  <span className="error-message">⚠️ {errors.contact_number}</span>
                )}
                {!errors.contact_number && (
                  <span className="input-hint">Include country code (e.g., +91)</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Username<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username123"
                  className={`form-input ${errors.username ? "error" : ""}`}
                />
                {errors.username && (
                  <span className="error-message">⚠️ {errors.username}</span>
                )}
                {!errors.username && (
                  <span className="input-hint">Letters, numbers, and underscores only</span>
                )}
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="form-section">
            <h2 className="section-title">Account Security</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Password<span className="required">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                />
                {errors.password && (
                  <span className="error-message">⚠️ {errors.password}</span>
                )}
                {!errors.password && formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div
                        className="strength-fill"
                        style={{
                          width:
                            formData.password.length < 6
                              ? "33%"
                              : formData.password.length < 10
                              ? "66%"
                              : "100%",
                          background:
                            formData.password.length < 6
                              ? "#DC2626"
                              : formData.password.length < 10
                              ? "#f59e0b"
                              : "#10b981",
                        }}
                      />
                    </div>
                    <span
                      className="strength-text"
                      style={{
                        color:
                          formData.password.length < 6
                            ? "#DC2626"
                            : formData.password.length < 10
                            ? "#f59e0b"
                            : "#10b981",
                      }}
                    >
                      {formData.password.length < 6
                        ? "Weak"
                        : formData.password.length < 10
                        ? "Medium"
                        : "Strong"}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Confirm Password<span className="required">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                />
                {errors.confirmPassword && (
                  <span className="error-message">⚠️ {errors.confirmPassword}</span>
                )}
                {!errors.confirmPassword &&
                  formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <span className="input-hint" style={{ color: "#10b981" }}>
                      ✓ Passwords match
                    </span>
                  )}
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="form-section">
            <h2 className="section-title">Role & Permissions</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  User Role<span className="required">*</span>
                </label>
                <select
                  name="login_role"
                  value={formData.login_role}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="ADMIN">Admin - Full System Access</option>
                  <option value="DATA_OPERATOR">Data Operator - Customer & File Management</option>
                  <option value="MARKETING_EXECUTIVE">Marketing Executive - Customer & Reports</option>
                  <option value="BANK_EXECUTIVE">Bank Executive - Document Verification</option>
                </select>
                <span className="input-hint">Select role based on user responsibilities</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Account Status<span className="required">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Active">Active - User can login</option>
                  <option value="Inactive">Inactive - User cannot login</option>
                </select>
                <span className="input-hint">Account can be activated/deactivated later</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating User..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateUser;
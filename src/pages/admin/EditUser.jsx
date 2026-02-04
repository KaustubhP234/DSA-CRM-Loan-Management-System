import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    username: "",
    login_role: "DATA_OPERATOR",
    status: "Active",
  });

  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  /* ---------------- LOAD USER DATA ---------------- */
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.id === parseInt(id));

    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        contact_number: user.contact_number,
        username: user.username,
        login_role: user.login_role,
        status: user.status,
      });
      setLoading(false);
    } else {
      setUserNotFound(true);
      setLoading(false);
    }
  }, [id]);

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

  /* ---------------- HANDLE PASSWORD CHANGE ---------------- */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
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

    // Check if email already exists (except current user)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(
      (u) => u.email === formData.email && u.id !== parseInt(id)
    );
    if (emailExists) {
      newErrors.email = "Email already exists";
    }

    // Contact number validation
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = "Contact number is required";
    } else if (!/^[+]?[0-9]{10,15}$/.test(formData.contact_number.replace(/\s/g, ""))) {
      newErrors.contact_number = "Invalid contact number (10-15 digits)";
    }

    // Password validation (if changing password)
    if (changePassword) {
      if (!passwordData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (passwordData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }

      if (!passwordData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
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
    const userIndex = users.findIndex((u) => u.id === parseInt(id));

    if (userIndex !== -1) {
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        contact_number: formData.contact_number.trim(),
        login_role: formData.login_role,
        status: formData.status,
      };

      // Update password if changing
      if (changePassword && passwordData.newPassword) {
        users[userIndex].password = passwordData.newPassword;
      }

      // Save updated users
      localStorage.setItem("users", JSON.stringify(users));

      // Show success message
      alert("User updated successfully!");

      // Redirect to users list
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/admin/users");
      }, 500);
    }
  };

  /* ---------------- HANDLE CANCEL ---------------- */
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      navigate("/admin/users");
    }
  };

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Loading user data...</h2>
      </div>
    );
  }

  /* ---------------- USER NOT FOUND ---------------- */
  if (userNotFound) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>User not found</h2>
        <p>The user you're trying to edit doesn't exist.</p>
        <button
          onClick={() => navigate("/admin/users")}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#004E89",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .edit-user-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          animation: fadeIn 0.5s ease-out;
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

        .page-header-edit {
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

        .user-id-badge {
          display: inline-block;
          background: rgba(0, 78, 137, 0.1);
          color: #004E89;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          margin-left: 0.5rem;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .warning-box {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .warning-box-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #92400e;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .warning-box-text {
          font-size: 0.8rem;
          color: #78350f;
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

        .form-input:disabled {
          background: #f8fafc;
          color: #94a3b8;
          cursor: not-allowed;
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

        .readonly-badge {
          display: inline-block;
          background: #f8fafc;
          color: #64748b;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .password-change-section {
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .password-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .toggle-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .toggle-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
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

      <div className="edit-user-container">
        {/* Header */}
        <div className="page-header-edit">
          <div className="header-top">
            <button className="back-btn" onClick={() => navigate("/admin/users")}>
              ←
            </button>
            <div>
              <h1 className="page-title">
                Edit User
                <span className="user-id-badge">ID: {id}</span>
              </h1>
              <p className="page-subtitle">Update user information and permissions</p>
            </div>
          </div>
        </div>

        {/* Warning Box */}
        <div className="warning-box">
          <div className="warning-box-title">
            <span>⚠️</span>
            <span>Important Notice</span>
          </div>
          <p className="warning-box-text">
            Username cannot be changed. Changing user role will affect their access permissions.
            Password change is optional - leave unchecked to keep existing password.
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
              </div>

              <div className="form-group">
                <label className="form-label">
                  Username
                  <span className="readonly-badge">READ-ONLY</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  disabled
                  className="form-input"
                />
                <span className="input-hint">Username cannot be changed</span>
              </div>
            </div>
          </div>

          {/* Password Change (Optional) */}
          <div className="form-section">
            <h2 className="section-title">Change Password (Optional)</h2>
            <div className="password-change-section">
              <div className="password-toggle">
                <input
                  type="checkbox"
                  id="changePassword"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  className="toggle-checkbox"
                />
                <label htmlFor="changePassword" className="toggle-label">
                  I want to change the password
                </label>
              </div>

              {changePassword && (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      New Password<span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className={`form-input ${errors.newPassword ? "error" : ""}`}
                    />
                    {errors.newPassword && (
                      <span className="error-message">⚠️ {errors.newPassword}</span>
                    )}
                    {!errors.newPassword && passwordData.newPassword && (
                      <div className="password-strength">
                        <div className="strength-bar">
                          <div
                            className="strength-fill"
                            style={{
                              width:
                                passwordData.newPassword.length < 6
                                  ? "33%"
                                  : passwordData.newPassword.length < 10
                                  ? "66%"
                                  : "100%",
                              background:
                                passwordData.newPassword.length < 6
                                  ? "#DC2626"
                                  : passwordData.newPassword.length < 10
                                  ? "#f59e0b"
                                  : "#10b981",
                            }}
                          />
                        </div>
                        <span
                          className="strength-text"
                          style={{
                            color:
                              passwordData.newPassword.length < 6
                                ? "#DC2626"
                                : passwordData.newPassword.length < 10
                                ? "#f59e0b"
                                : "#10b981",
                          }}
                        >
                          {passwordData.newPassword.length < 6
                            ? "Weak"
                            : passwordData.newPassword.length < 10
                            ? "Medium"
                            : "Strong"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Confirm New Password<span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Re-enter new password"
                      className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                    />
                    {errors.confirmPassword && (
                      <span className="error-message">⚠️ {errors.confirmPassword}</span>
                    )}
                    {!errors.confirmPassword &&
                      passwordData.confirmPassword &&
                      passwordData.newPassword === passwordData.confirmPassword && (
                        <span className="input-hint" style={{ color: "#10b981" }}>
                          ✓ Passwords match
                        </span>
                      )}
                  </div>
                </div>
              )}
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
                <span className="input-hint">Changes take effect on next login</span>
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
                <span className="input-hint">Inactive users cannot access the system</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Updating User..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUser;
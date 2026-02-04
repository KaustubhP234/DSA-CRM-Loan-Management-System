import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  /* ---------------- LOAD USER DATA ---------------- */
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((u) => u.id === parseInt(id));

    if (foundUser) {
      setUser(foundUser);
      setLoading(false);
    } else {
      setUserNotFound(true);
      setLoading(false);
    }
  }, [id]);

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Loading user details...</h2>
      </div>
    );
  }

  /* ---------------- USER NOT FOUND ---------------- */
  if (userNotFound) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>User not found</h2>
        <p>The user you're looking for doesn't exist.</p>
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .user-details-container {
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

        .page-header-details {
          margin-bottom: 1.5rem;
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .back-btn {
          padding: 0.5rem 0.75rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
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

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn {
          padding: 0.625rem 1.25rem;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-edit {
          background: #004E89;
          color: white;
          box-shadow: 0 2px 4px rgba(0, 78, 137, 0.2);
        }

        .btn-edit:hover {
          background: #003d6b;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 78, 137, 0.3);
        }

        .btn-delete {
          background: white;
          color: #dc2626;
          border: 2px solid #fecaca;
        }

        .btn-delete:hover {
          background: #fef2f2;
          border-color: #dc2626;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .info-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .card-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .info-row {
          display: flex;
          padding: 0.875rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          width: 140px;
          flex-shrink: 0;
        }

        .info-value {
          font-size: 0.875rem;
          color: #1e293b;
          font-weight: 500;
          flex: 1;
        }

        .info-value-mono {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.813rem;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .role-admin {
          background: #fee2e2;
          color: #991b1b;
        }

        .role-data-operator {
          background: #dbeafe;
          color: #1e40af;
        }

        .role-marketing-executive {
          background: #fef3c7;
          color: #92400e;
        }

        .role-bank-executive {
          background: #ede9fe;
          color: #5b21b6;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-inactive {
          background: #f1f5f9;
          color: #475569;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          padding: 1.25rem;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          font-family: 'JetBrains Mono', monospace;
        }

        .activity-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #64748b;
        }

        @media (max-width: 968px) {
          .details-grid {
            grid-template-columns: 1fr;
          }

          .header-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-actions {
            width: 100%;
          }

          .btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>

      <div className="user-details-container">
        {/* Header */}
        <div className="page-header-details">
          <div className="header-top">
            <div className="header-left">
              <button className="back-btn" onClick={() => navigate("/admin/users")}>
                ←
              </button>
              <div>
                <h1 className="page-title">
                  User Details
                  <span className="user-id-badge">ID: {user.id}</span>
                </h1>
                <p className="page-subtitle">View complete user information</p>
              </div>
            </div>

            <div className="header-actions">
              <button className="btn btn-edit" onClick={() => navigate(`/admin/edit-user/${user.id}`)}>
                <span>✏️</span>
                <span>Edit User</span>
              </button>
              <button
                className="btn btn-delete"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                    const users = JSON.parse(localStorage.getItem("users")) || [];
                    const updatedUsers = users.filter((u) => u.id !== user.id);
                    localStorage.setItem("users", JSON.stringify(updatedUsers));
                    alert("User deleted successfully!");
                    navigate("/admin/users");
                  }
                }}
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="details-grid">
          {/* Personal Information */}
          <div className="info-card">
            <h2 className="card-title">Personal Information</h2>

            <div className="info-row">
              <div className="info-label">Full Name</div>
              <div className="info-value">{user.name}</div>
            </div>

            <div className="info-row">
              <div className="info-label">Email Address</div>
              <div className="info-value">{user.email}</div>
            </div>

            <div className="info-row">
              <div className="info-label">Contact Number</div>
              <div className="info-value">{user.contact_number}</div>
            </div>

            <div className="info-row">
              <div className="info-label">Username</div>
              <div className="info-value info-value-mono">{user.username}</div>
            </div>

            <div className="info-row">
              <div className="info-label">Registered On</div>
              <div className="info-value">{user.date_of_registration}</div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <div className="info-card" style={{ marginBottom: "1.5rem" }}>
              <h2 className="card-title">Account Information</h2>

              <div className="info-row">
                <div className="info-label">User Role</div>
                <div className="info-value">
                  <span
                    className={`role-badge role-${user.login_role
                      .toLowerCase()
                      .replace(/_/g, "-")}`}
                  >
                    {user.login_role.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">Account Status</div>
                <div className="info-value">
                  <span className={`status-badge status-${user.status.toLowerCase()}`}>
                    <span>●</span>
                    <span>{user.status}</span>
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">User ID</div>
                <div className="info-value info-value-mono">#{user.id}</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="info-card">
              <h2 className="card-title">Quick Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Files</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Files</div>
                  <div className="stat-value">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-card">
          <h2 className="card-title">Recent Activity</h2>

          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <div className="activity-title">User account created</div>
              <div className="activity-time">{user.date_of_registration}</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <div className="activity-title">Account status set to {user.status}</div>
              <div className="activity-time">{user.date_of_registration}</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <div className="activity-title">Role assigned: {user.login_role.replace(/_/g, " ")}</div>
              <div className="activity-time">{user.date_of_registration}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;
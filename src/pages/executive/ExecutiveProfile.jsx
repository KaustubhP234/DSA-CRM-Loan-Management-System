import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ExecutiveProfile = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: loggedInUser.name || "",
    email: loggedInUser.email || "",
    phone: loggedInUser.contact_number || loggedInUser.phone || "",
    role: loggedInUser.login_role || loggedInUser.role || "Bank Executive",
  });

  const handleSave = () => {
    // Update user in localStorage
    const updatedUser = { ...loggedInUser, ...formData };
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    
    // Also update in users array
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = allUsers.map(user => 
      user.id === loggedInUser.id ? { ...user, ...formData } : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    alert("✅ Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .profile-container {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          padding: 2rem;
          background: #f1f5f9;
        }
        
        .page-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 2.5rem 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 1rem;
          transition: all 0.2s;
          border: none;
        }
        
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-3px);
        }
        
        .page-title {
          font-size: 2rem;
          font-weight: 900;
          color: white;
          margin: 0 0 0.5rem 0;
        }
        
        .page-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
        }
        
        .profile-card {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .avatar-section {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .avatar {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: white;
          font-weight: 700;
          margin: 0 auto 1rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s;
          background: #f8fafc;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .btn {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }
        
        .btn-secondary:hover {
          background: #f8fafc;
        }
      `}</style>

      <div className="profile-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate("/bank-executive")}>
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="page-title">👤 My Profile</h1>
          <p className="page-subtitle">View and manage your profile information</p>
        </div>

        <div className="profile-card">
          <div className="avatar-section">
            <div className="avatar">{formData.name.charAt(0).toUpperCase()}</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '0' }}>
              {formData.name}
            </h2>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <input
              type="text"
              className="form-input"
              value={formData.role}
              disabled
            />
          </div>

          <div className="actions">
            {!isEditing ? (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleSave}>
                  ✅ Save Changes
                </button>
                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExecutiveProfile;
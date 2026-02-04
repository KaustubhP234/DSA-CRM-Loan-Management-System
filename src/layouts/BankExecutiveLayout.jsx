import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const BankExecutiveLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const executiveName = loggedInUser.name || loggedInUser.email?.split("@")[0] || "Executive";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("role");
      localStorage.removeItem("loggedUser");
      navigate("/", { replace: true });
      window.location.href = "/";
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
        }

        .executive-layout {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
        }

        /* ========== SIDEBAR ========== */
        .executive-sidebar {
          width: 280px;
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 1000;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .executive-sidebar.mobile-closed {
          transform: translateX(-100%);
        }

        /* Sidebar Header */
        .sidebar-header {
          padding: 2rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }

        .logo-text h2 {
          font-size: 1.35rem;
          font-weight: 900;
          color: white;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .logo-text p {
          font-size: 0.8rem;
          color: #94a3b8;
          margin: 0.375rem 0 0 0;
          font-weight: 500;
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 0;
          overflow-y: auto;
          overflow-x: hidden;
        }

        /* Custom Scrollbar */
        .sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.3);
          border-radius: 10px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.5);
        }

        .nav-section {
          padding: 0 1.25rem;
          margin-bottom: 2rem;
        }

        .nav-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0 0.875rem;
          margin-bottom: 0.875rem;
          display: block;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.125rem;
          color: #cbd5e1;
          text-decoration: none;
          border-radius: 12px;
          margin-bottom: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          font-size: 0.95rem;
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #667eea, #764ba2);
          transform: scaleY(0);
          transition: transform 0.3s;
        }

        .nav-link:hover {
          background: rgba(102, 126, 234, 0.15);
          color: white;
          transform: translateX(4px);
        }

        .nav-link:hover::before {
          transform: scaleY(1);
        }

        .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 700;
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
          transform: translateX(0);
        }

        .nav-link.active::before {
          transform: scaleY(1);
        }

        .nav-icon {
          font-size: 1.35rem;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
          padding: 0.875rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: all 0.3s;
        }

        .user-profile:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1.25rem;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-info h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.25rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-info p {
          font-size: 0.8rem;
          color: #94a3b8;
          margin: 0;
          font-weight: 500;
        }

        .logout-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4);
        }

        .logout-btn:active {
          transform: translateY(0);
        }

        /* Main Content */
        .executive-main {
          flex: 1;
          margin-left: 280px;
          min-height: 100vh;
          transition: margin-left 0.3s;
        }

        /* Mobile Toggle Button */
        .mobile-toggle {
          display: none;
          position: fixed;
          top: 1.25rem;
          left: 1.25rem;
          z-index: 1001;
          padding: 0.875rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1.25rem;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          transition: all 0.3s;
        }

        .mobile-toggle:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
        }

        /* Mobile Overlay */
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 999;
          backdrop-filter: blur(4px);
        }

        /* Responsive */
        @media (max-width: 968px) {
          .executive-sidebar {
            transform: translateX(-100%);
          }

          .executive-sidebar.mobile-open {
            transform: translateX(0);
          }

          .executive-main {
            margin-left: 0;
          }

          .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .sidebar-overlay.active {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .executive-sidebar {
            width: 260px;
          }

          .sidebar-header {
            padding: 1.5rem 1.25rem;
          }

          .logo-icon {
            width: 44px;
            height: 44px;
            font-size: 1.5rem;
          }

          .logo-text h2 {
            font-size: 1.15rem;
          }

          .nav-section {
            padding: 0 1rem;
          }
        }
      `}</style>

      <div className="executive-layout">
        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>

        {/* Sidebar Overlay (Mobile) */}
        <div
          className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`executive-sidebar ${isSidebarOpen ? "mobile-open" : "mobile-closed"}`}>
          {/* Header */}
          <div className="sidebar-header">
            <div className="logo-section">
              <div className="logo-icon">🏦</div>
              <div className="logo-text">
                <h2>DSA CRM</h2>
                <p>Executive Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <div className="nav-section">
              <div className="nav-label">Main Menu</div>
              <NavLink 
                to="/bank-executive" 
                end 
                className="nav-link"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="nav-icon">📊</span>
                <span>Dashboard</span>
              </NavLink>
              <NavLink 
                to="/bank-executive/my-files" 
                className="nav-link"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="nav-icon">📋</span>
                <span>My Files</span>
              </NavLink>
            </div>

            <div className="nav-section">
              <div className="nav-label">Actions</div>
              <NavLink 
                to="/bank-executive/update-status" 
                className="nav-link"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="nav-icon">🔄</span>
                <span>Update Status</span>
              </NavLink>
              <NavLink 
                to="/bank-executive/verify-documents" 
                className="nav-link"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="nav-icon">✅</span>
                <span>Verify Documents</span>
              </NavLink>
              <NavLink 
                to="/bank-executive/documents" 
                className="nav-link"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="nav-icon">📄</span>
                <span>Documents</span>
              </NavLink>
            </div>

            <div className="nav-section">
              <div className="nav-label">Account</div>
              <NavLink 
                to="/bank-executive/profile" 
                className="nav-link"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="nav-icon">👤</span>
                <span>My Profile</span>
              </NavLink>
            </div>
          </nav>

          {/* Footer */}
          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="user-avatar">
                {executiveName.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h4>{executiveName}</h4>
                <p>Bank Executive</p>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="executive-main">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default BankExecutiveLayout;
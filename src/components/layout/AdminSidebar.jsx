import { NavLink } from "react-router-dom";
import { useState } from "react";

const AdminSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Mobile Header (Hamburger Menu) */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #1a1d29;
          border-bottom: 1px solid #2d3142;
          z-index: 1001;
          padding: 0 1rem;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: white;
        }

        .mobile-logo-text {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
        }

        .hamburger-btn {
          width: 40px;
          height: 40px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          padding: 0;
        }

        .hamburger-line {
          width: 24px;
          height: 2px;
          background: #e4e7eb;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger-btn.open .hamburger-line:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger-btn.open .hamburger-line:nth-child(2) {
          opacity: 0;
        }

        .hamburger-btn.open .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        /* Overlay */
        .mobile-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .mobile-overlay.active {
          display: block;
          opacity: 1;
        }

        /* Sidebar */
        .admin-sidebar {
          width: 260px;
          background: #1a1d29;
          color: #e4e7eb;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          border-right: 1px solid #2d3142;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        /* Logo Section */
        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #2d3142;
          flex-shrink: 0;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: white;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .logo-subtitle {
          font-size: 11px;
          font-weight: 500;
          color: #7c8db0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 4px;
        }

        /* Navigation */
        .sidebar-nav-wrapper {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px 12px;
        }

        .sidebar-nav-wrapper::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-nav-wrapper::-webkit-scrollbar-thumb {
          background: #2d3142;
          border-radius: 2px;
        }

        .sidebar-nav-wrapper::-webkit-scrollbar-thumb:hover {
          background: #3d4152;
        }

        .nav-section {
          margin-bottom: 24px;
        }

        .nav-section-label {
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 600;
          color: #7c8db0;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: #9ca3af;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
        }

        .sidebar-link:hover {
          background: #252936;
          color: #e4e7eb;
        }

        .sidebar-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .link-icon {
          font-size: 18px;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.9;
        }

        .sidebar-link.active .link-icon {
          opacity: 1;
        }

        .link-text {
          flex: 1;
          white-space: nowrap;
        }

        .link-badge {
          background: #10b981;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Footer */
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid #2d3142;
          flex-shrink: 0;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #252936;
          border-radius: 10px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .user-profile:hover {
          background: #2d3142;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 12px;
          color: #7c8db0;
          line-height: 1.2;
          margin-top: 2px;
        }

        .user-menu-icon {
          font-size: 18px;
          color: #7c8db0;
          flex-shrink: 0;
        }

        /* Tablet Responsive (Collapsed Sidebar) */
        @media (max-width: 1024px) and (min-width: 769px) {
          .admin-sidebar {
            width: 72px;
          }

          .sidebar-header {
            padding: 20px 16px;
          }

          .logo-text,
          .link-text,
          .link-badge,
          .nav-section-label,
          .user-info,
          .user-menu-icon {
            display: none;
          }

          .logo-container {
            justify-content: center;
          }

          .sidebar-link {
            justify-content: center;
            padding: 12px;
          }

          .link-icon {
            font-size: 20px;
          }

          .user-profile {
            justify-content: center;
            padding: 12px;
          }
        }

        /* Mobile Responsive (Slide-out Menu) */
        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
          }

          .admin-sidebar {
            transform: translateX(-100%);
            width: 280px;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          }

          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }

          .sidebar-header {
            padding-top: 20px;
          }

          /* Add padding to body content when mobile menu exists */
          body {
            padding-top: 60px;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .admin-sidebar {
            width: 85vw;
            max-width: 300px;
          }

          .mobile-logo-text {
            font-size: 14px;
          }

          .sidebar-header {
            padding: 16px;
          }
        }

        /* Prevent body scroll when mobile menu is open */
        body.mobile-menu-open {
          overflow: hidden;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-logo">
          <div className="mobile-logo-icon">DC</div>
          <div className="mobile-logo-text">DSA CRM</div>
        </div>
        <button
          className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">DC</div>
            <div className="logo-text">
              <div className="logo-title">DSA CRM</div>
              <div className="logo-subtitle">Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav-wrapper">
          {/* Main Menu Section */}
          <div className="nav-section">
            <div className="nav-section-label">Main Menu</div>
            <div className="nav-links">
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="link-icon">🏠︎</span>
                <span className="link-text">Dashboard</span>
              </NavLink>

              <NavLink 
                to="/admin/loan-files" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="link-icon">🗁</span>
                <span className="link-text">Loan Files</span>
              </NavLink>

              <NavLink 
                to="/admin/create-loan" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="link-icon">📝</span>
                <span className="link-text">Create Loan</span>
                <span className="link-badge">New</span>
              </NavLink>
            </div>
          </div>

          {/* Management Section */}
          <div className="nav-section">
            <div className="nav-section-label">Management</div>
            <div className="nav-links">
              <NavLink 
                to="/admin/users" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="link-icon">🙋🏻</span>
                <span className="link-text">Users</span>
              </NavLink>

              <NavLink 
                to="/admin/customers" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="link-icon">👨🏻‍💼</span>
                <span className="link-text">Customers</span>
              </NavLink>

              <NavLink 
                to="/admin/banks" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="link-icon">🏦</span>
                <span className="link-text">Banks</span>
              </NavLink>

              <NavLink 
                to="/admin/documents" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="link-icon">🗂️</span>
                <span className="link-text">Documents</span>
              </NavLink>

              <NavLink 
                to="/admin/commission" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="link-icon">💼</span>
                <span className="link-text">Commission</span>
              </NavLink>

              <NavLink 
                to="/admin/executive-assignment" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="link-icon">👤</span>
                <span className="link-text">Executive Assignment</span>
              </NavLink>

              <NavLink 
                to="/admin/reports" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="link-icon">📑</span>
                <span className="link-text">Reports</span>
              </NavLink>

              <NavLink 
                to="/admin/status" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="link-icon">📊</span>
                <span className="link-text">Status</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">Administrator</div>
            </div>
            <div className="user-menu-icon">⚙️</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
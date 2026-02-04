import { Outlet, useNavigate, NavLink } from "react-router-dom";

const MarketingLayout = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const marketingName = loggedInUser.name || loggedInUser.email?.split("@")[0] || "Marketing Executive";

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap');
        
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .marketing-layout {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
        }
        
        /* ========== SIDEBAR ========== */
        .marketing-sidebar {
          width: 260px;
          background: #1e293b;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        
        .sidebar-brand {
          padding: 1.5rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .brand-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        
        .brand-text h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: white;
          margin: 0;
        }
        
        .brand-text p {
          font-size: 0.7rem;
          color: #94a3b8;
          margin: 0.15rem 0 0 0;
        }
        
        .sidebar-menu {
          flex: 1;
          padding: 1rem 0.75rem;
          overflow-y: auto;
        }
        
        .menu-section {
          margin-bottom: 1.5rem;
        }
        
        .menu-heading {
          font-size: 0.65rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0 0.75rem;
          margin-bottom: 0.5rem;
        }
        
        .menu-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.875rem;
          color: #94a3b8;
          text-decoration: none;
          border-radius: 8px;
          margin-bottom: 0.25rem;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .menu-link:hover {
          background: rgba(16, 185, 129, 0.15);
          color: #e2e8f0;
        }
        
        .menu-link.active {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-weight: 600;
        }
        
        .menu-link-icon {
          font-size: 1.15rem;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }
        
        .sidebar-user {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .user-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin-bottom: 0.75rem;
        }
        
        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        
        .user-details {
          flex: 1;
          min-width: 0;
        }
        
        .user-name {
          font-size: 0.825rem;
          font-weight: 700;
          color: white;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .user-role {
          font-size: 0.7rem;
          color: #94a3b8;
          margin: 0.15rem 0 0 0;
        }
        
        .btn-logout {
          width: 100%;
          padding: 0.625rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.825rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .btn-logout:hover {
          background: #b91c1c;
        }
        
        /* ========== MAIN CONTENT ========== */
        .marketing-content {
          flex: 1;
          margin-left: 260px;
        }
        
        /* ========== RESPONSIVE ========== */
        @media (max-width: 768px) {
          .marketing-sidebar {
            transform: translateX(-100%);
          }
          
          .marketing-content {
            margin-left: 0;
          }
        }
      `}</style>

      <div className="marketing-layout">
        {/* ========== SIDEBAR ========== */}
        <aside className="marketing-sidebar">
          {/* Brand */}
          <div className="sidebar-brand">
            <div className="brand-content">
              <div className="brand-icon">📊</div>
              <div className="brand-text">
                <h3>DSA CRM</h3>
                <p>Marketing Portal</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="sidebar-menu">
            <div className="menu-section">
              <div className="menu-heading">Main Menu</div>
              <NavLink to="/marketing" end className="menu-link">
                <span className="menu-link-icon">📊</span>
                <span>Dashboard</span>
              </NavLink>
            </div>

            <div className="menu-section">
              <div className="menu-heading">Leads</div>
              <NavLink to="/marketing/customers" className="menu-link">
                <span className="menu-link-icon">👥</span>
                <span>All Leads</span>
              </NavLink>
              <NavLink to="/marketing/converted" className="menu-link">
                <span className="menu-link-icon">✅</span>
                <span>Converted Leads</span>
              </NavLink>
            </div>

            <div className="menu-section">
              <div className="menu-heading">Analytics</div>
              <NavLink to="/marketing/reports" className="menu-link">
                <span className="menu-link-icon">📈</span>
                <span>Reports</span>
              </NavLink>
              <NavLink to="/marketing/performance" className="menu-link">
                <span className="menu-link-icon">🏆</span>
                <span>Performance</span>
              </NavLink>
            </div>
          </nav>

          {/* User */}
          <div className="sidebar-user">
            <div className="user-card">
              <div className="user-avatar">{marketingName.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <p className="user-name">{marketingName}</p>
                <p className="user-role">Marketing Executive</p>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ========== MAIN CONTENT (Child Routes) ========== */}
        <div className="marketing-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MarketingLayout;
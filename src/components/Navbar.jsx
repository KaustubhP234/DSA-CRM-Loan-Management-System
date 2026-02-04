import { NavLink, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loansOpen, setLoansOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setLoansOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // If logged in, hide navbar only on internal protected routes
  const protectedPrefixes = ["/admin", "/operator", "/bank", "/marketing"];
  const isProtectedRoute = protectedPrefixes.some((p) =>
    location.pathname.startsWith(p)
  );
  if (role && isProtectedRoute) return null;

  return (
    <>
      <header className={`lp-header ${scrolled ? "scrolled" : ""}`}>
        {/* TOP ROW */}
        <div className="lp-top">
          <Link to="/" className="lp-logo">
            <span className="logo-box">DS</span>
            <span className="logo-text">DSA CRM</span>
          </Link>

          <div className="lp-top-right">
            <a href="tel:+918121666902" className="contact contact-phone">
              <span className="contact-icon">📞</span>
              <span className="contact-text">+91 81216 66902</span>
            </a>
            <a
              href="mailto:info@finfreeenterprises.com"
              className="contact contact-email"
            >
              <span className="contact-icon">✉</span>
              <span className="contact-text">info@finfreeenterprises.com</span>
            </a>

            <Link to="/login" className="btn yellow">
              CRM Login
            </Link>

            <Link to="/loan-application" className="btn yellow btn-primary">
              Loan Application
            </Link>

            {/* Hamburger */}
            <button
              className={`hamburger ${menuOpen ? "is-active" : ""}`}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((s) => !s);
                if (menuOpen) setLoansOpen(false);
              }}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className={`lp-nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            About Us
          </NavLink>

          <div className="dropdown">
            <button
              className="dropdown-title"
              aria-expanded={loansOpen}
              onClick={() => setLoansOpen((s) => !s)}
            >
              Loans <span className={`arrow ${loansOpen ? "open" : ""}`}>▼</span>
            </button>

            <div
              className="dropdown-menu"
              data-open={loansOpen ? "true" : "false"}
            >
              <NavLink to="/loan-application">Personal Loans</NavLink>
              <NavLink to="/balance-transfer">
                Personal Loans - Balance Transfer
              </NavLink>
              <NavLink to="/loan-application">Home Loans</NavLink>
              <NavLink to="/loan-application">Education Loans</NavLink>
              <NavLink to="/loan-application">Vehicle Loans</NavLink>
              <NavLink to="/loan-application">Business Loans</NavLink>
              <NavLink to="/loan-application">Mortgage Loans</NavLink>
              <NavLink to="/medical-loan">Medical Loans</NavLink>
            </div>
          </div>

          <NavLink
            to="/how-it-works"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            How it Works
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            Contact Us
          </NavLink>

          <NavLink
            to="/customer-registration"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            Register Now
          </NavLink>

          {/* Mobile-only buttons */}
          <div className="mobile-nav-buttons">
            <Link to="/login" className="btn yellow mobile-btn">
              CRM Login
            </Link>
            <Link to="/loan-application" className="btn yellow btn-primary mobile-btn">
              Apply for Loan
            </Link>
          </div>
        </nav>
      </header>

      {/* Overlay for mobile menu */}
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}

      <style>{`
        /* ================= RESET ================= */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* ================= PUBLIC WEBSITE HEADER ================= */
        .lp-header {
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          background: rgba(11, 15, 20, 0.85);
          backdrop-filter: blur(12px);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .lp-header.scrolled {
          background: rgba(11, 15, 20, 0.85);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        /* ===== TOP ROW ===== */
        .lp-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 55px;
          position: relative;
        }

        /* LOGO */
        .lp-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        .lp-logo:hover {
          transform: scale(1.05);
        }

        .logo-box {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: black;
          font-weight: 700;
          padding: 10px 12px;
          border-radius: 6px;
          box-shadow: 0 4px 10px rgba(251, 191, 36, 0.3);
        }

        .logo-text {
          font-size: 22px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        /* TOP RIGHT */
        .lp-top-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .contact {
          color: #d1d5db;
          font-size: 14px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.3s ease;
          padding: 6px 10px;
          border-radius: 6px;
        }

        .contact:hover {
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.1);
        }

        .contact-icon {
          font-size: 16px;
        }

        /* BUTTONS */
        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .btn.yellow {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: black;
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
        }

        .btn.yellow:hover {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 6px 20px rgba(251, 191, 36, 0.5);
          transform: translateY(-2px);
        }

        .btn.yellow:active {
          transform: translateY(0);
        }

        .btn-primary {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
          }
          50% {
            box-shadow: 0 4px 16px rgba(251, 191, 36, 0.6);
          }
        }

        /* HAMBURGER */
        .hamburger {
          display: none;
          background: transparent;
          border: 0;
          width: 44px;
          height: 44px;
          padding: 8px;
          position: relative;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .hamburger:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .hamburger span {
          position: absolute;
          left: 50%;
          display: block;
          width: 24px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transform-origin: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hamburger span:nth-child(1) {
          top: 12px;
          transform: translateX(-50%);
        }
        .hamburger span:nth-child(2) {
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .hamburger span:nth-child(3) {
          bottom: 12px;
          transform: translateX(-50%);
        }

        .hamburger.is-active span:nth-child(1) {
          top: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .hamburger.is-active span:nth-child(2) {
          opacity: 0;
          transform: translateX(-50%) scaleX(0);
        }
        .hamburger.is-active span:nth-child(3) {
          bottom: 50%;
          transform: translate(-50%, 50%) rotate(-45deg);
        }

        /* ===== NAV LINKS ===== */
        .lp-nav-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
          padding: 14px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .nav-item,
        .dropdown-title {
          color: #e5e7eb;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .nav-item:hover,
        .dropdown-title:hover {
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.1);
        }

        .nav-item.active {
          color: #fbbf24;
          font-weight: 600;
        }

        .nav-item::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 0;
          height: 2px;
          background: #fbbf24;
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }

        .nav-item.active::after,
        .nav-item:hover::after {
          width: 80%;
        }

        /* DROPDOWN */
        .dropdown {
          position: relative;
        }

        .dropdown-title {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .arrow {
          font-size: 10px;
          transition: transform 0.3s ease;
          display: inline-block;
        }

        .arrow.open {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(17, 24, 39, 0.98);
          backdrop-filter: blur(10px);
          min-width: 260px;
          border-radius: 12px;
          display: none;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px;
          opacity: 0;
          animation: fadeIn 0.3s ease forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        .dropdown-menu a {
          color: #d1d5db;
          padding: 12px 16px;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .dropdown-menu a:hover {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          transform: translateX(4px);
        }

        .dropdown:hover .dropdown-menu,
        .dropdown-menu[data-open="true"] {
          display: flex;
        }

        /* Mobile nav buttons - hidden on desktop */
        .mobile-nav-buttons {
          display: none;
        }

        /* Nav overlay for mobile */
        .nav-overlay {
          display: none;
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 1200px) {
          .lp-top {
            padding: 12px 32px;
          }

          .lp-nav-links {
            gap: 20px;
          }
        }

        @media (max-width: 992px) {
          .lp-top {
            padding: 10px 24px;
          }

          .contact-text {
            display: none;
          }

          .contact {
            padding: 8px;
          }

          .lp-nav-links {
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }

          .contact {
            display: none;
          }

          .btn {
            padding: 8px 14px;
            font-size: 13px;
          }

          .lp-nav-links {
            position: fixed;
            top: 73px;
            left: 0;
            right: 0;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            padding: 20px;
            background: rgba(17, 24, 39, 0.98);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .lp-nav-links.open {
            max-height: calc(100vh - 73px);
            opacity: 1;
            overflow-y: auto;
          }

          .nav-item,
          .dropdown-title {
            width: 100%;
            justify-content: space-between;
            padding: 14px 16px;
            font-size: 16px;
            border-radius: 10px;
          }

          .nav-item::after {
            display: none;
          }

          .dropdown-menu {
            position: static;
            transform: none;
            min-width: auto;
            width: 100%;
            margin-top: 8px;
            padding: 8px 0 8px 20px;
            background: rgba(0, 0, 0, 0.3);
            box-shadow: none;
            border: none;
            border-left: 2px solid #fbbf24;
          }

          .dropdown-menu a {
            padding: 10px 16px;
          }

          .dropdown-menu a:hover {
            transform: translateX(2px);
          }

          .mobile-nav-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .mobile-btn {
            width: 100%;
            text-align: center;
            padding: 14px 20px;
            font-size: 16px;
          }

          .nav-overlay {
            display: block;
            position: fixed;
            top: 73px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 999;
            animation: fadeIn 0.3s ease;
          }
        }

        @media (max-width: 480px) {
          .lp-top {
            padding: 10px 16px;
          }

          .logo-text {
            font-size: 18px;
          }

          .logo-box {
            padding: 8px 10px;
          }

          .lp-top-right .btn:not(.mobile-btn) {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
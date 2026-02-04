import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const styles = {
    footer: {
      background: 'linear-gradient(135deg, #0f2a44 0%, #1a365d 100%)',
      color: 'white',
      padding: '4rem 2rem 0',
      position: 'relative',
      overflow: 'hidden',
    },
    footerPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.03,
      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
      backgroundSize: '30px 30px',
    },
    footerContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '3rem',
      marginBottom: '3rem',
    },
    footerColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    footerTitle: {
      fontSize: '1.3rem',
      fontWeight: '800',
      marginBottom: '1rem',
      color: 'white',
      letterSpacing: '-0.5px',
    },
    footerDescription: {
      fontSize: '1rem',
      lineHeight: '1.7',
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '1rem',
    },
    viewMoreBtn: {
      display: 'inline-block',
      padding: '0.7rem 1.8rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '50px',
      fontSize: '0.95rem',
      fontWeight: '700',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      width: 'fit-content',
      marginTop: '0.5rem',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
    footerLinks: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
    },
    footerLink: {
      color: 'rgba(255, 255, 255, 0.8)',
      textDecoration: 'none',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontWeight: '500',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.8rem 0',
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1rem',
    },
    contactIcon: {
      minWidth: '45px',
      height: '45px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      fontSize: '1.2rem',
      color: '#667eea',
    },
    socialIcons: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1.5rem',
    },
    socialIcon: {
      width: '45px',
      height: '45px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '1.1rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    complaintsSection: {
      padding: '2rem',
      background: 'rgba(102, 126, 234, 0.1)',
      borderRadius: '16px',
      marginBottom: '3rem',
      border: '1px solid rgba(102, 126, 234, 0.2)',
    },
    complaintsTitle: {
      fontSize: '1.15rem',
      fontWeight: '700',
      marginBottom: '1rem',
      color: 'white',
    },
    complaintsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
    },
    complaintItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      fontSize: '0.95rem',
      color: 'rgba(255, 255, 255, 0.9)',
    },
    footerBottom: {
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    copyright: {
      fontSize: '0.95rem',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    bottomLinks: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap',
    },
    bottomLink: {
      color: 'rgba(255, 255, 255, 0.7)',
      textDecoration: 'none',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.footerPattern}></div>
      
      <div style={styles.footerContainer}>
        {/* Main Footer Grid */}
        <div style={styles.footerGrid}>
          {/* About Us */}
          <div style={styles.footerColumn}>
            <h4 style={styles.footerTitle}>About Us</h4>
            <p style={styles.footerDescription}>
              Established in 2010, DSA CRN System is a professional loan
              management and CRM platform connecting customers with banks
              and NBFCs across India at competitive interest rates.
            </p>
            <NavLink to="/about" style={{textDecoration: 'none'}}>
              <button 
                style={styles.viewMoreBtn}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                }}
              >
                Learn More →
              </button>
            </NavLink>
          </div>

          {/* Quick Links */}
          <div style={styles.footerColumn}>
            <h4 style={styles.footerTitle}>Quick Links</h4>
            <ul style={styles.footerLinks}>
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/howitworks", label: "How It Works" },
                { to: "/blog", label: "Blog" },
                { to: "/careers", label: "Careers" },
                { to: "/contact", label: "Contact Us" },
              ].map((link, idx) => (
                <li key={idx}>
                  <NavLink 
                    to={link.to} 
                    style={styles.footerLink}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#667eea';
                      e.target.style.paddingLeft = '8px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                      e.target.style.paddingLeft = '0';
                    }}
                  >
                    <span>→</span> {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Loans We Offer */}
          <div style={styles.footerColumn}>
            <h4 style={styles.footerTitle}>Loans We Offer</h4>
            <ul style={styles.footerLinks}>
              {[
                "Personal Loans",
                "Business Loans",
                "Home Loans",
                "Mortgage Loans",
                "Education Loans",
                "Doctor Loans",
              ].map((loan, idx) => (
                <li key={idx}>
                  <span 
                    style={styles.footerLink}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#667eea';
                      e.target.style.paddingLeft = '8px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                      e.target.style.paddingLeft = '0';
                    }}
                  >
                    <span>✓</span> {loan}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div style={styles.footerColumn}>
            <h4 style={styles.footerTitle}>Contact Info</h4>
            
            <div style={styles.contactItem}>
              <div style={styles.contactIcon}>
                <FaMapMarkerAlt />
              </div>
              <div>
                <div style={{fontWeight: '600'}}>Nashik,Maharashtra</div>
                <div style={{fontSize: '0.9rem', opacity: 0.8}}>India</div>
              </div>
            </div>

            <div style={styles.contactItem}>
              <div style={styles.contactIcon}>
                <FaPhone />
              </div>
              <div>
                <div style={{fontWeight: '600'}}>+91 9607249676</div>
                <div style={{fontSize: '0.9rem', opacity: 0.8}}>Mon-Sat, 9AM-6PM</div>
              </div>
            </div>

            <div style={styles.contactItem}>
              <div style={styles.contactIcon}>
                <FaEnvelope />
              </div>
              <div>
                <div style={{fontWeight: '600'}}>kaustubhpawar2021@gmail.com</div>
                <div style={{fontSize: '0.9rem', opacity: 0.8}}>Get Support</div>
              </div>
            </div>

            <div style={styles.socialIcons}>
              {[
                { icon: <FaFacebookF />, color: '#1877f2' },
                { icon: <FaTwitter />, color: '#1da1f2' },
                { icon: <FaLinkedinIn />, color: '#0077b5' },
                { icon: <FaInstagram />, color: '#e4405f' },
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  style={styles.socialIcon}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = social.color;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Complaints Section */}
        <div style={styles.complaintsSection}>
          <h4 style={styles.complaintsTitle}>📢 For Complaints & Support</h4>
          <div style={styles.complaintsGrid}>
            <div style={styles.complaintItem}>
              <FaPhone style={{color: '#667eea'}} />
              <div>
                <div style={{fontWeight: '600', marginBottom: '0.2rem'}}>Call Us</div>
                <div>+91 9607249676</div>
              </div>
            </div>
            <div style={styles.complaintItem}>
              <FaEnvelope style={{color: '#667eea'}} />
              <div>
                <div style={{fontWeight: '600', marginBottom: '0.2rem'}}>Email Us</div>
                <div>kaustubhpawar2021@gmail.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={styles.footerBottom}>
          <div style={styles.copyright}>
            © 2025 DSA CRM Application. All Rights Reserved.
          </div>
          <div style={styles.bottomLinks}>
            <NavLink 
              to="/privacy-policy" 
              style={styles.bottomLink}
              onMouseEnter={(e) => e.target.style.color = '#667eea'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Privacy Policy
            </NavLink>
            <NavLink 
              to="/terms-of-use" 
              style={styles.bottomLink}
              onMouseEnter={(e) => e.target.style.color = '#667eea'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Terms of Use
            </NavLink>
            <NavLink 
              to="/disclaimer" 
              style={styles.bottomLink}
              onMouseEnter={(e) => e.target.style.color = '#667eea'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Disclaimer
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
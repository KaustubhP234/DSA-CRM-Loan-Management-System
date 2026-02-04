import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import whoweare from "../assets/whoweare.jpg";
import icici from "../assets/icicibank.png";
import axis from "../assets/axisbank.jpg";
import sbi from "../assets/sbi.png";
import hsbc from "../assets/hsbc.png";
import union from "../assets/unionbank.png";
import yes from "../assets/yesbank.png";
import canara from "../assets/canarabank.jpg";
import Central from "../assets/centralbank.png";

const About = () => {
  const bankLogos = [icici, axis, sbi, hsbc, union, yes, canara, Central];

  const styles = {
    // ==================== PAGE WRAPPER ====================
    aboutPage: {
      width: '100%',
      overflow: 'hidden',
    },

    // ==================== HEADER ====================
    aboutHeader: {
      padding: '12rem 2rem 5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
    },
    headerH1: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '900',
      marginBottom: '1.5rem',
      textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
    },
    headerP: {
      fontSize: 'clamp(1rem, 2vw, 1.3rem)',
      maxWidth: '900px',
      margin: '0 auto',
      lineHeight: '1.8',
      opacity: '0.95',
    },

    // ==================== WHO WE ARE HEADING ====================
    whoHeading: {
      textAlign: 'center',
      padding: '5rem 2rem 3rem',
      background: 'white',
    },
    whoHeadingSpan: {
      display: 'inline-block',
      padding: '0.5rem 1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '50px',
      fontSize: '0.9rem',
      fontWeight: '700',
      marginBottom: '1rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    whoHeadingH2: {
      fontSize: 'clamp(2rem, 4vw, 2.8rem)',
      fontWeight: '900',
      color: '#1a202c',
      marginBottom: '1rem',
    },
    whoHeadingP: {
      fontSize: '1.1rem',
      color: '#4a5568',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.8',
    },

    // ==================== WHO WE ARE SECTION ====================
    whoWeAre: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '4rem',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '3rem 2rem 5rem',
      alignItems: 'center',
      background: 'white',
    },
    whoImage: {
      position: 'relative',
    },
    imageFrame: {
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
      border: '10px solid white',
      transform: 'rotate(-2deg)',
      transition: 'all 0.3s ease',
    },
    whoImageTag: {
      width: '100%',
      height: 'auto',
      display: 'block',
    },
    whoContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    whoContentP: {
      fontSize: '1.1rem',
      color: '#2d3748',
      lineHeight: '1.8',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      borderLeft: '5px solid #667eea',
      transition: 'all 0.3s ease',
    },

    // ==================== CONTENT CARDS ====================
    aboutContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    aboutCard: {
      background: 'white',
      padding: '2.5rem',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
    },
    aboutCardH3: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '3px solid #667eea',
      display: 'inline-block',
    },
    aboutCardP: {
      fontSize: '1rem',
      color: '#4a5568',
      lineHeight: '1.8',
    },
    aboutCardUl: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    aboutCardLi: {
      fontSize: '1rem',
      color: '#2d3748',
      padding: '0.8rem 0',
      paddingLeft: '1.5rem',
      position: 'relative',
      lineHeight: '1.6',
    },

    // ==================== WHY CHOOSE US ====================
    whyChoose: {
      padding: '5rem 2rem',
      background: 'white',
      textAlign: 'center',
    },
    whyChooseSpan: {
      display: 'inline-block',
      padding: '0.5rem 1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '50px',
      fontSize: '0.9rem',
      fontWeight: '700',
      marginBottom: '1rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    whySummary: {
      fontSize: '1.1rem',
      color: '#4a5568',
      maxWidth: '900px',
      margin: '1rem auto 4rem',
      lineHeight: '1.8',
    },
    whyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    whyBox: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2.5rem',
      borderRadius: '20px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
      cursor: 'pointer',
    },
    whyBoxSpan: {
      fontSize: '3.5rem',
      display: 'block',
      marginBottom: '1rem',
      filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))',
    },
    whyBoxH4: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '1rem',
    },
    whyBoxP: {
      fontSize: '1rem',
      color: '#4a5568',
      lineHeight: '1.6',
    },

    // ==================== PARTNERS ====================
    partnersSection: {
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      overflow: 'hidden',
    },
    sectionTag: {
      display: 'inline-block',
      padding: '0.5rem 1.5rem',
      background: 'rgba(255,255,255,0.2)',
      color: 'white',
      borderRadius: '50px',
      fontSize: '0.9rem',
      fontWeight: '700',
      marginBottom: '1rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      backdropFilter: 'blur(10px)',
    },
    partnersH2: {
      fontSize: 'clamp(2rem, 4vw, 2.8rem)',
      fontWeight: '900',
      marginBottom: '3rem',
    },
    partnersSlider: {
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      marginTop: '3rem',
    },
    partnersTrack: {
      display: 'flex',
      gap: '3rem',
      animation: 'scroll 30s linear infinite',
    },
    partnerImg: {
      height: '80px',
      width: 'auto',
      objectFit: 'contain',
      opacity: '0.8',
      transition: 'all 0.3s ease',
    },
  };

  const styleSheet = `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    
    @media (max-width: 768px) {
      .who-we-are, .about-content, .why-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  return (
    <>
      <style>{styleSheet}</style>
      <Navbar />

      <div style={styles.aboutPage}>
        {/* ==================== HEADER ==================== */}
        <section style={styles.aboutHeader}>
          <h1 style={styles.headerH1}>About Us</h1>
          <p style={styles.headerP}>
            We are a trusted loan facilitation and financial services provider
            committed to helping individuals and businesses access fast,
            transparent, and reliable loan solutions across India.
          </p>
        </section>

        {/* ==================== WHO WE ARE HEADING ==================== */}
        <div style={styles.whoHeading}>
          <span style={styles.whoHeadingSpan}>Who We Are</span>
          <h2 style={styles.whoHeadingH2}>About Us</h2>
          <p style={styles.whoHeadingP}>
            Trusted Providers of Quick and Hassle-Free Loan Solutions, dedicated to simplifying
            the borrowing process through expert guidance
          </p>
        </div>

        {/* ==================== WHO WE ARE CONTENT ==================== */}
        <section style={styles.whoWeAre} className="who-we-are">
          <div style={styles.whoImage}>
            <div 
              style={styles.imageFrame}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 25px 70px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(-2deg) scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.3)';
              }}
            >
              <img src={whoweare} style={styles.whoImageTag} alt="Who We Are" />
            </div>
          </div>

          <div style={styles.whoContent}>
            {[
              "Finfree Enterprises is a renowned financial advisory firm based in Hyderabad, Telangana, established in 2010. We specialize in providing end-to-end loan assistance to customers across India.",
              "Our mission is to simplify the loan process by offering expert guidance, quick eligibility checks, and customized loan options with competitive interest rates.",
              "We collaborate with leading banks such as ICICI Bank, HDFC Bank, Axis Bank, and reputed NBFCs to ensure our customers receive the most suitable financial solutions with complete transparency and trust."
            ].map((text, idx) => (
              <p 
                key={idx}
                style={styles.whoContentP}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(10px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </section>

        {/* ==================== CONTENT CARDS ==================== */}
        <section style={styles.aboutContent} className="about-content">
          {/* Card 1 */}
          <div 
            style={styles.aboutCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <h3 style={styles.aboutCardH3}>What We Do</h3>
            <p style={styles.aboutCardP}>
              We assist individuals and businesses in securing the right loan by
              evaluating their financial profile, coordinating with banks, and
              ensuring smooth processing from application to disbursement.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            style={styles.aboutCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <h3 style={styles.aboutCardH3}>Our Loan Services</h3>
            <ul style={styles.aboutCardUl}>
              {['Home Loans', 'Personal Loans', 'Business & MSME Loans', 'Vehicle Loans', 'Education Loans', 'Loan Against Property'].map((item, idx) => (
                <li 
                  key={idx}
                  style={styles.aboutCardLi}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.paddingLeft = '2rem';
                    e.currentTarget.style.color = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.paddingLeft = '1.5rem';
                    e.currentTarget.style.color = '#2d3748';
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#667eea',
                    fontWeight: '900',
                    fontSize: '1.2rem'
                  }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3 */}
          <div 
            style={styles.aboutCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <h3 style={styles.aboutCardH3}>Who Can Avail Our Services?</h3>
            <p style={styles.aboutCardP}>
              Our services are designed for salaried individuals,
              self-employed professionals, business owners, and entrepreneurs
              looking for quick approvals and expert financial guidance.
            </p>
          </div>

          {/* Card 4 */}
          <div 
            style={styles.aboutCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <h3 style={styles.aboutCardH3}>Our Commitment</h3>
            <ul style={styles.aboutCardUl}>
              {['Transparent loan processing', 'Multiple bank tie-ups', 'Quick approvals and disbursement', 'Dedicated relationship support'].map((item, idx) => (
                <li 
                  key={idx}
                  style={styles.aboutCardLi}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.paddingLeft = '2rem';
                    e.currentTarget.style.color = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.paddingLeft = '1.5rem';
                    e.currentTarget.style.color = '#2d3748';
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#667eea',
                    fontWeight: '900',
                    fontSize: '1.2rem'
                  }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ==================== WHY CHOOSE US ==================== */}
        <section style={styles.whyChoose}>
          <span style={styles.whyChooseSpan}>Why Choose</span>
          <h2 style={styles.whoHeadingH2}>Why Choose Us</h2>
          <p style={styles.whySummary}>
            Our customer-first approach, backed by trusted banking partnerships and
            industry expertise, ensures a smooth, transparent, and hassle-free loan
            experience from application to disbursement.
          </p>

          <div style={styles.whyGrid} className="why-grid">
            {[
              { icon: '🏦', title: 'Strong Bank Network', desc: 'Partnerships with leading banks and NBFCs to offer multiple loan options under one roof.' },
              { icon: '⚡', title: 'Quick Processing', desc: 'Faster loan approvals through simplified documentation and efficient coordination with banks.' },
              { icon: '📋', title: 'Hassle-Free Documentation', desc: 'End-to-end assistance with document collection, verification, and submission.' },
              { icon: '💼', title: 'Expert Financial Guidance', desc: 'Professional advice to help customers choose the right loan product based on their financial goals.' },
              { icon: '🔍', title: 'Transparent Process', desc: 'No hidden charges, clear communication, and complete visibility throughout the loan journey.' },
              { icon: '🤝', title: 'Customer-Centric Approach', desc: 'Dedicated support teams focused on customer satisfaction and long-term relationships.' },
              { icon: '📈', title: 'High Success Rate', desc: 'Proven track record of successful loan disbursements across multiple customer profiles.' },
              { icon: '🌍', title: 'Pan-India Reach', desc: 'Serving customers across India with consistent quality and reliable financial solutions.' }
            ].map((item, idx) => (
              <div 
                key={idx}
                style={styles.whyBox}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={styles.whyBoxSpan}>{item.icon}</span>
                <h4 style={styles.whyBoxH4}>{item.title}</h4>
                <p style={styles.whyBoxP}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== PARTNERS ==================== */}
        <section style={styles.partnersSection}>
          <span style={styles.sectionTag}>To Whom We Work With</span>
          <h2 style={styles.partnersH2}>Our Financial Partners</h2>

          <div style={styles.partnersSlider}>
            <div style={styles.partnersTrack}>
              {[...bankLogos, ...bankLogos].map((logo, index) => (
                <img 
                  key={index} 
                  src={logo} 
                  style={styles.partnerImg}
                  alt="Bank Logo"
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '0.8';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;
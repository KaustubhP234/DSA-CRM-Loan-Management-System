import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import processImg from "../assets/processimg.jpg";

const HowItWorks = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const styles = {
    // ==================== PAGE WRAPPER ====================
    page: {
      width: '100%',
      overflow: 'hidden',
    },

    // ==================== HEADER ====================
    header: {
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

    // ==================== HOW WE WORK SECTION ====================
    howWeWork: {
      padding: '5rem 2rem',
      background: 'white',
    },
    howWeWorkHeader: {
      textAlign: 'center',
      marginBottom: '4rem',
    },
    subtitle: {
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
    howWeWorkH2: {
      fontSize: 'clamp(2rem, 4vw, 2.8rem)',
      fontWeight: '900',
      color: '#1a202c',
      marginBottom: '1rem',
    },
    howWeWorkP: {
      fontSize: '1.1rem',
      color: '#4a5568',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.8',
    },
    howWeWorkContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '3rem',
      maxWidth: '1200px',
      margin: '0 auto',
      alignItems: 'center',
    },
    processImage: {
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
    processImg: {
      width: '100%',
      height: 'auto',
      display: 'block',
    },
    processSteps: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    step: {
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'flex-start',
      transition: 'all 0.3s ease',
    },
    stepNumber: {
      fontSize: '2.5rem',
      fontWeight: '900',
      color: '#667eea',
      minWidth: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)',
      transition: 'all 0.3s ease',
    },
    stepBox: {
      flex: 1,
      padding: '1.5rem 2rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      borderLeft: '5px solid #667eea',
      transition: 'all 0.3s ease',
    },
    stepH4: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '0.8rem',
    },
    stepP: {
      fontSize: '1rem',
      color: '#4a5568',
      lineHeight: '1.6',
    },

    // ==================== HIGHLIGHT CARDS ====================
    highlightSection: {
      padding: '4rem 2rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    highlightGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2.5rem',
      maxWidth: '1100px',
      margin: '0 auto',
    },
    highlightCard: {
      background: 'white',
      padding: '2.5rem',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
    },
    highlightH3: {
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#1a202c',
      marginBottom: '0.8rem',
      paddingBottom: '0.8rem',
      borderBottom: '3px solid #667eea',
    },
    highlightSubtitle: {
      fontSize: '0.95rem',
      color: '#4a5568',
      marginBottom: '1.2rem',
      lineHeight: '1.6',
    },
    highlightUl: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    highlightLi: {
      fontSize: '0.95rem',
      color: '#2d3748',
      padding: '0.7rem 0',
      paddingLeft: '2rem',
      position: 'relative',
      lineHeight: '1.6',
      transition: 'all 0.3s ease',
    },

    // ==================== PROCESS SECTION ====================
    processSection: {
      padding: '5rem 2rem',
      background: 'white',
      textAlign: 'center',
    },
    sectionHeading: {
      marginBottom: '4rem',
    },
    tagline: {
      fontSize: '1.1rem',
      color: '#4a5568',
      maxWidth: '700px',
      margin: '1rem auto 0',
      lineHeight: '1.8',
    },
    processCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    processCard: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2.5rem',
      borderRadius: '20px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
      cursor: 'pointer',
    },
    processCardH3: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '1rem',
    },
    processCardP: {
      fontSize: '1rem',
      color: '#4a5568',
      lineHeight: '1.6',
    },

    // ==================== WHY CHOOSE US ====================
    whySection: {
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
    },
    whySubtitle: {
      fontSize: '1.1rem',
      color: 'rgba(255,255,255,0.9)',
      maxWidth: '800px',
      margin: '1rem auto 4rem',
      lineHeight: '1.8',
    },
    whyCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    whyCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      padding: '2.5rem',
      borderRadius: '20px',
      transition: 'all 0.3s ease',
      border: '2px solid rgba(255,255,255,0.2)',
      cursor: 'pointer',
    },
    whyCardH4: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginBottom: '1rem',
    },
    whyCardP: {
      fontSize: '1rem',
      lineHeight: '1.6',
      opacity: '0.9',
    },
  };

  const getStepStyle = (index) => ({
    ...styles.step,
    transform: hoveredCard === `step-${index}` ? 'translateX(10px)' : 'translateX(0)',
  });

  const getStepNumberStyle = (index) => ({
    ...styles.stepNumber,
    background: hoveredCard === `step-${index}` 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    color: hoveredCard === `step-${index}` ? 'white' : '#667eea',
    transform: hoveredCard === `step-${index}` ? 'scale(1.1)' : 'scale(1)',
  });

  const getStepBoxStyle = (index) => ({
    ...styles.stepBox,
    transform: hoveredCard === `step-${index}` ? 'translateX(5px)' : 'translateX(0)',
    boxShadow: hoveredCard === `step-${index}` 
      ? '0 15px 40px rgba(102, 126, 234, 0.3)' 
      : 'none',
  });

  const getHighlightCardStyle = (type) => ({
    ...styles.highlightCard,
    transform: hoveredCard === type ? 'translateY(-10px)' : 'translateY(0)',
    boxShadow: hoveredCard === type 
      ? '0 20px 40px rgba(102, 126, 234, 0.3)' 
      : '0 10px 30px rgba(0,0,0,0.1)',
    borderColor: hoveredCard === type ? '#667eea' : 'transparent',
  });

  const getProcessCardStyle = (index) => ({
    ...styles.processCard,
    transform: hoveredCard === `process-${index}` ? 'translateY(-10px) scale(1.05)' : 'translateY(0) scale(1)',
    background: hoveredCard === `process-${index}` 
      ? 'white' 
      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderColor: hoveredCard === `process-${index}` ? '#667eea' : 'transparent',
    boxShadow: hoveredCard === `process-${index}` 
      ? '0 20px 40px rgba(102, 126, 234, 0.3)' 
      : 'none',
  });

  const getWhyCardStyle = (index) => ({
    ...styles.whyCard,
    transform: hoveredCard === `why-${index}` ? 'translateY(-10px) scale(1.05)' : 'translateY(0) scale(1)',
    background: hoveredCard === `why-${index}` 
      ? 'white' 
      : 'rgba(255, 255, 255, 0.1)',
    color: hoveredCard === `why-${index}` ? '#1a202c' : 'white',
    borderColor: hoveredCard === `why-${index}` ? 'white' : 'rgba(255,255,255,0.2)',
  });

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        {/* ==================== HEADER ==================== */}
        <section style={styles.header}>
          <h1 style={styles.headerH1}>How It Works</h1>
          <p style={styles.headerP}>
            Our simple and transparent process ensures smooth loan processing from
            application to final disbursement with complete visibility at every step.
          </p>
        </section>

        {/* ==================== HOW WE WORK SECTION ==================== */}
        <section style={styles.howWeWork}>
          <div style={styles.howWeWorkHeader}>
            <span style={styles.subtitle}>How We Work</span>
            <h2 style={styles.howWeWorkH2}>Our Process</h2>
            <p style={styles.howWeWorkP}>
              Are you worried about your financial issues? We help you meet your
              financial needs with fast money loans and easy processes.
            </p>
          </div>

          <div style={styles.howWeWorkContent}>
            {/* LEFT IMAGE */}
            <div style={styles.processImage}>
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
                <img src={processImg} style={styles.processImg} alt="Loan Process" />
              </div>
            </div>

            {/* RIGHT STEPS */}
            <div style={styles.processSteps}>
              {[
                {
                  title: 'Fill The Application Form',
                  desc: 'Check your eligibility and submit a filled loan application form along with all required documents.'
                },
                {
                  title: 'Compare Your Options',
                  desc: 'We provide quotes from multiple financiers so you can compare and choose the most suitable option.'
                },
                {
                  title: 'Get Your Funds',
                  desc: 'Once selected, we process your loan quickly and ensure funds are credited to your bank account.'
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  style={getStepStyle(index)}
                  onMouseEnter={() => setHoveredCard(`step-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={getStepNumberStyle(index)}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div style={getStepBoxStyle(index)}>
                    <h4 style={styles.stepH4}>{step.title}</h4>
                    <p style={styles.stepP}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== HIGHLIGHT CARDS ==================== */}
        <section style={styles.highlightSection}>
          <div style={styles.highlightGrid}>
            {/* ELIGIBILITY */}
            <div 
              style={getHighlightCardStyle('eligibility')}
              onMouseEnter={() => setHoveredCard('eligibility')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3 style={styles.highlightH3}>Are You Eligible to Apply for a Loan?</h3>
              <p style={styles.highlightSubtitle}>
                Basic eligibility criteria every applicant must meet
              </p>
              <ul style={styles.highlightUl}>
                {[
                  '✔ Indian Resident',
                  '✔ Minimum age: 21 years',
                  '✔ Stable source of income',
                  '✔ Valid identity & address proof',
                  '✔ Acceptable credit profile',
                  '✔ You Should Have An Active Bank Account',
                  '✔ Not Have Been Bankrupt In Past 1 Year*',
                  '✔ You Should Have A CIBIL Score of greater than 700*'
                ].map((item, idx) => (
                  <li 
                    key={idx}
                    style={styles.highlightLi}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.paddingLeft = '2.5rem';
                      e.currentTarget.style.color = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.paddingLeft = '2rem';
                      e.currentTarget.style.color = '#2d3748';
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      left: '0.5rem',
                      color: '#667eea',
                      fontWeight: '900',
                    }}>{item.slice(0, 1)}</span>
                    {item.slice(2)}
                  </li>
                ))}
              </ul>
            </div>

            {/* DOCUMENTS */}
            <div 
              style={getHighlightCardStyle('documents')}
              onMouseEnter={() => setHoveredCard('documents')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3 style={styles.highlightH3}>Documents Required for Loan Application</h3>
              <p style={styles.highlightSubtitle}>
                Keep the following documents ready for faster processing
              </p>
              <ul style={styles.highlightUl}>
                {[
                  '📄 Aadhaar Card',
                  '📄 PAN Card',
                  '📄 Address Proof',
                  '📄 Bank Statements (Last 6 Months)',
                  '📄 Income Proof / Salary Slips',
                  '📄 Other Relevant Documents'
                ].map((item, idx) => (
                  <li 
                    key={idx}
                    style={styles.highlightLi}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.paddingLeft = '2.5rem';
                      e.currentTarget.style.color = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.paddingLeft = '2rem';
                      e.currentTarget.style.color = '#2d3748';
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      left: '0.5rem',
                      fontSize: '1.2rem',
                    }}>{item.slice(0, 2)}</span>
                    {item.slice(3)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ==================== PROCESS SECTION ==================== */}
        <section style={styles.processSection}>
          <div style={styles.sectionHeading}>
            <span style={styles.subtitle}>Step by Step</span>
            <h2 style={styles.howWeWorkH2}>Simple & Transparent Loan Process</h2>
            <p style={styles.tagline}>
              From application to disbursement — everything made easy
            </p>
          </div>

          <div style={styles.processCards}>
            {[
              {
                title: '1. Apply for Loan',
                desc: 'Customers submit loan requirements through the system with basic details and preferred loan type.'
              },
              {
                title: '2. Document Verification',
                desc: 'Required documents are collected, verified, and uploaded securely by authorized users.'
              },
              {
                title: '3. Bank Processing',
                desc: 'Loan files are assigned to banks and executives for approval and further processing.'
              },
              {
                title: '4. Loan Disbursement',
                desc: 'Once approved, the loan amount is sanctioned and disbursed with complete status tracking.'
              }
            ].map((card, index) => (
              <div 
                key={index}
                style={getProcessCardStyle(index)}
                onMouseEnter={() => setHoveredCard(`process-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 style={styles.processCardH3}>{card.title}</h3>
                <p style={styles.processCardP}>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== WHY CHOOSE US ==================== */}
        <section style={styles.whySection}>
          <div style={styles.sectionHeading}>
            <span style={{...styles.subtitle, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)'}}>
              Choose
            </span>
            <h2 style={{...styles.howWeWorkH2, color: 'white'}}>Why Choose Us</h2>
            <p style={styles.whySubtitle}>
              A reliable, transparent, and technology-driven platform designed to
              simplify loan processing and deliver results you can trust.
            </p>
          </div>

          <div style={styles.whyCards}>
            {[
              {
                title: 'Role-Based Access',
                desc: 'Secure access for Admins, Operators, Marketing Executives, and Bank Executives.'
              },
              {
                title: 'Real-Time Tracking',
                desc: 'Track loan status, documentation, and approvals at every stage.'
              },
              {
                title: 'Centralized System',
                desc: 'Manage customers, banks, loan files, and reports from one platform.'
              },
              {
                title: 'Scalable & Secure',
                desc: 'Designed to grow with your business and extend easily to backend services.'
              }
            ].map((card, index) => (
              <div 
                key={index}
                style={getWhyCardStyle(index)}
                onMouseEnter={() => setHoveredCard(`why-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h4 style={styles.whyCardH4}>{card.title}</h4>
                <p style={styles.whyCardP}>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default HowItWorks;
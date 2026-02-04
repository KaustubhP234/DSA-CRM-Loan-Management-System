import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import img1 from "../assets/img1.jpg";
import img22 from "../assets/img22.jpg";
import processImg from "../assets/processimg.jpg";
import eligibilityImg from "../assets/eligibility.jpg";
import user1 from "../assets/avtar1.webp";
import user2 from "../assets/avtar2.webp";
import user3 from "../assets/avtar3.webp";
import icici from "../assets/icicibank.png";
import axis from "../assets/axisbank.jpg";
import sbi from "../assets/sbi.png";
import hsbc from "../assets/hsbc.png";
import union from "../assets/unionbank.png";
import yes from "../assets/yesbank.png";
import canara from "../assets/canarabank.jpg";
import central from "../assets/centralbank.png";


const Home = () => {
  // Loan Calculator State
  const [amount, setAmount] = useState(2850000);
  const [rate, setRate] = useState(29);
  const [years, setYears] = useState(5);
  const [emi, setEmi] = useState(0);
  const [interest, setInterest] = useState(0);
  const [total, setTotal] = useState(0);

  // Testimonials Data
  const testimonials = [
    {
      text: "In the past few months, we were going through financial issues and got to know about Finfree Enterprises. The complete process of getting a personal loan was smooth and uncomplicated.",
      name: "Vipin Raj",
      company: "Reliance Commodity",
      img: user1,
    },
    {
      text: "Excellent service and very professional team. The loan approval process was fast and transparent. Highly recommended!",
      name: "Ankit Sharma",
      company: "Self Employed",
      img: user2,
    },
    {
      text: "I received my business loan on time with minimal documentation. Very supportive staff and easy process.",
      name: "Rohit Verma",
      company: "Small Business Owner",
      img: user3,
    },
  ];

  // Bank Logos
  const bankLogos = [icici, axis, sbi, hsbc, union, yes, canara, central];

  // EMI Calculator Effect
  useEffect(() => {
    const P = amount;
    const r = rate / 12 / 100;
    const n = years * 12;

    const emiCalc = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emiCalc * n;
    const interestPayable = totalPayable - P;

    setEmi(Math.round(emiCalc));
    setTotal(Math.round(totalPayable));
    setInterest(Math.round(interestPayable));
  }, [amount, rate, years]);

  const styles = {
    // ==================== HERO SLIDER ====================
    heroSlider: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
    },
    heroImage: {
      width: '100%',
      height: '100vh',
      objectFit: 'cover',
      filter: 'brightness(0.7)',
    },
    heroCaption: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      color: 'white',
      zIndex: 10,
      width: '90%',
      maxWidth: '800px',
    },
    heroCaptionH2: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: '900',
      marginBottom: '1.5rem',
      textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
      lineHeight: '1.2',
    },
    heroCaptionP: {
      fontSize: 'clamp(1rem, 2vw, 1.3rem)',
      marginBottom: '2rem',
      textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
    },
    heroBtn: {
      padding: '1rem 3rem',
      fontSize: '1.1rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
    },

    // ==================== SERVICES SECTION ====================
    servicesSection: {
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      textAlign: 'center',
    },
    servicesTitle: {
      fontSize: 'clamp(2rem, 4vw, 2.8rem)',
      fontWeight: '900',
      color: '#1a202c',
      marginBottom: '1rem',
    },
    servicesSubtitle: {
      fontSize: '1.1rem',
      color: '#4a5568',
      marginBottom: '3rem',
      maxWidth: '700px',
      margin: '0 auto 3rem',
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    featureCard: {
      background: 'white',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      color: '#2d3748',
    },

    // ==================== LOAN CALCULATOR ====================
    calculatorSection: {
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    },
    calculatorTitle: {
      textAlign: 'center',
      fontSize: 'clamp(2rem, 4vw, 2.8rem)',
      fontWeight: '900',
      marginBottom: '3rem',
    },
    calculatorGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    calculatorInputs: {
      background: 'rgba(255,255,255,0.1)',
      padding: '2rem',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
    },
    inputLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      fontSize: '1rem',
    },
    inputNumber: {
      width: '100%',
      padding: '0.8rem',
      marginBottom: '0.5rem',
      border: '2px solid rgba(255,255,255,0.3)',
      borderRadius: '10px',
      background: 'rgba(255,255,255,0.1)',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
    },
    inputRange: {
      width: '100%',
      marginBottom: '1.5rem',
      height: '8px',
      borderRadius: '5px',
      background: 'rgba(255,255,255,0.2)',
      outline: 'none',
      cursor: 'pointer',
    },
    calculatorResults: {
      background: 'white',
      color: '#1a202c',
      padding: '2rem',
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    resultBox: {
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      textAlign: 'center',
    },
    resultH4: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#4a5568',
      marginBottom: '0.5rem',
    },
    resultP: {
      fontSize: '1.5rem',
      fontWeight: '900',
      color: '#667eea',
    },
    emiBox: {
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '15px',
      textAlign: 'center',
      color: 'white',
    },
    calculatorChart: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      color: '#1a202c',
      padding: '2rem',
      borderRadius: '20px',
    },
    donut: {
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem',
      position: 'relative',
    },
    donutInner: {
      position: 'absolute',
      width: '140px',
      height: '140px',
      background: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      fontWeight: '700',
      color: '#1a202c',
    },
    legend: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.95rem',
      fontWeight: '600',
    },
    legendPrincipal: {
      width: '20px',
      height: '20px',
      background: '#fbbf24',
      borderRadius: '4px',
    },
    legendInterest: {
      width: '20px',
      height: '20px',
      background: '#0f2a44',
      borderRadius: '4px',
    },

    // ==================== PROCESS SECTION ====================
    processSection: {
      padding: '5rem 2rem',
      background: 'white',
    },
    processHeader: {
      textAlign: 'center',
      marginBottom: '4rem',
    },
    processSubtitle: {
      display: 'inline-block',
      padding: '0.5rem 1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '50px',
      fontSize: '0.9rem',
      fontWeight: '700',
      marginBottom: '1rem',
    },
    processTitle: {
      fontSize: 'clamp(2rem, 4vw, 2.8rem)',
      fontWeight: '900',
      color: '#1a202c',
      marginBottom: '1rem',
    },
    processP: {
      fontSize: '1.1rem',
      color: '#4a5568',
      maxWidth: '700px',
      margin: '0 auto',
    },
    processContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '3rem',
      maxWidth: '1200px',
      margin: '0 auto',
      alignItems: 'center',
    },
    processImage: {
      width: '100%',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    },
    processImgTag: {
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
    },
    stepNumber: {
      minWidth: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '15px',
      fontSize: '1.5rem',
      fontWeight: '900',
      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
    },
    stepBox: {
      flex: 1,
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      transition: 'all 0.3s ease',
    },
    stepH4: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '0.5rem',
    },
    stepP: {
      fontSize: '1rem',
      color: '#4a5568',
      lineHeight: '1.6',
    },

    // ==================== ELIGIBILITY SECTION ====================
    eligibilitySection: {
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    eligibilityHeader: {
      textAlign: 'center',
      marginBottom: '4rem',
    },
    eligibilityTag: {
      display: 'inline-block',
      padding: '0.5rem 1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '50px',
      fontSize: '0.9rem',
      fontWeight: '700',
      marginBottom: '1rem',
    },
    eligibilityContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      alignItems: 'center',
    },
    eligibilityColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    eligibilityItem: {
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'flex-start',
      padding: '1.5rem',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
    },
    icon: {
      minWidth: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '15px',
      fontSize: '1.8rem',
      fontWeight: '900',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    },
    iconPink: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
    },
    iconBlue: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: 'white',
    },
    iconYellow: {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      color: 'white',
    },
    iconPurple: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    },
    iconOrange: {
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      color: 'white',
    },
    iconGreen: {
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      color: 'white',
    },
    eligibilityH4: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '0.5rem',
    },
    eligibilityP: {
      fontSize: '1rem',
      color: '#4a5568',
      lineHeight: '1.6',
    },

    // ==================== TESTIMONIALS ====================
    testimonialSection: {
      padding: '5rem 2rem',
      background: 'white',
      textAlign: 'center',
    },
    sectionTag: {
      display: 'inline-block',
      padding: '0.5rem 1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '50px',
      fontSize: '0.9rem',
      fontWeight: '700',
      marginBottom: '1rem',
    },
    testimonialCard: {
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '3rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      position: 'relative',
    },
    loanBadge: {
      position: 'absolute',
      top: '1.5rem',
      right: '1.5rem',
      padding: '0.5rem 1rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '50px',
      fontSize: '0.8rem',
      fontWeight: '700',
    },
    quote: {
      fontSize: '5rem',
      fontWeight: '900',
      color: '#667eea',
      lineHeight: '0.5',
      marginBottom: '1rem',
    },
    testimonialText: {
      fontSize: '1.1rem',
      color: '#2d3748',
      lineHeight: '1.8',
      marginBottom: '2rem',
      fontStyle: 'italic',
    },
    testimonialHr: {
      border: 'none',
      borderTop: '2px solid rgba(102, 126, 234, 0.3)',
      margin: '2rem 0',
    },
    testimonialUser: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      justifyContent: 'center',
    },
    testimonialImg: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: '3px solid #667eea',
    },
    testimonialUserH4: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '0.2rem',
    },
    testimonialUserSpan: {
      fontSize: '0.9rem',
      color: '#4a5568',
    },

    // ==================== PARTNERS ====================
    partnersSection: {
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      overflow: 'hidden',
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
      opacity: 0.8,
      transition: 'all 0.3s ease',
    },
    partnersHeader: {
      textAlign: "center",
      maxWidth: "900px",
      margin: "0 auto",
    },

    partnersTitle: {
      fontSize: "clamp(2rem, 4vw, 2.8rem)",
      fontWeight: "900",
      marginTop: "1rem",
      color: "white",
    },


  };

  // Inline keyframes
  const styleSheet = `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    
    @media (max-width: 768px) {
      .calculator-grid, .process-content, .eligibility-content {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  return (
    <>
      <style>{styleSheet}</style>
      <Navbar />

      {/* ==================== HERO SLIDER ==================== */}
      <section style={styles.heroSlider}>
        <div
          id="carouselExample"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="5000"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={img1} style={styles.heroImage} alt="Slide 1" />
              <div style={styles.heroCaption}>
                <h2 style={styles.heroCaptionH2}>Get Fast Cash Loans without Hassles</h2>
                <p style={styles.heroCaptionP}>Choose From Our Different Loan Options To Meet Your Needs</p>
                <NavLink to="/loan-application">
                  <button 
                    style={styles.heroBtn}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                    }}
                  >
                    Apply Now
                  </button>
                </NavLink>
              </div>
            </div>

            <div className="carousel-item">
              <img src={img22} style={styles.heroImage} alt="Slide 2" />
              <div style={styles.heroCaption}>
                <h2 style={styles.heroCaptionH2}>Low Interest Rate Loans with Flexible EMIs</h2>
                <p style={styles.heroCaptionP}>Affordable loans designed to fit your financial goals</p>
                <NavLink to="/loan-application">
                  <button 
                    style={styles.heroBtn}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                    }}
                  >
                    Apply Now
                  </button>
                </NavLink>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </section>

      {/* ==================== SERVICES ==================== */}
      <section style={styles.servicesSection}>
        <h2 style={styles.servicesTitle}>Our Services</h2>
        <p style={styles.servicesSubtitle}>
          End-to-end loan processing and CRM solutions for DSAs and banks
        </p>

        <div style={styles.features}>
          {['Personal Loans', 'Business Loans', 'Home Loans', 'Mortgage Loans', 
            'Balance Transfer', 'Loan Eligibility Check', 'Credit Score (CIBIL) Assistance', 
            'Documentation', 'Status Monitoring', 'Commission & Reports'].map((service, idx) => (
            <div 
              key={idx}
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}
            >
              <span>{service}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== LOAN CALCULATOR ==================== */}
      <section style={styles.calculatorSection}>
        <h2 style={styles.calculatorTitle}>Personal Loans EMI Calculator</h2>

        <div style={styles.calculatorGrid} className="calculator-grid">
          {/* INPUTS */}
          <div style={styles.calculatorInputs}>
            <label style={styles.inputLabel}>Personal Loan Amount</label>
            <input
              type="number"
              style={styles.inputNumber}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="range"
              style={styles.inputRange}
              min="50000"
              max="5000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <label style={styles.inputLabel}>Interest Rate (%)</label>
            <input
              type="number"
              style={styles.inputNumber}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            <input
              type="range"
              style={styles.inputRange}
              min="5"
              max="36"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />

            <label style={styles.inputLabel}>Loan Tenure (Years)</label>
            <input
              type="number"
              style={styles.inputNumber}
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
            <input
              type="range"
              style={styles.inputRange}
              min="1"
              max="10"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>

          {/* RESULTS */}
          <div style={styles.calculatorResults}>
            <div style={styles.resultBox}>
              <h4 style={styles.resultH4}>Principal</h4>
              <p style={styles.resultP}>₹ {amount.toLocaleString()}</p>
            </div>
            <div style={styles.resultBox}>
              <h4 style={styles.resultH4}>Interest</h4>
              <p style={styles.resultP}>₹ {interest.toLocaleString()}</p>
            </div>
            <div style={styles.resultBox}>
              <h4 style={styles.resultH4}>Total Payable</h4>
              <p style={styles.resultP}>₹ {total.toLocaleString()}</p>
            </div>
            <div style={styles.emiBox}>
              <h4 style={{...styles.resultH4, color: 'white'}}>Monthly EMI</h4>
              <p style={{...styles.resultP, color: 'white', fontSize: '2rem'}}>₹ {emi.toLocaleString()}</p>
            </div>
          </div>

          {/* CHART */}
          <div style={styles.calculatorChart}>
            <div
              style={{
                ...styles.donut,
                background: `conic-gradient(
                  #fbbf24 ${(amount / total) * 360}deg,
                  #0f2a44 0deg
                )`,
              }}
            >
              <div style={styles.donutInner}>Breakup</div>
            </div>

            <div style={styles.legend}>
              <p style={styles.legendItem}>
                <span style={styles.legendPrincipal}></span> Principal
              </p>
              <p style={styles.legendItem}>
                <span style={styles.legendInterest}></span> Interest
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW WE WORK ==================== */}
      <section style={styles.processSection}>
        <div style={styles.processHeader}>
          <span style={styles.processSubtitle}>How We Work</span>
          <h2 style={styles.processTitle}>Our Process</h2>
          <p style={styles.processP}>
            Are you worried about your financial issues? We help you meet your
            financial needs with fast money loans and easy processes.
          </p>
        </div>

        <div style={styles.processContent} className="process-content">
          <div style={styles.processImage}>
            <img src={processImg} style={styles.processImgTag} alt="Loan Process" />
          </div>

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
            ].map((step, idx) => (
              <div key={idx} style={styles.step}>
                <div style={styles.stepNumber}>{`0${idx + 1}`}</div>
                <div 
                  style={styles.stepBox}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(10px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h4 style={styles.stepH4}>{step.title}</h4>
                  <p style={styles.stepP}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ELIGIBILITY ==================== */}
      <section style={styles.eligibilitySection}>
        <div style={styles.eligibilityHeader}>
          <span style={styles.eligibilityTag}>Essentials</span>
          <h2 style={styles.processTitle}>Eligibility Criteria</h2>
          <p style={styles.processP}>
            Prior to applying for a loan, it is important to know whether you meet
            the eligibility criteria. Below are the essential requirements to
            proceed with your loan application.
          </p>
        </div>

        <div style={styles.eligibilityContent} className="eligibility-content">
          {/* LEFT COLUMN */}
          <div style={styles.eligibilityColumn}>
            {[
              { icon: '📅', title: 'Age', desc: 'Minimum of 23 years to maximum of 65 years', color: 'iconPink' },
              { icon: '🏠', title: 'Residency', desc: 'Should be a legal Indian resident', color: 'iconBlue' },
              { icon: '📍', title: 'Address', desc: 'Should have a valid permanent address', color: 'iconYellow' }
            ].map((item, idx) => (
              <div 
                key={idx}
                style={styles.eligibilityItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{...styles.icon, ...styles[item.color]}}>{item.icon}</div>
                <div>
                  <h4 style={styles.eligibilityH4}>{item.title}</h4>
                  <p style={styles.eligibilityP}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CENTER IMAGE */}
          <div style={styles.processImage}>
            <img src={eligibilityImg} style={styles.processImgTag} alt="Eligibility" />
          </div>

          {/* RIGHT COLUMN */}
          <div style={styles.eligibilityColumn}>
            {[
              { icon: '₹', title: 'Income', desc: 'Should have a regular source of income', color: 'iconPurple' },
              { icon: '🏦', title: 'Bank Account', desc: 'Should have an active bank account', color: 'iconOrange' },
              { icon: '📊', title: 'Liquidation', desc: 'Should not have been bankrupt in the past 1 year', color: 'iconGreen' }
            ].map((item, idx) => (
              <div 
                key={idx}
                style={styles.eligibilityItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{...styles.icon, ...styles[item.color]}}>{item.icon}</div>
                <div>
                  <h4 style={styles.eligibilityH4}>{item.title}</h4>
                  <p style={styles.eligibilityP}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section style={styles.testimonialSection}>
        <span style={styles.sectionTag}>What Clients Say?</span>
        <h2 style={styles.processTitle}>See Clients Reviews</h2>

        <div
          id="testimonialCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="4000"
        >
          <div className="carousel-inner">
            {testimonials.map((item, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={index}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={styles.testimonialCard}>
                    <span style={styles.loanBadge}>Personal Loan</span>
                    <div style={styles.quote}>"</div>
                    <p style={styles.testimonialText}>{item.text}</p>
                    <hr style={styles.testimonialHr} />
                    <div style={styles.testimonialUser}>
                      <img src={item.img} style={styles.testimonialImg} alt="Client" />
                      <div style={{ textAlign: 'left' }}>
                        <h4 style={styles.testimonialUserH4}>{item.name}</h4>
                        <span style={styles.testimonialUserSpan}>{item.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </section>

      {/* ==================== PARTNERS ==================== */}
      <section style={styles.partnersSection}>
        {/* HEADER */}
        <div style={styles.partnersHeader}>
          <span style={styles.sectionTag}>To Whom We Work With</span>
          <h2 style={styles.partnersTitle}>Our Financial Partners</h2>
        </div>

        {/* LOGOS */}
        <div style={styles.partnersSlider}>
          <div style={styles.partnersTrack}>
            {[...bankLogos, ...bankLogos].map((logo, index) => (
              <img 
                key={index} 
                src={logo} 
                style={styles.partnerImg}
                alt="Bank Logo"
              />
            ))}
          </div>
        </div>
      </section>


      <Footer />
    </>
  );
};

export default Home;
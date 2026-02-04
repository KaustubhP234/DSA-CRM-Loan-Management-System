import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Contact = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

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

    // ==================== CONTACT INFO ====================
    contactInfo: {
      padding: '5rem 2rem',
      background: 'white',
      textAlign: 'center',
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
    infoH2: {
      fontSize: 'clamp(2rem, 4vw, 2.8rem)',
      fontWeight: '900',
      color: '#1a202c',
      marginBottom: '1rem',
    },
    contactDesc: {
      fontSize: '1.1rem',
      color: '#4a5568',
      maxWidth: '800px',
      margin: '0 auto 3rem',
      lineHeight: '1.8',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    infoBox: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2.5rem',
      borderRadius: '20px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
      cursor: 'pointer',
    },
    infoBoxH4: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    infoBoxP: {
      fontSize: '1rem',
      color: '#4a5568',
      lineHeight: '1.8',
      margin: 0,
    },

    // ==================== FORM SECTION ====================
    formSection: {
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    contactGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '3rem',
      maxWidth: '1200px',
      margin: '0 auto',
      alignItems: 'start',
    },
    formContainer: {
      background: 'white',
      padding: '3rem',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
      border: '2px solid transparent',
      transition: 'all 0.3s ease',
    },
    formH3: {
      fontSize: '2rem',
      fontWeight: '800',
      color: '#1a202c',
      marginBottom: '0.5rem',
    },
    formP: {
      fontSize: '1rem',
      color: '#4a5568',
      marginBottom: '2rem',
      lineHeight: '1.6',
    },
    formWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
    },
    input: {
      padding: '1rem 1.5rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      outline: 'none',
      background: 'white',
    },
    textarea: {
      padding: '1rem 1.5rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      minHeight: '150px',
      resize: 'vertical',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      outline: 'none',
      background: 'white',
    },
    button: {
      padding: '1.2rem 3rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
    },

    // ==================== MAP ====================
    mapContainer: {
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
      border: '10px solid white',
      height: '100%',
      minHeight: '500px',
      transition: 'all 0.3s ease',
    },
    iframe: {
      width: '100%',
      height: '100%',
      minHeight: '500px',
      border: 'none',
    },
  };

  const getInfoBoxStyle = (index) => ({
    ...styles.infoBox,
    transform: hoveredCard === `info-${index}` ? 'translateY(-10px) scale(1.05)' : 'translateY(0) scale(1)',
    background: hoveredCard === `info-${index}` 
      ? 'white' 
      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderColor: hoveredCard === `info-${index}` ? '#667eea' : 'transparent',
    boxShadow: hoveredCard === `info-${index}` 
      ? '0 20px 40px rgba(102, 126, 234, 0.3)' 
      : 'none',
  });

  const contactInfo = [
    {
      icon: '📍',
      title: 'Address',
      content: (
        <>
          Finfree Enterprises, #303, Minerva Complex,<br />
          Opp. Mc Donald's Restaurant, SD Road,<br />
          Secunderabad – 500003, Telangana, India
        </>
      )
    },
    {
      icon: '📞',
      title: 'For Enquiry',
      content: (
        <>
          Call: +91 9607249676<br />
          Email: kaustubhpawar2021@gmail.com
        </>
      )
    },
    {
      icon: '📩',
      title: 'For Complaints',
      content: (
        <>
          Call: +91 9607249676<br />
          Email: kaustubhpawar2021@gmail.com
        </>
      )
    }
  ];

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        {/* ==================== HEADER ==================== */}
        <section style={styles.header}>
          <h1 style={styles.headerH1}>Contact Us</h1>
          <p style={styles.headerP}>
            We are here to assist you with enquiries, support, and loan-related
            information. Feel free to reach out to us anytime.
          </p>
        </section>

        {/* ==================== CONTACT INFO ==================== */}
        <section style={styles.contactInfo}>
          <span style={styles.subtitle}>Get In Touch</span>
          <h2 style={styles.infoH2}>Contact Us</h2>
          <p style={styles.contactDesc}>
            We are committed to building long-term relationships with our clients.
            Reach out to us for enquiries, assistance, or support.
          </p>

          <div style={styles.infoGrid}>
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                style={getInfoBoxStyle(index)}
                onMouseEnter={() => setHoveredCard(`info-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h4 style={styles.infoBoxH4}>
                  <span style={{ fontSize: '2rem' }}>{info.icon}</span>
                  {info.title}
                </h4>
                <p style={styles.infoBoxP}>{info.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== FORM + MAP ==================== */}
        <section style={styles.formSection}>
          <div style={styles.contactGrid}>
            {/* FORM */}
            <div 
              style={{
                ...styles.formContainer,
                transform: hoveredCard === 'form' ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: hoveredCard === 'form' 
                  ? '0 25px 70px rgba(102, 126, 234, 0.3)' 
                  : '0 20px 60px rgba(102, 126, 234, 0.2)',
              }}
              onMouseEnter={() => setHoveredCard('form')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3 style={styles.formH3}>Ready to get started?</h3>
              <p style={styles.formP}>Fill out the form and our team will contact you shortly.</p>

              <div style={styles.formWrapper}>
                <div style={styles.formRow}>
                  <input 
                    type="text" 
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <input 
                    type="text" 
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={styles.formRow}>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <input 
                    type="tel" 
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <textarea 
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  style={styles.textarea}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />

                <button 
                  onClick={handleSubmit}
                  style={styles.button}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  Submit
                </button>
              </div>
            </div>

            {/* MAP */}
            <div 
              style={{
                ...styles.mapContainer,
                transform: hoveredCard === 'map' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: hoveredCard === 'map' 
                  ? '0 25px 70px rgba(102, 126, 234, 0.4)' 
                  : '0 20px 60px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={() => setHoveredCard('map')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <iframe
                title="Google Map"
                src="https://www.google.com/maps?q=Secunderabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
                style={styles.iframe}
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
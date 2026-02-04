import { useState } from "react";

const MedicalLoanForm = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    mobile: "",
    treatmentType: "",
    hospitalName: "",
    estimatedCost: "",
    requiredAmount: "",
    treatmentDate: "",
    relationWithPatient: "",
    employmentType: "",
    monthlyIncome: "",
    companyName: "",
    panCard: "",
  });

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "3rem 1.5rem",
      position: "relative",
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      marginBottom: "3rem",
    },
    title: {
      fontSize: "clamp(2rem, 4vw, 3rem)",
      fontWeight: "900",
      color: "white",
      marginBottom: "1rem",
      textShadow: "2px 2px 8px rgba(0,0,0,0.2)",
    },
    subtitle: {
      fontSize: "1.1rem",
      color: "rgba(255,255,255,0.9)",
      maxWidth: "600px",
      margin: "0 auto",
    },
    backButton: {
      position: "fixed",
      top: "1.5rem",
      left: "1.5rem",
      padding: "0.75rem 1.5rem",
      background: "rgba(255,255,255,0.2)",
      backdropFilter: "blur(10px)",
      border: "2px solid rgba(255,255,255,0.3)",
      borderRadius: "10px",
      color: "white",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      zIndex: 1000,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    formCard: {
      background: "white",
      borderRadius: "20px",
      padding: "3rem",
      boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#1a202c",
      marginBottom: "1.5rem",
      paddingBottom: "0.75rem",
      borderBottom: "3px solid #667eea",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#334155",
    },
    required: {
      color: "#ef4444",
    },
    input: {
      padding: "0.875rem 1rem",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "0.95rem",
      transition: "all 0.3s ease",
      outline: "none",
      background: "white",
      color: "#334155",
    },
    select: {
      padding: "0.875rem 1rem",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "0.95rem",
      transition: "all 0.3s ease",
      outline: "none",
      background: "white",
      cursor: "pointer",
      color: "#334155",
    },
    infoBox: {
      background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
      padding: "1.25rem",
      borderRadius: "12px",
      marginBottom: "2rem",
      borderLeft: "4px solid #3b82f6",
    },
    infoText: {
      fontSize: "0.9rem",
      color: "#1e40af",
      margin: 0,
      lineHeight: "1.6",
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      justifyContent: "flex-end",
      marginTop: "2rem",
      paddingTop: "2rem",
      borderTop: "2px solid #f1f5f9",
    },
    button: {
      padding: "1rem 2.5rem",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "none",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    buttonPrimary: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
    },
    buttonSecondary: {
      background: "white",
      color: "#64748b",
      border: "2px solid #e2e8f0",
    },
    // Mobile responsive styles
    "@media (max-width: 768px)": {
      container: {
        padding: "2rem 1rem",
      },
      formCard: {
        padding: "2rem 1.5rem",
      },
      title: {
        fontSize: "1.75rem",
      },
      subtitle: {
        fontSize: "1rem",
      },
      backButton: {
        top: "1rem",
        left: "1rem",
        padding: "0.6rem 1rem",
        fontSize: "0.85rem",
      },
    },
  };

  // Apply mobile styles dynamically
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    styles.container.padding = "2rem 1rem";
    styles.formCard.padding = "2rem 1.5rem";
    styles.backButton.top = "1rem";
    styles.backButton.left = "1rem";
    styles.backButton.padding = "0.6rem 1rem";
    styles.backButton.fontSize = "0.85rem";
    styles.buttonGroup.flexDirection = "column";
    styles.button.width = "100%";
    styles.button.justifyContent = "center";
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Medical Loan Data:", formData);
    alert("✅ Medical Loan application submitted successfully!");
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.backButton}
        onClick={handleBackToHome}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(255,255,255,0.3)";
          e.target.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255,255,255,0.2)";
          e.target.style.transform = "translateY(0)";
        }}
      >
        ← Back to Home
      </button>

      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏥 Medical Loan Application</h1>
          <p style={styles.subtitle}>
            Get quick financial assistance for medical treatments and emergencies
          </p>
        </div>

        <div style={styles.formCard}>
          <div style={styles.infoBox}>
            <p style={styles.infoText}>
              🏥 <strong>Medical Loan Features:</strong> Quick approval, flexible repayment, covers surgeries, treatments, and emergency medical expenses with minimal documentation.
            </p>
          </div>

          <h3 style={styles.sectionTitle}>
            <span>🏥</span> Patient Information
          </h3>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Patient Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter patient's full name"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Relation with Patient <span style={styles.required}>*</span>
              </label>
              <select
                name="relationWithPatient"
                value={formData.relationWithPatient}
                onChange={handleChange}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Select relation</option>
                <option value="Self">Self</option>
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Email Address <span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="your.email@example.com"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Mobile Number <span style={styles.required}>*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                style={styles.input}
                placeholder="10-digit mobile number"
                maxLength="10"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <h3 style={styles.sectionTitle}>
            <span>💊</span> Medical Details
          </h3>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Treatment Type <span style={styles.required}>*</span>
              </label>
              <select
                name="treatmentType"
                value={formData.treatmentType}
                onChange={handleChange}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Select treatment type</option>
                <option value="Surgery">Surgery</option>
                <option value="Cancer Treatment">Cancer Treatment</option>
                <option value="Heart Treatment">Heart Treatment</option>
                <option value="Kidney Treatment">Kidney Treatment</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Dental">Dental</option>
                <option value="IVF Treatment">IVF Treatment</option>
                <option value="Emergency">Emergency</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Hospital Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., Apollo Hospitals"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Estimated Treatment Cost (₹) <span style={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., 500000"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Required Loan Amount (₹) <span style={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="requiredAmount"
                value={formData.requiredAmount}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., 400000"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Expected Treatment Date <span style={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="treatmentDate"
                value={formData.treatmentDate}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <h3 style={styles.sectionTitle}>
            <span>💼</span> Applicant Employment Details
          </h3>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Employment Type <span style={styles.required}>*</span>
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Select employment type</option>
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Monthly Income (₹) <span style={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., 80000"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Company Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your company name"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                PAN Card <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="panCard"
                value={formData.panCard}
                onChange={handleChange}
                style={styles.input}
                placeholder="ABCDE1234F"
                maxLength="10"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              style={{...styles.button, ...styles.buttonSecondary}}
              onMouseEnter={(e) => {
                e.target.style.background = "#f8fafc";
                e.target.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
                e.target.style.borderColor = "#e2e8f0";
              }}
            >
              <span>✕</span> Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{...styles.button, ...styles.buttonPrimary}}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 15px 40px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 30px rgba(102, 126, 234, 0.3)";
              }}
            >
              <span>✓</span> Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalLoanForm;
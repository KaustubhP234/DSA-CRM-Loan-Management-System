import { useState } from "react";

const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    contactNumber: "",
    whatsappNumber: "",
    pinCode: "",
    district: "",
    address: "",
    dateOfBirth: "",
    panCard: "",
    aadharCard: "",
    occupation: "",
    monthlyIncome: "",
    userId: ""
  });

  const [errors, setErrors] = useState({});

  const districts = [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", 
    "Kolhapur", "Satara", "Sangli", "Ahmednagar", "Jalgaon", "Amravati", 
    "Nanded", "Latur", "Dhule", "Ratnagiri", "Yavatmal", "Beed", "Other"
  ];

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "2rem 1rem",
      position: "relative",
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
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
      color: "white",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "900",
      marginBottom: "0.5rem",
      textShadow: "2px 2px 8px rgba(0,0,0,0.2)",
    },
    subtitle: {
      fontSize: "1.1rem",
      opacity: "0.95",
    },
    card: {
      background: "white",
      borderRadius: "20px",
      padding: "2.5rem",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    },
    headerBadge: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "0.75rem 1.5rem",
      borderRadius: "50px",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.9rem",
      fontWeight: "600",
      marginBottom: "2rem",
    },
    sectionTitle: {
      fontSize: "1.3rem",
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
      color: "#334155",
      background: "white",
    },
    inputError: {
      borderColor: "#ef4444",
    },
    select: {
      padding: "0.875rem 1rem",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "0.95rem",
      transition: "all 0.3s ease",
      outline: "none",
      cursor: "pointer",
      color: "#334155",
      background: "white",
    },
    textarea: {
      padding: "0.875rem 1rem",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "0.95rem",
      transition: "all 0.3s ease",
      outline: "none",
      minHeight: "100px",
      resize: "vertical",
      color: "#334155",
      fontFamily: "inherit",
      background: "white",
      color: "#334155",
    },
    errorText: {
      fontSize: "0.85rem",
      color: "#ef4444",
      marginTop: "0.25rem",
    },
    infoBox: {
      background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
      padding: "1rem",
      borderRadius: "10px",
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
      flexWrap: "wrap",
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "WhatsApp number must be 10 digits";
    }

    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "PIN code must be 6 digits";
    }

    if (!formData.district) {
      newErrors.district = "District is required";
    }

    if (!formData.panCard.trim()) {
      newErrors.panCard = "PAN card is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard)) {
      newErrors.panCard = "Invalid PAN card format";
    }

    if (!formData.aadharCard.trim()) {
      newErrors.aadharCard = "Aadhar card is required";
    } else if (!/^\d{12}$/.test(formData.aadharCard)) {
      newErrors.aadharCard = "Aadhar must be 12 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const registrationData = {
        ...formData,
        customerId: `CUST${Date.now()}`,
        dateOfRegistration: new Date().toISOString(),
        loginStatus: "Inactive",
        userId: formData.userId || "USER001"
      };
      
      console.log("Customer Registration Data:", registrationData);
      alert("✅ Customer registered successfully!\n\nCustomer ID: " + registrationData.customerId);
      
      setFormData({
        customerName: "",
        email: "",
        contactNumber: "",
        whatsappNumber: "",
        pinCode: "",
        district: "",
        address: "",
        dateOfBirth: "",
        panCard: "",
        aadharCard: "",
        occupation: "",
        monthlyIncome: "",
        userId: ""
      });
    } else {
      alert("⚠️ Please fix the errors in the form");
    }
  };

  const handleReset = () => {
    setFormData({
      customerName: "",
      email: "",
      contactNumber: "",
      whatsappNumber: "",
      pinCode: "",
      district: "",
      address: "",
      dateOfBirth: "",
      panCard: "",
      aadharCard: "",
      occupation: "",
      monthlyIncome: "",
      userId: ""
    });
    setErrors({});
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
          <h1 style={styles.title}>DSA Customer Registration</h1>
          <p style={styles.subtitle}>District Service Agent - CRM Application</p>
        </div>

        <div style={styles.card}>
          <div style={styles.headerBadge}>
            <span>👤</span> New Customer Registration
          </div>

          <div style={styles.infoBox}>
            <p style={styles.infoText}>
              📋 <strong>Note:</strong> All fields marked with <span style={{color: "#ef4444"}}>*</span> are mandatory. Please ensure all information is accurate before submission.
            </p>
          </div>

          <div>
            <h3 style={styles.sectionTitle}>
              <span>👤</span> Personal Information
            </h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Customer Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.customerName ? styles.inputError : {}),
                  }}
                  placeholder="Enter full name"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.customerName ? "#ef4444" : "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.customerName && (
                  <span style={styles.errorText}>{errors.customerName}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Date of Birth <span style={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
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

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., Business, Salaried, Self-Employed"
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
                  Monthly Income (₹)
                </label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., 50000"
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
              <span>📞</span> Contact Information
            </h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Email Address <span style={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.email ? styles.inputError : {}),
                  }}
                  placeholder="example@email.com"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? "#ef4444" : "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.email && (
                  <span style={styles.errorText}>{errors.email}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Contact Number <span style={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.contactNumber ? styles.inputError : {}),
                  }}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.contactNumber ? "#ef4444" : "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.contactNumber && (
                  <span style={styles.errorText}>{errors.contactNumber}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  WhatsApp Number <span style={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.whatsappNumber ? styles.inputError : {}),
                  }}
                  placeholder="10-digit WhatsApp number"
                  maxLength="10"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.whatsappNumber ? "#ef4444" : "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.whatsappNumber && (
                  <span style={styles.errorText}>{errors.whatsappNumber}</span>
                )}
              </div>
            </div>

            <h3 style={styles.sectionTitle}>
              <span>📍</span> Address Information
            </h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  PIN Code <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.pinCode ? styles.inputError : {}),
                  }}
                  placeholder="6-digit PIN code"
                  maxLength="6"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.pinCode ? "#ef4444" : "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.pinCode && (
                  <span style={styles.errorText}>{errors.pinCode}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  District <span style={styles.required}>*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  style={{
                    ...styles.select,
                    ...(errors.district ? styles.inputError : {}),
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.district ? "#ef4444" : "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">Select District</option>
                  {districts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <span style={styles.errorText}>{errors.district}</span>
                )}
              </div>

              <div style={{...styles.formGroup, gridColumn: "1 / -1"}}>
                <label style={styles.label}>
                  Full Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Enter complete address"
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
              <span>📄</span> Document Information
            </h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  PAN Card Number <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="panCard"
                  value={formData.panCard}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.panCard ? styles.inputError : {}),
                  }}
                  placeholder="ABCDE1234F"
                  maxLength="10"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.panCard ? "#ef4444" : "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.panCard && (
                  <span style={styles.errorText}>{errors.panCard}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Aadhar Card Number <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="aadharCard"
                  value={formData.aadharCard}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.aadharCard ? styles.inputError : {}),
                  }}
                  placeholder="12-digit Aadhar number"
                  maxLength="12"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.aadharCard ? "#ef4444" : "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.aadharCard && (
                  <span style={styles.errorText}>{errors.aadharCard}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  User ID (Assigned By)
                </label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="User ID (optional)"
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
                onClick={handleReset}
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
                <span>🔄</span> Reset Form
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
                <span>✓</span> Register Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;
import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const LoanApplication = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    loanType: "Personal",
    amount: "",
    tenure: "",
    income: "",
    pan: "",
    aadhaar: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i)) e.email = "Valid email required";
    if (!form.phone.match(/^\d{10}$/)) e.phone = "10 digit phone required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = "Enter valid amount";
    if (!form.tenure || isNaN(Number(form.tenure)) || Number(form.tenure) <= 0) e.tenure = "Enter valid tenure";
    if (!form.income || isNaN(Number(form.income)) || Number(form.income) <= 0) e.income = "Enter valid income";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const efs = validate();
    setErrors(efs);
    if (Object.keys(efs).length === 0) {
      const submissions = JSON.parse(localStorage.getItem("loan_submissions")) || [];
      submissions.push({ ...form, submittedAt: new Date().toISOString() });
      localStorage.setItem("loan_submissions", JSON.stringify(submissions));
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      loanType: "Personal",
      amount: "",
      tenure: "",
      income: "",
      pan: "",
      aadhaar: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
    setErrors({});
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * {
          box-sizing: border-box;
        }

        .loan-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          position: relative;
        }

        .back-to-home {
        position: fixed;
        top: 20px;
        left: 20px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        color: #1e293b;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .back-to-home:hover {
        background: white;
        transform: translateX(-3px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        color: #0f172a;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
        .back-to-home {
            top: 15px;
            left: 15px;
            padding: 8px 16px;
            font-size: 13px;
        }
        }

        .loan-hero {
          background: linear-gradient(135deg, #0f2a44 0%, #1a3a5a 100%);
          padding: 100px 20px 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .loan-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/></svg>');
          opacity: 0.3;
        }

        .loan-hero .container {
          position: relative;
          z-index: 1;
        }

        .loan-hero h1 {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .loan-hero p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .loan-form-section {
          padding: 60px 20px;
        }

        .form-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          padding: 40px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .success-card {
          text-align: center;
          padding: 60px 40px;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin: 0 auto 24px;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .success-card h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .success-card p {
          font-size: 1.125rem;
          color: #64748b;
          margin-bottom: 32px;
        }

        .form-section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }

        .form-grid.full {
          grid-template-columns: 1fr;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .required {
          color: #dc2626;
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.875rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s;
          background: white;
          color: #334155;
        }

        .form-input:focus {
          outline: none;
          border-color: #0f2a44;
          box-shadow: 0 0 0 3px rgba(15, 42, 68, 0.1);
        }

        .form-input.error {
          border-color: #dc2626;
        }

        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .form-select {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.875rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
          background: white;
          color: #334155;
        }

        .form-select:focus {
          outline: none;
          border-color: #0f2a44;
          box-shadow: 0 0 0 3px rgba(15, 42, 68, 0.1);
        }

        .form-textarea {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.875rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s;
          background: white;
          color: #334155;
          resize: vertical;
          min-height: 100px;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #0f2a44;
          box-shadow: 0 0 0 3px rgba(15, 42, 68, 0.1);
        }

        .error-message {
          font-size: 0.75rem;
          color: #dc2626;
          margin-top: -4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          padding-top: 32px;
          border-top: 2px solid #f1f5f9;
        }

        .btn {
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, #0f2a44 0%, #1a3a5a 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(15, 42, 68, 0.2);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 42, 68, 0.3);
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #64748b;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        .btn-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        .info-banner {
          background: linear-gradient(135deg, rgba(15, 42, 68, 0.05), rgba(15, 42, 68, 0.1));
          border-left: 4px solid #0f2a44;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 32px;
          display: flex;
          gap: 12px;
        }

        .info-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .info-text {
          font-size: 0.875rem;
          color: #334155;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .back-home-link {
            top: 16px;
            left: 16px;
            padding: 8px 16px;
            font-size: 13px;
          }

          .loan-hero {
            padding: 80px 20px 60px;
          }

          .loan-hero h1 {
            font-size: 2rem;
          }

          .loan-hero p {
            font-size: 1rem;
          }

          .form-card {
            padding: 24px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .success-card {
            padding: 40px 24px;
          }

          .success-card h2 {
            font-size: 1.5rem;
          }

          .success-card p {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .back-home-link {
            position: relative;
            top: 0;
            left: 0;
            margin: 16px;
            width: calc(100% - 32px);
            justify-content: center;
          }

          .back-home-link:hover {
            transform: none;
          }

          .loan-hero {
            padding: 60px 16px 40px;
          }

          .loan-hero h1 {
            font-size: 1.75rem;
          }

          .loan-hero p {
            font-size: 0.9rem;
          }

          .loan-form-section {
            padding: 40px 16px;
          }

          .form-card {
            padding: 20px;
          }

          .form-section-title {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <main className="loan-page">
        <Link to="/" className="back-to-home">
        ← Back to Home
      </Link>

        <section className="loan-hero">
          <div className="container">
            <h1>💼 Loan Application</h1>
            <p>Fill out the form below and our team will contact you shortly</p>
          </div>
        </section>

        <section className="loan-form-section">
          <div className="container">
            <div className="form-card">
              {submitted ? (
                <div className="success-card">
                  <div className="success-icon">✓</div>
                  <h2>Application Submitted!</h2>
                  <p>Thank you for applying. Our team will review your application and contact you within 24-48 hours.</p>
                  <button className="btn btn-success" onClick={() => setSubmitted(false)}>
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="info-banner">
                    <div className="info-icon">ℹ️</div>
                    <div className="info-text">
                      <strong>Required Information:</strong> Please fill out all required fields marked with an asterisk (*). Ensure all information is accurate to avoid delays in processing.
                    </div>
                  </div>

                  {/* Personal Information */}
                  <h3 className="form-section-title">
                    <span>👤</span>
                    Personal Information
                  </h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Full Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <div className="error-message">⚠️ {errors.name}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Email Address <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="you@example.com"
                      />
                      {errors.email && <div className="error-message">⚠️ {errors.email}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Phone Number <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="9876543210"
                        maxLength={10}
                      />
                      {errors.phone && <div className="error-message">⚠️ {errors.phone}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Monthly Income (₹) <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        name="income"
                        value={form.income}
                        onChange={handleChange}
                        className={`form-input ${errors.income ? 'error' : ''}`}
                        placeholder="50000"
                      />
                      {errors.income && <div className="error-message">⚠️ {errors.income}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">PAN Number</label>
                      <input
                        type="text"
                        name="pan"
                        value={form.pan}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="ABCDE1234F"
                        maxLength={10}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Aadhaar Number</label>
                      <input
                        type="text"
                        name="aadhaar"
                        value={form.aadhaar}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="1234 5678 9012"
                        maxLength={12}
                      />
                    </div>
                  </div>

                  {/* Loan Details */}
                  <h3 className="form-section-title">
                    <span>💰</span>
                    Loan Details
                  </h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Loan Type <span className="required">*</span>
                      </label>
                      <select
                        name="loanType"
                        value={form.loanType}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Personal">Personal Loan</option>
                        <option value="Home">Home Loan</option>
                        <option value="Business">Business Loan</option>
                        <option value="Mortgage">Mortgage Loan</option>
                        <option value="Education">Education Loan</option>
                        <option value="Vehicle">Vehicle Loan</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Loan Amount (₹) <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        className={`form-input ${errors.amount ? 'error' : ''}`}
                        placeholder="500000"
                      />
                      {errors.amount && <div className="error-message">⚠️ {errors.amount}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Tenure (Months) <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        name="tenure"
                        value={form.tenure}
                        onChange={handleChange}
                        className={`form-input ${errors.tenure ? 'error' : ''}`}
                        placeholder="12"
                      />
                      {errors.tenure && <div className="error-message">⚠️ {errors.tenure}</div>}
                    </div>
                  </div>

                  {/* Address Information */}
                  <h3 className="form-section-title">
                    <span>📍</span>
                    Address Information
                  </h3>
                  <div className="form-grid full">
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Enter your complete address"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Mumbai"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Maharashtra"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="400001"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      <span>📝</span>
                      Submit Application
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      <span>↺</span>
                      Reset Form
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LoanApplication;

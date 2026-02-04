import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateLoan = () => {
  const navigate = useNavigate();

  /* ---------------- SMART NAVIGATION ---------------- */
  const getNavigationPath = (path) => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/data-operator')) {
      return path.replace('/admin', '/data-operator');
    }
    return path;
  };

  const [form, setForm] = useState({
    name: "",
    loanType: "",
    amount: "",
    status: "In-Process",
    email: "",
    phone: "",
    bankName: "",
    assignToExecutive: "",
  });

  const [executives, setExecutives] = useState([]);
  const [autoAssign, setAutoAssign] = useState(false);

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const bankExecutives = allUsers.filter(user => {
      const role = (user.login_role || user.role || "").toString().toLowerCase();
      return role === "bank executive" || 
             role === "bank_executive" || 
             (role.includes("bank") && role.includes("executive"));
    });
    setExecutives(bankExecutives);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generateAssignmentId = () => {
    const existingAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    const lastId = existingAssignments.length > 0 
      ? parseInt(existingAssignments[existingAssignments.length - 1].assignment_id.replace("ASN", ""))
      : 0;
    return `ASN${String(lastId + 1).padStart(3, "0")}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.loanType || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    const newLoan = {
      id: Date.now(),
      name: form.name,
      loanType: form.loanType,
      amount: form.amount,
      status: form.status,
      email: form.email,
      phone: form.phone,
      bankName: form.bankName,
      createdBy: "ADMIN",
      createdAt: new Date().toISOString(),
      customerName: form.name,
      customer_name: form.name,
      date_of_registration: new Date().toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      loan_type: form.loanType,
      bank_name: form.bankName,
      fileStatus: form.status,
    };

    const existingLoans = JSON.parse(localStorage.getItem("loanFiles")) || [];
    localStorage.setItem("loanFiles", JSON.stringify([newLoan, ...existingLoans]));

    if (autoAssign && form.assignToExecutive) {
      const selectedExecutive = executives.find(ex => String(ex.id) === String(form.assignToExecutive));
      
      if (selectedExecutive) {
        const newAssignment = {
          id: Date.now().toString(),
          assignment_id: generateAssignmentId(),
          file_id: newLoan.id,
          customer_name: newLoan.name,
          bank_name: newLoan.bankName || "N/A",
          loan_type: newLoan.loanType,
          loan_amount: newLoan.amount,
          executive_name: selectedExecutive.name,
          executive_email: selectedExecutive.email,
          executive_phone: selectedExecutive.contact_number || selectedExecutive.phone || "N/A",
          assigned_date: new Date().toISOString().split('T')[0],
          assignment_status: "Active",
          remarks: "Auto-assigned during loan creation",
        };

        const existingAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
        existingAssignments.push(newAssignment);
        localStorage.setItem("executiveAssignments", JSON.stringify(existingAssignments));
        
        alert(`✅ Loan created and assigned to ${selectedExecutive.name}!`);
      }
    } else {
      alert("✅ Loan created successfully!");
    }

    navigate(getNavigationPath("/admin/loan-files"));
  };

  const handleBack = () => {
    navigate(getNavigationPath("/admin/loan-files"));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        html, body {
          overflow-x: hidden;
        }

        /* ==================== ANIMATIONS ==================== */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 78, 137, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(0, 78, 137, 0);
          }
        }

        /* ==================== MAIN CONTAINER ==================== */
        .create-loan-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 1.5rem;
          padding-top: 80px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
          animation: fadeInUp 0.6s ease-out;
        }

        .create-loan-wrapper {
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          animation: slideDown 0.7s ease-out 0.1s both;
        }

        /* ==================== HEADER ==================== */
        .form-header {
          margin-bottom: 1.5rem;
          animation: slideDown 0.6s ease-out;
        }

        .form-header h1 {
          font-size: clamp(1.5rem, 5vw, 2.25rem);
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
          transition: all 0.3s ease;
        }

        .form-header h1:hover {
          transform: translateX(5px);
        }

        .form-header p {
          color: #64748b;
          font-size: clamp(0.875rem, 2vw, 1rem);
          margin: 0;
          font-weight: 500;
          animation: slideDown 0.7s ease-out 0.15s both;
        }

        /* ==================== FORM CARD ==================== */
        .form-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(226, 232, 240, 0.8);
          width: 100%;
          animation: scaleIn 0.6s ease-out 0.2s both;
          overflow: hidden;
          position: relative;
        }

        .form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #004E89, transparent);
          animation: shimmer 2s infinite;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        /* ==================== FORM GROUPS ==================== */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
          animation: slideInLeft 0.5s ease-out backwards;
        }

        .form-group:nth-child(1) { animation-delay: 0.25s; }
        .form-group:nth-child(2) { animation-delay: 0.3s; }
        .form-group:nth-child(3) { animation-delay: 0.35s; }
        .form-group:nth-child(4) { animation-delay: 0.4s; }
        .form-grid > .form-group:nth-child(5) { animation-delay: 0.45s; }
        .form-grid > .form-group:nth-child(6) { animation-delay: 0.5s; }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          transition: all 0.3s ease;
        }

        .required {
          color: #DC2626;
          font-weight: 700;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          color: #1e293b;
          position: relative;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #004E89;
          box-shadow: 0 0 0 3px rgba(0, 78, 137, 0.1);
          transform: translateY(-2px);
        }

        .form-input::placeholder {
          color: #94a3b8;
          transition: all 0.3s ease;
        }

        .form-input:focus::placeholder {
          color: #cbd5e1;
        }

        .form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%2364748b' d='M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        /* ==================== INPUT ICONS ==================== */
        .input-icon {
          position: relative;
          width: 100%;
        }

        .input-icon-symbol {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1.1rem;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .input-icon .form-input:focus ~ .input-icon-symbol,
        .input-icon .form-input:focus + .input-icon-symbol {
          color: #004E89;
          transform: translateY(-50%) scale(1.2);
        }

        .input-icon .form-input {
          padding-left: 2.75rem;
        }

        /* ==================== FORM SECTIONS ==================== */
        .form-section {
          margin-top: 1.75rem;
          padding-top: 1.75rem;
          border-top: 2px solid #f1f5f9;
          animation: slideInLeft 0.5s ease-out backwards;
        }

        .form-section:nth-of-type(2) { animation-delay: 0.55s; }
        .form-section:nth-of-type(3) { animation-delay: 0.6s; }

        .section-title {
          font-size: clamp(1rem, 2.5vw, 1.125rem);
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .section-title:hover {
          transform: translateX(3px);
          color: #004E89;
        }

        .section-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #004E89, #003366);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .section-title:hover .section-icon {
          transform: scale(1.1) rotate(10deg);
          box-shadow: 0 4px 12px rgba(0, 78, 137, 0.3);
        }

        /* ==================== CHECKBOX ==================== */
        .checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: 12px;
          margin-top: 1rem;
          transition: all 0.3s ease;
          animation: slideInRight 0.5s ease-out 0.65s both;
        }

        .checkbox-group:hover {
          box-shadow: 0 4px 16px rgba(0, 78, 137, 0.12);
          transform: translateY(-2px);
        }

        .checkbox-input {
          width: 20px;
          height: 20px;
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 0.125rem;
          transition: all 0.3s ease;
          accent-color: #004E89;
        }

        .checkbox-input:checked {
          animation: bounce 0.4s ease-out;
        }

        .checkbox-label {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          line-height: 1.4;
          transition: all 0.3s ease;
        }

        .checkbox-group:hover .checkbox-label {
          color: #004E89;
        }

        /* ==================== ASSIGNMENT SECTION ==================== */
        .assignment-section {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          margin-top: 1rem;
          border: 2px solid #e2e8f0;
          animation: slideInLeft 0.4s ease-out;
          transition: all 0.3s ease;
        }

        .assignment-section:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        /* ==================== FORM ACTIONS ==================== */
        .form-actions {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          margin-top: 2rem;
          padding-top: 1.75rem;
          border-top: 2px solid #f1f5f9;
          width: 100%;
          animation: slideInLeft 0.5s ease-out 0.7s both;
        }

        .btn {
          width: 100%;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn:active::before {
          width: 300px;
          height: 300px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #004E89 0%, #003366 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 78, 137, 0.25);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 78, 137, 0.35);
        }

        .btn-primary:active {
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          border-color: #004E89;
          color: #004E89;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 78, 137, 0.15);
        }

        /* ==================== INFO BOX ==================== */
        .info-box {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-left: 4px solid #004E89;
          padding: 1.25rem;
          border-radius: 12px;
          margin-top: 1.5rem;
          animation: slideInRight 0.5s ease-out 0.65s both;
          transition: all 0.3s ease;
        }

        .info-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 78, 137, 0.12);
        }

        .info-box-title {
          font-weight: 700;
          color: #004E89;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
        }

        .info-box:hover .info-box-title {
          transform: translateX(3px);
        }

        .info-box-text {
          color: #475569;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .warning-text {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          line-height: 1.4;
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* ==================== RESPONSIVE DESIGN ==================== */
        @media (min-width: 1025px) {
          .create-loan-container {
            padding: 2rem;
            padding-top: 100px;
          }

          .form-card {
            padding: 2.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .form-section {
            margin-top: 2rem;
            padding-top: 2rem;
          }

          .form-actions {
            flex-direction: row;
            margin-top: 2.5rem;
            padding-top: 2rem;
          }

          .btn {
            flex: 1;
          }

          .form-header {
            margin-bottom: 2rem;
          }

          .form-input,
          .form-select {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 1024px) {
          .create-loan-container {
            padding: 1.75rem;
            padding-top: 90px;
          }

          .form-card {
            padding: 2rem;
          }

          .form-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }
        }

        @media (max-width: 768px) {
          .create-loan-container {
            padding: 1.25rem;
            padding-top: 75px;
          }

          .form-header {
            margin-bottom: 1.25rem;
            animation-delay: 0s;
          }

          .form-header h1 {
            font-size: 1.5rem;
          }

          .form-header p {
            font-size: 0.8rem;
          }

          .form-card {
            padding: 1.5rem;
            border-radius: 16px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-group {
            animation-delay: 0.2s;
          }

          .form-section {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            animation-delay: 0.35s;
          }

          .section-title {
            font-size: 1rem;
            margin-bottom: 1rem;
          }

          .section-icon {
            width: 28px;
            height: 28px;
            font-size: 0.875rem;
          }

          .checkbox-group {
            padding: 0.875rem;
            animation-delay: 0.4s;
          }

          .checkbox-label {
            font-size: 0.875rem;
          }

          .assignment-section {
            padding: 1.25rem;
          }

          .form-actions {
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1.75rem;
            padding-top: 1.5rem;
            animation-delay: 0.55s;
          }

          .btn {
            padding: 0.875rem 1.5rem;
            font-size: 0.9375rem;
            width: 100%;
          }

          .info-box {
            padding: 1rem;
            animation-delay: 0.45s;
          }

          .info-box-title {
            font-size: 0.875rem;
          }

          .info-box-text {
            font-size: 0.8125rem;
          }

          .form-input,
          .form-select {
            font-size: 0.9375rem;
          }
        }

        @media (max-width: 640px) {
          .create-loan-container {
            padding: 1rem;
            padding-top: 70px;
          }

          .form-header h1 {
            font-size: 1.375rem;
            margin-bottom: 0.375rem;
          }

          .form-header p {
            font-size: 0.75rem;
          }

          .form-card {
            padding: 1.25rem;
            border-radius: 14px;
          }

          .form-grid {
            gap: 0.875rem;
            margin-bottom: 1rem;
          }

          .form-group {
            gap: 0.375rem;
          }

          .form-label {
            font-size: 0.8125rem;
          }

          .form-input,
          .form-select {
            padding: 0.75rem 0.875rem;
            font-size: 0.875rem;
            border-radius: 10px;
          }

          .input-icon-symbol {
            left: 0.875rem;
            font-size: 1rem;
          }

          .input-icon .form-input {
            padding-left: 2.5rem;
          }

          .section-title {
            font-size: 0.95rem;
            margin-bottom: 0.875rem;
            gap: 0.375rem;
          }

          .section-icon {
            width: 26px;
            height: 26px;
            font-size: 0.8rem;
          }

          .form-section {
            margin-top: 1.25rem;
            padding-top: 1.25rem;
          }

          .checkbox-group {
            padding: 0.75rem;
            gap: 0.625rem;
            margin-top: 0.75rem;
          }

          .checkbox-input {
            width: 18px;
            height: 18px;
          }

          .checkbox-label {
            font-size: 0.8125rem;
          }

          .assignment-section {
            padding: 1rem;
            margin-top: 0.75rem;
            border-radius: 10px;
          }

          .info-box {
            padding: 0.875rem;
            margin-top: 1rem;
            border-radius: 10px;
          }

          .info-box-title {
            font-size: 0.8125rem;
            margin-bottom: 0.375rem;
          }

          .info-box-text {
            font-size: 0.75rem;
          }

          .warning-text {
            font-size: 0.75rem;
            margin-top: 0.375rem;
          }

          .form-actions {
            gap: 0.625rem;
            margin-top: 1.5rem;
            padding-top: 1.25rem;
          }

          .btn {
            padding: 0.75rem 1.25rem;
            font-size: 0.875rem;
            border-radius: 10px;
            gap: 0.375rem;
          }

          .btn span:first-child {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .create-loan-container {
            padding: 0.75rem;
            padding-top: 65px;
          }

          .form-header {
            margin-bottom: 1rem;
          }

          .form-header h1 {
            font-size: 1.25rem;
            letter-spacing: 0;
          }

          .form-header p {
            font-size: 0.7rem;
          }

          .form-card {
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
          }

          .form-grid {
            gap: 0.75rem;
            margin-bottom: 0.875rem;
          }

          .form-group {
            gap: 0.25rem;
          }

          .form-label {
            font-size: 0.75rem;
            font-weight: 600;
          }

          .form-input,
          .form-select {
            padding: 0.625rem 0.75rem;
            font-size: 0.8125rem;
            border-radius: 8px;
          }

          .input-icon-symbol {
            left: 0.625rem;
            font-size: 0.9rem;
          }

          .input-icon .form-input {
            padding-left: 2.25rem;
          }

          .section-title {
            font-size: 0.875rem;
            margin-bottom: 0.75rem;
            gap: 0.25rem;
          }

          .section-icon {
            width: 24px;
            height: 24px;
            font-size: 0.75rem;
          }

          .form-section {
            margin-top: 1rem;
            padding-top: 1rem;
          }

          .checkbox-group {
            padding: 0.625rem;
            gap: 0.5rem;
            margin-top: 0.625rem;
          }

          .checkbox-input {
            width: 16px;
            height: 16px;
            margin-top: 0.125rem;
          }

          .checkbox-label {
            font-size: 0.75rem;
            line-height: 1.3;
          }

          .assignment-section {
            padding: 0.875rem;
            margin-top: 0.625rem;
            border-radius: 8px;
            border-width: 1px;
          }

          .info-box {
            padding: 0.75rem;
            margin-top: 0.875rem;
            border-radius: 8px;
            border-left-width: 3px;
          }

          .info-box-title {
            font-size: 0.75rem;
            margin-bottom: 0.25rem;
          }

          .info-box-text {
            font-size: 0.7rem;
            line-height: 1.4;
          }

          .warning-text {
            font-size: 0.7rem;
            margin-top: 0.25rem;
          }

          .form-actions {
            gap: 0.5rem;
            margin-top: 1.25rem;
            padding-top: 1rem;
          }

          .btn {
            padding: 0.625rem 1rem;
            font-size: 0.8rem;
            border-radius: 8px;
            gap: 0.25rem;
          }

          .btn span {
            display: block;
          }

          .btn span:first-child {
            font-size: 0.9rem;
          }

          .btn span:last-child {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 360px) {
          .create-loan-container {
            padding: 0.5rem;
            padding-top: 60px;
          }

          .form-header h1 {
            font-size: 1.125rem;
          }

          .form-card {
            padding: 0.75rem;
          }

          .form-grid {
            gap: 0.625rem;
          }

          .form-input,
          .form-select {
            padding: 0.5rem 0.625rem;
            font-size: 0.75rem;
          }

          .btn {
            padding: 0.5rem 0.875rem;
            font-size: 0.75rem;
          }

          .section-icon {
            width: 22px;
            height: 22px;
            font-size: 0.7rem;
          }
        }
      `}</style>

      <div className="create-loan-container">
        <div className="create-loan-wrapper">
          <div className="form-header">
            <h1>Create Loan File</h1>
            <p>Enter loan details and optionally assign to a bank executive</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-card">
              {/* Customer Information */}
              <div className="section-title">
                <div className="section-icon">👤</div>
                Customer Information
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Customer Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-icon">
                    <span className="input-icon-symbol">✉️</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="customer@example.com"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="input-icon">
                    <span className="input-icon-symbol">📞</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="form-section">
                <div className="section-title">
                  <div className="section-icon">💰</div>
                  Loan Details
                </div>

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
                      required
                    >
                      <option value="">Select loan type</option>
                      <option value="Home Loan">🏠 Home Loan</option>
                      <option value="Vehicle Loan">🚗 Vehicle Loan</option>
                      <option value="Personal Loan">👤 Personal Loan</option>
                      <option value="Business Loan">💼 Business Loan</option>
                      <option value="Education Loan">🎓 Education Loan</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Loan Amount <span className="required">*</span>
                    </label>
                    <div className="input-icon">
                      <span className="input-icon-symbol">₹</span>
                      <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Enter loan amount"
                        className="form-input"
                        required
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bank Partner</label>
                    <select
                      name="bankName"
                      value={form.bankName}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select bank</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="Axis">Axis Bank</option>
                      <option value="Kotak">Kotak Mahindra Bank</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="In-Process">⏳ In-Process</option>
                      <option value="Is-Disbursement">💰 Is-Disbursement</option>
                      <option value="Completed">✅ Completed</option>
                      <option value="Rejected">❌ Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Executive Assignment */}
              <div className="form-section">
                <div className="section-title">
                  <div className="section-icon">👔</div>
                  Executive Assignment (Optional)
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="autoAssign"
                    className="checkbox-input"
                    checked={autoAssign}
                    onChange={(e) => setAutoAssign(e.target.checked)}
                  />
                  <label htmlFor="autoAssign" className="checkbox-label">
                    Assign to bank executive immediately
                  </label>
                </div>

                {autoAssign && (
                  <div className="assignment-section">
                    <div className="form-group">
                      <label className="form-label">
                        Select Bank Executive
                      </label>
                      <select
                        name="assignToExecutive"
                        value={form.assignToExecutive}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">-- Choose an executive --</option>
                        {executives.map((exec) => (
                          <option key={exec.id} value={exec.id}>
                            {exec.name} - {exec.email}
                          </option>
                        ))}
                      </select>
                      {executives.length === 0 && (
                        <p className="warning-text">
                          ⚠️ No bank executives available. Create users with "Bank Executive" role first.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="info-box">
                <div className="info-box-title">
                  <span>💡</span>
                  Quick Tip
                </div>
                <p className="info-box-text">
                  You can assign this loan to a bank executive now or do it later from the Executive Assignment page. 
                  If you assign now, the executive will immediately see this loan in their dashboard.
                </p>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <span>✓</span>
                  <span>Create Loan File</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                >
                  <span>←</span>
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateLoan;
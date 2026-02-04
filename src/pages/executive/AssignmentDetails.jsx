import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const AssignmentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  /* ---------------- LOAD ASSIGNMENT ---------------- */
  useEffect(() => {
    const allAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    const foundAssignment = allAssignments.find((a) => a.id === id);
    
    if (foundAssignment) {
      setAssignment(foundAssignment);
      setNewStatus(foundAssignment.assignment_status);
    }
  }, [id]);

  /* ---------------- FORMAT CURRENCY ---------------- */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const handleUpdateStatus = () => {
    const allAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    const updatedAssignments = allAssignments.map((a) => {
      if (a.id === id) {
        return { ...a, assignment_status: newStatus };
      }
      return a;
    });

    localStorage.setItem("executiveAssignments", JSON.stringify(updatedAssignments));
    
    alert("✅ Status updated successfully!");
    setShowUpdateModal(false);
    window.location.reload();
  };

  /* ---------------- DELETE ASSIGNMENT ---------------- */
  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    const allAssignments = JSON.parse(localStorage.getItem("executiveAssignments")) || [];
    const updatedAssignments = allAssignments.filter((a) => a.id !== id);

    localStorage.setItem("executiveAssignments", JSON.stringify(updatedAssignments));
    
    alert("✅ Assignment deleted successfully!");
    navigate("/admin/executive-assignment");
  };

  if (!assignment) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .assignment-details-container {
          font-family: 'Inter', sans-serif;
          padding: 2.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        /* Header */
        .page-header {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          margin-bottom: 2.5rem;
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.25);
          position: relative;
          overflow: hidden;
        }

        .page-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .header-content {
          position: relative;
          z-index: 1;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-4px);
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          margin: 0 0 0.75rem 0;
          letter-spacing: -0.03em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .assignment-id-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 0.95rem;
        }

        /* Content Layout */
        .content-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
        }

        /* Main Content */
        .main-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Info Card */
        .info-card {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .info-card-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .info-divider {
          grid-column: 1 / -1;
          height: 1px;
          background: linear-gradient(to right, transparent, #e2e8f0, transparent);
          margin: 1rem 0;
        }

        /* Sidebar */
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Status Card */
        .status-card {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          padding: 2rem;
          border-radius: 16px;
          color: white;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
        }

        .status-card-title {
          font-size: 0.875rem;
          font-weight: 700;
          opacity: 0.9;
          margin: 0 0 1.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-badge-large {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: 100%;
          justify-content: center;
        }

        .status-active {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          color: #065f46;
        }

        .status-pending {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #92400e;
        }

        .status-completed {
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          color: #4338ca;
        }

        /* Actions Card */
        .actions-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .actions-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1.5rem 0;
        }

        .action-btn {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .action-btn:last-child {
          margin-bottom: 0;
        }

        .btn-update {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-update:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .btn-back {
          background: linear-gradient(to right, #f8fafc, #ffffff);
          color: #475569;
          border: 2px solid #e2e8f0;
        }

        .btn-back:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
        }

        .btn-delete {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          color: #dc2626;
          border: 2px solid #fecaca;
        }

        .btn-delete:hover {
          background: linear-gradient(135deg, #fecaca, #fca5a5);
          transform: translateY(-2px);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .modal-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2rem 0;
        }

        .modal-form-group {
          margin-bottom: 2rem;
        }

        .modal-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .modal-select {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s;
          background: #f8fafc;
          color: #0f172a;
        }

        .modal-select:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
        }

        .modal-btn {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
        }

        .modal-btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .modal-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .modal-btn-secondary {
          background: #f1f5f9;
          color: #64748b;
        }

        .modal-btn-secondary:hover {
          background: #e2e8f0;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .content-layout {
            grid-template-columns: 1fr;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .assignment-details-container {
            padding: 1.5rem;
          }

          .page-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="assignment-details-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <button className="back-btn" onClick={() => navigate("/admin/executive-assignment")}>
              <span>←</span>
              <span>Back to Assignments</span>
            </button>
            <h1 className="page-title">📋 Assignment Details</h1>
            <div className="assignment-id-badge">{assignment.assignment_id}</div>
          </div>
        </div>

        <div className="content-layout">
          {/* Main Content */}
          <div className="main-content">
            {/* Customer & File Info */}
            <div className="info-card">
              <h2 className="info-card-title">
                <span>👤</span>
                <span>Customer & File Information</span>
              </h2>

              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">File ID</span>
                  <span className="info-value">{assignment.file_id}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Customer Name</span>
                  <span className="info-value">{assignment.customer_name}</span>
                </div>

                <div className="info-divider"></div>

                <div className="info-item">
                  <span className="info-label">Bank Name</span>
                  <span className="info-value">{assignment.bank_name}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Loan Type</span>
                  <span className="info-value">{assignment.loan_type}</span>
                </div>

                <div className="info-divider"></div>

                <div className="info-item">
                  <span className="info-label">Loan Amount</span>
                  <span className="info-value">{formatCurrency(assignment.loan_amount)}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Assigned Date</span>
                  <span className="info-value">{assignment.assigned_date}</span>
                </div>
              </div>
            </div>

            {/* Executive Info */}
            <div className="info-card">
              <h2 className="info-card-title">
                <span>👔</span>
                <span>Executive Information</span>
              </h2>

              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Executive Name</span>
                  <span className="info-value">{assignment.executive_name}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{assignment.executive_email}</span>
                </div>

                <div className="info-divider"></div>

                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{assignment.executive_phone}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Remarks</span>
                  <span className="info-value">{assignment.remarks || "No remarks"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Status Card */}
            <div className="status-card">
              <h3 className="status-card-title">Current Status</h3>
              <div className={`status-badge-large status-${assignment.assignment_status.toLowerCase()}`}>
                <span>●</span>
                <span>{assignment.assignment_status}</span>
              </div>
            </div>

            {/* Actions Card */}
            <div className="actions-card">
              <h3 className="actions-title">Quick Actions</h3>

              <button className="action-btn btn-update" onClick={() => setShowUpdateModal(true)}>
                <span>🔄</span>
                <span>Update Status</span>
              </button>

              <button
                className="action-btn btn-back"
                onClick={() => navigate("/admin/executive-assignment")}
              >
                <span>←</span>
                <span>Back to List</span>
              </button>

              <button className="action-btn btn-delete" onClick={handleDelete}>
                <span>🗑️</span>
                <span>Delete Assignment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Update Status Modal */}
        {showUpdateModal && (
          <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Update Assignment Status</h2>

              <div className="modal-form-group">
                <label className="modal-label">Select New Status</label>
                <select
                  className="modal-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="modal-actions">
                <button className="modal-btn modal-btn-primary" onClick={handleUpdateStatus}>
                  ✅ Update Status
                </button>
                <button
                  className="modal-btn modal-btn-secondary"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssignmentDetails;
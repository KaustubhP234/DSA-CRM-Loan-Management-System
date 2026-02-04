import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ActivityTimeline from "../../components/activity/ActivityTimeline";
import { addActivity } from "../../utils/activityService";
import { addNotification } from "../../utils/notificationService";

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loan, setLoan] = useState(null);

  useEffect(() => {
    const loans = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const found = loans.find((l) => String(l.id) === String(id));

    if (found) {
      setLoan(found);
      addActivity(found.id, "Loan details opened");
    }
  }, [id]);

  const updateStatus = (newStatus) => {
    const loans = JSON.parse(localStorage.getItem("loanFiles")) || [];

    const updatedLoans = loans.map((l) =>
      String(l.id) === String(id) ? { ...l, status: newStatus } : l
    );

    localStorage.setItem("loanFiles", JSON.stringify(updatedLoans));
    setLoan({ ...loan, status: newStatus });

    addActivity(id, `Status changed to ${newStatus}`);
    addNotification(`Loan #${id} status changed to ${newStatus}`);
  };

  const deleteLoan = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this loan?\nThis action can be undone by changing status."
    );

    if (!confirmDelete) return;

    const loans = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const updatedLoans = loans.map((l) =>
      String(l.id) === String(id) ? { ...l, status: "Deleted" } : l
    );

    localStorage.setItem("loanFiles", JSON.stringify(updatedLoans));

    addActivity(id, "Loan file deleted");
    addNotification(`Loan #${id} has been deleted`);

    navigate("/admin/loan-files");
  };

  if (!loan) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Loan not found</h2>
        <button onClick={() => navigate("/admin/loan-files")}>
          Back to Loan Files
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .loan-details-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .loan-details-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          color: #64748b;
          flex-wrap: wrap;
        }

        .breadcrumb a {
          color: #004E89;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
          cursor: pointer;
        }

        .breadcrumb a:hover {
          color: #003366;
        }

        .breadcrumb span {
          color: #94a3b8;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .header-content h1 {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
        }

        .loan-id-badge {
          display: inline-block;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          color: #475569;
          font-weight: 600;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .btn-edit {
          background: linear-gradient(135deg, #004E89, #003366);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 78, 137, 0.25);
        }

        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 78, 137, 0.35);
        }

        .btn-back {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn-back:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .info-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-icon {
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
        }

        .info-grid {
          display: grid;
          gap: 1.25rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
          gap: 1rem;
        }

        .info-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .info-value {
          font-size: 1rem;
          color: #1e293b;
          font-weight: 600;
          text-align: right;
          word-break: break-word;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          white-space: nowrap;
        }

        .status-in-process {
          background: rgba(255, 107, 53, 0.1);
          color: #FF6B35;
        }

        .status-is-disbursement {
          background: rgba(0, 78, 137, 0.1);
          color: #004E89;
        }

        .status-completed {
          background: rgba(31, 168, 131, 0.1);
          color: #1FA883;
        }

        .status-rejected {
          background: rgba(220, 38, 38, 0.1);
          color: #DC2626;
        }

        .actions-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .action-btn {
          width: 100%;
          padding: 0.875rem 1.25rem;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }

        .action-primary {
          background: linear-gradient(135deg, #004E89, #003366);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 78, 137, 0.25);
        }

        .action-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 78, 137, 0.35);
        }

        .action-success {
          background: linear-gradient(135deg, #1FA883, #16875e);
          color: white;
          box-shadow: 0 4px 12px rgba(31, 168, 131, 0.25);
        }

        .action-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(31, 168, 131, 0.35);
        }

        .action-danger {
          background: linear-gradient(135deg, #DC2626, #b91c1c);
          color: white;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
        }

        .action-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.35);
        }

        .action-delete {
          background: white;
          color: #DC2626;
          border: 2px solid #fecaca;
        }

        .action-delete:hover {
          background: #fef2f2;
          border-color: #fca5a5;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
          margin: 1rem 0;
        }

        .timeline-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .section-header {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .amount-display {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.25rem;
          color: #004E89;
          font-weight: 700;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .loan-details-container {
            padding: 1.5rem;
          }

          .content-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .loan-details-container {
            padding: 1rem;
          }

          .header-content h1 {
            font-size: 1.75rem;
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            flex-direction: row;
            width: 100%;
          }

          .btn {
            flex: 1;
            justify-content: center;
          }

          .info-card,
          .actions-card,
          .timeline-section {
            padding: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .loan-details-container {
            padding: 0.75rem;
          }

          .header-content h1 {
            font-size: 1.5rem;
          }

          .loan-id-badge {
            font-size: 0.8rem;
            padding: 0.375rem 0.75rem;
          }

          .breadcrumb {
            font-size: 0.8rem;
          }

          .info-row {
            flex-direction: column;
            gap: 0.5rem;
          }

          .info-label,
          .info-value {
            text-align: left;
          }

          .btn {
            padding: 0.625rem 1.25rem;
            font-size: 0.8125rem;
          }

          .action-btn {
            padding: 0.75rem 1rem;
            font-size: 0.8125rem;
          }

          .card-title {
            font-size: 1.125rem;
          }

          .section-header {
            font-size: 1.25rem;
          }

          .amount-display {
            font-size: 1.125rem;
          }
        }

        @media (max-width: 480px) {
          .header-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .info-card,
          .actions-card,
          .timeline-section {
            padding: 1.25rem;
          }
        }
      `}</style>

      <div className="loan-details-container">
        <div className="loan-details-wrapper">
          <div className="breadcrumb">
            <a onClick={() => navigate("/admin/dashboard")}>Dashboard</a>
            <span>›</span>
            <a onClick={() => navigate("/admin/loan-files")}>Loan Files</a>
            <span>›</span>
            <span>Loan Details</span>
          </div>

          <div className="page-header">
            <div className="header-content">
              <h1>Loan File Details</h1>
              <div className="loan-id-badge">ID: {loan.id}</div>
            </div>

            <div className="header-actions">
              <button
                className="btn btn-edit"
                onClick={() => navigate(`/admin/edit-loan/${loan.id}`)}
              >
                <span>✏️</span>
                <span>Edit</span>
              </button>
              <button className="btn btn-back" onClick={() => navigate(-1)}>
                <span>←</span>
                <span>Back</span>
              </button>
            </div>
          </div>

          <div className="content-grid">
            {/* Main Info Card */}
            <div className="info-card">
              <h2 className="card-title">
                <div className="card-icon">👤</div>
                Customer & Loan Information
              </h2>

              <div className="info-grid">
                <div className="info-row">
                  <span className="info-label">Customer Name</span>
                  <span className="info-value">{loan.name || "—"}</span>
                </div>

                {loan.email && (
                  <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value">{loan.email}</span>
                  </div>
                )}

                {loan.phone && (
                  <div className="info-row">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{loan.phone}</span>
                  </div>
                )}

                <div className="info-row">
                  <span className="info-label">Loan Type</span>
                  <span className="info-value">{loan.loanType}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">Loan Amount</span>
                  <span className="info-value">
                    <span className="amount-display">₹ {loan.amount}</span>
                  </span>
                </div>

                {loan.bankName && (
                  <div className="info-row">
                    <span className="info-label">Bank Partner</span>
                    <span className="info-value">{loan.bankName}</span>
                  </div>
                )}

                <div className="info-row">
                  <span className="info-label">Status</span>
                  <span className="info-value">
                    <span
                      className={`status-badge status-${loan.status
                        .toLowerCase()
                        .replace("-", "")}`}
                    >
                      <span>●</span>
                      <span>{loan.status}</span>
                    </span>
                  </span>
                </div>

                {loan.createdBy && (
                  <div className="info-row">
                    <span className="info-label">Created By</span>
                    <span className="info-value">{loan.createdBy}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="actions-card">
              <h2 className="card-title">
                <div className="card-icon">⚡</div>
                Quick Actions
              </h2>

              <div className="action-buttons">
                {loan.status === "In-Process" && (
                  <>
                    <button
                      className="action-btn action-primary"
                      onClick={() => updateStatus("Is-Disbursement")}
                    >
                      <span>💰</span>
                      <span>Move to Disbursement</span>
                    </button>

                    <button
                      className="action-btn action-danger"
                      onClick={() => updateStatus("Rejected")}
                    >
                      <span>❌</span>
                      <span>Reject Loan</span>
                    </button>
                  </>
                )}

                {loan.status === "Is-Disbursement" && (
                  <button
                    className="action-btn action-success"
                    onClick={() => updateStatus("Completed")}
                  >
                    <span>✅</span>
                    <span>Mark as Completed</span>
                  </button>
                )}

                {loan.status !== "Completed" && loan.status !== "Rejected" && (
                  <>
                    <div className="divider"></div>
                    <button
                      className="action-btn action-delete"
                      onClick={deleteLoan}
                    >
                      <span>🗑️</span>
                      <span>Delete Loan File</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="timeline-section">
            <h2 className="section-header">
              <span>📋</span>
              Activity Timeline
            </h2>
            <ActivityTimeline loanId={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanDetails;
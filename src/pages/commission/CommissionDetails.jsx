import { useState, useEffect } from "react";

const CommissionDetails = () => {
  // Get commission ID from URL (simulated with state for demo)
  const [commissionId] = useState("1"); // In real app, get from URL params
  const [commission, setCommission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load commission data from localStorage
    const commissions = JSON.parse(localStorage.getItem("commissions")) || [];
    const found = commissions.find((c) => String(c.id) === String(commissionId));
    setCommission(found);
    setLoading(false);
  }, [commissionId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Paid: { bg: "#ecfdf5", text: "#065f46", border: "#10b981", icon: "✅" },
      Pending: { bg: "#fef3c7", text: "#92400e", border: "#f59e0b", icon: "⏳" },
      Processing: { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6", icon: "🔄" },
    };
    return colors[status] || colors.Pending;
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this commission? This action cannot be undone.")) {
      const commissions = JSON.parse(localStorage.getItem("commissions")) || [];
      const filtered = commissions.filter((c) => c.id !== commission.id);
      localStorage.setItem("commissions", JSON.stringify(filtered));
      alert("Commission deleted successfully!");
      window.location.href = "/admin/commission";
    }
  };

  const handleMarkAsPaid = () => {
    const paymentMode = prompt("Select Payment Mode:\n1. Bank Transfer\n2. UPI\n3. Cash\n4. Cheque");
    if (!paymentMode) return;
    const modes = { "1": "Bank Transfer", "2": "UPI", "3": "Cash", "4": "Cheque" };
    const mode = modes[paymentMode] || "Bank Transfer";
    
    const commissions = JSON.parse(localStorage.getItem("commissions")) || [];
    const idx = commissions.findIndex((c) => c.id === commission.id);
    if (idx !== -1) {
      commissions[idx] = {
        ...commissions[idx],
        payment_status: "Paid",
        payment_mode: mode,
        payment_date: new Date().toISOString().split("T")[0],
        remarks: `Paid via ${mode}`,
      };
      localStorage.setItem("commissions", JSON.stringify(commissions));
      alert("✅ Commission marked as paid!");
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8fafc" }}>
        <div style={{ fontSize: "18px", color: "#64748b" }}>Loading...</div>
      </div>
    );
  }

  if (!commission) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8fafc" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>❌</div>
        <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Commission Not Found</div>
        <button
          onClick={() => (window.location.href = "/admin/commission")}
          style={{
            marginTop: "16px",
            padding: "12px 24px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Back to Commission List
        </button>
      </div>
    );
  }

  const statusColor = getStatusColor(commission.payment_status);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .details-container {
          padding: 32px;
          background: #f8fafc;
          min-height: 100vh;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-section {
          margin-bottom: 32px;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 20px;
        }

        .back-button:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .title-section h1 {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .commission-id-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          font-family: 'JetBrains Mono', monospace;
        }

        .status-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-badge-large {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          border: 2px solid;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-pay {
          background: #10b981;
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }

        .btn-pay:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .btn-delete {
          background: #ef4444;
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
        }

        .btn-delete:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 28px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
        }

        .info-grid {
          display: grid;
          gap: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
        }

        .info-value.large {
          font-size: 20px;
          font-weight: 800;
        }

        .info-value.mono {
          font-family: 'JetBrains Mono', monospace;
        }

        .info-value.highlight {
          color: #10b981;
          font-size: 18px;
        }

        .commission-highlight {
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 12px;
          padding: 28px;
          color: white;
          text-align: center;
          margin-bottom: 24px;
        }

        .commission-highlight-label {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.9;
          margin-bottom: 12px;
        }

        .commission-highlight-amount {
          font-size: 48px;
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 12px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .commission-highlight-details {
          font-size: 14px;
          opacity: 0.9;
          font-family: 'JetBrains Mono', monospace;
        }

        .payment-info {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
        }

        .payment-info-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .timeline {
          position: relative;
          padding-left: 32px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: #e2e8f0;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 24px;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-dot {
          position: absolute;
          left: -28px;
          top: 4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10b981;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #10b981;
        }

        .timeline-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .timeline-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .timeline-value {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }

        .remarks-section {
          background: #fffbeb;
          border: 2px solid #fbbf24;
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
        }

        .remarks-title {
          font-size: 14px;
          font-weight: 700;
          color: #92400e;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .remarks-text {
          font-size: 14px;
          color: #78350f;
          line-height: 1.6;
        }

        @media (max-width: 968px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 20px;
          }

          .action-buttons {
            width: 100%;
          }

          .btn {
            flex: 1;
          }
        }
      `}</style>

      <div className="details-container">
        {/* Header */}
        <div className="header-section">
          <button className="back-button" onClick={() => (window.location.href = "/admin/commission")}>
            <span>←</span>
            Back to Commissions
          </button>

          <div className="header-content">
            <div className="title-section">
              <h1>Commission Details</h1>
              <div className="commission-id-badge">
                <span>🆔</span>
                {commission.commission_id}
              </div>
            </div>

            <div className="status-section">
              <span
                className="status-badge-large"
                style={{
                  background: statusColor.bg,
                  color: statusColor.text,
                  borderColor: statusColor.border,
                }}
              >
                <span>{statusColor.icon}</span>
                {commission.payment_status}
              </span>
              <div className="action-buttons">
                {commission.payment_status === "Pending" && (
                  <button className="btn btn-pay" onClick={handleMarkAsPaid}>
                    <span>💳</span>
                    Mark as Paid
                  </button>
                )}
                <button className="btn btn-delete" onClick={handleDelete}>
                  <span>🗑️</span>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Amount Highlight */}
        <div className="commission-highlight">
          <div className="commission-highlight-label">💰 Commission Amount</div>
          <div className="commission-highlight-amount">{formatCurrency(commission.commission_amount)}</div>
          <div className="commission-highlight-details">
            {formatCurrency(commission.loan_amount)} × {commission.commission_percentage}%
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Left Column */}
          <div>
            {/* Customer & Loan Information */}
            <div className="card">
              <h2 className="card-title">Customer & Loan Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Customer Name</span>
                  <span className="info-value large">{commission.customer_name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">File ID</span>
                  <span className="info-value mono">{commission.file_id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Bank Name</span>
                  <span className="info-value">{commission.bank_name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Loan Type</span>
                  <span className="info-value">{commission.loan_type}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Loan Amount</span>
                  <span className="info-value highlight mono">{formatCurrency(commission.loan_amount)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Commission Rate</span>
                  <span className="info-value">{commission.commission_percentage}%</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {commission.payment_status === "Paid" && (
              <div className="payment-info">
                <div className="payment-info-title">
                  <span>💳</span>
                  Payment Information
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Payment Date</span>
                    <span className="info-value">{formatDate(commission.payment_date)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Payment Mode</span>
                    <span className="info-value">{commission.payment_mode || "N/A"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Remarks */}
            {commission.remarks && (
              <div className="remarks-section">
                <div className="remarks-title">
                  <span>📝</span>
                  Remarks
                </div>
                <p className="remarks-text">{commission.remarks}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* Timeline */}
            <div className="card">
              <h2 className="card-title">Timeline</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-label">Disbursement Date</span>
                    <span className="timeline-value">{formatDate(commission.disbursement_date)}</span>
                  </div>
                </div>
                {commission.payment_date && (
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-label">Payment Date</span>
                      <span className="timeline-value">{formatDate(commission.payment_date)}</span>
                    </div>
                  </div>
                )}
                <div className="timeline-item">
                  <div className="timeline-dot" style={{ background: "#6366f1", boxShadow: "0 0 0 2px #6366f1" }}></div>
                  <div className="timeline-content">
                    <span className="timeline-label">Assigned To</span>
                    <span className="timeline-value">{commission.assigned_to}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="card" style={{ marginTop: "24px" }}>
              <h2 className="card-title">Commission Summary</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Commission ID</span>
                  <span className="info-value mono">{commission.commission_id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Percentage</span>
                  <span className="info-value">{commission.commission_percentage}%</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Amount</span>
                  <span className="info-value highlight mono">{formatCurrency(commission.commission_amount)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className="info-value">{commission.payment_status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommissionDetails;
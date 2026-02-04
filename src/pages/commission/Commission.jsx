import { useState, useEffect } from "react";

const Commission = () => {
  const defaultCommissions = [
    {
      id: 1,
      commission_id: "COM001",
      file_id: "1767247481626",
      customer_name: "Kaustubh Somnath Pawar",
      bank_name: "HDFC Bank",
      loan_type: "Personal Loan",
      loan_amount: 500000,
      commission_percentage: 2.5,
      commission_amount: 12500,
      payment_status: "Paid",
      payment_date: "2025-01-20",
      payment_mode: "Bank Transfer",
      assigned_to: "Admin User",
      disbursement_date: "2025-01-15",
      remarks: "Commission paid successfully",
    },
    {
      id: 2,
      commission_id: "COM002",
      file_id: "1767169783336",
      customer_name: "Mina Somnath Pawar",
      bank_name: "ICICI Bank",
      loan_type: "Vehicle Loan",
      loan_amount: 800000,
      commission_percentage: 2.0,
      commission_amount: 16000,
      payment_status: "Pending",
      payment_date: null,
      payment_mode: null,
      assigned_to: "Admin User",
      disbursement_date: "2025-01-18",
      remarks: "Awaiting disbursement confirmation",
    },
    {
      id: 3,
      commission_id: "COM003",
      file_id: "1767155968881",
      customer_name: "Sakshi Niphade",
      bank_name: "State Bank of India",
      loan_type: "Home Loan",
      loan_amount: 2500000,
      commission_percentage: 1.5,
      commission_amount: 37500,
      payment_status: "Processing",
      payment_date: null,
      payment_mode: null,
      assigned_to: "Admin User",
      disbursement_date: "2025-01-10",
      remarks: "Payment in process",
    },
    {
      id: 4,
      commission_id: "COM004",
      file_id: "1767155383885",
      customer_name: "Kaustubh Somnath Pawar",
      bank_name: "Axis Bank",
      loan_type: "Business Loan",
      loan_amount: 1500000,
      commission_percentage: 3.0,
      commission_amount: 45000,
      payment_status: "Paid",
      payment_date: "2025-01-22",
      payment_mode: "UPI",
      assigned_to: "Admin User",
      disbursement_date: "2025-01-12",
      remarks: "Commission disbursed via UPI",
    },
  ];

  useEffect(() => {
    const existing = localStorage.getItem("commissions");
    if (!existing) {
      localStorage.setItem("commissions", JSON.stringify(defaultCommissions));
    }
  }, []);

  const allCommissions = JSON.parse(localStorage.getItem("commissions")) || [];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredCommissions = allCommissions.filter((comm) => {
    const matchesSearch =
      comm.commission_id?.toLowerCase().includes(search.toLowerCase()) ||
      comm.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      comm.bank_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || comm.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: allCommissions.reduce((sum, c) => sum + c.commission_amount, 0),
    paid: allCommissions.filter((c) => c.payment_status === "Paid").reduce((sum, c) => sum + c.commission_amount, 0),
    pending: allCommissions.filter((c) => c.payment_status === "Pending").reduce((sum, c) => sum + c.commission_amount, 0),
    count: {
      paid: allCommissions.filter((c) => c.payment_status === "Paid").length,
      pending: allCommissions.filter((c) => c.payment_status === "Pending").length,
      processing: allCommissions.filter((c) => c.payment_status === "Processing").length,
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleMarkAsPaid = (commissionId) => {
    const paymentMode = prompt("Select Payment Mode:\n1. Bank Transfer\n2. UPI\n3. Cash\n4. Cheque");
    if (!paymentMode) return;
    const modes = { "1": "Bank Transfer", "2": "UPI", "3": "Cash", "4": "Cheque" };
    const mode = modes[paymentMode] || "Bank Transfer";
    const commissions = JSON.parse(localStorage.getItem("commissions")) || [];
    const idx = commissions.findIndex((c) => c.id === commissionId);
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

  const getStatusColor = (status) => {
    const colors = {
      Paid: { bg: "#ecfdf5", text: "#065f46", border: "#10b981" },
      Pending: { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" },
      Processing: { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6" },
    };
    return colors[status] || colors.Pending;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .commission-container {
          padding: 32px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .header-content h1 {
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .header-content p {
          font-size: 15px;
          color: #64748b;
        }

        .add-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
          transition: all 0.3s ease;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
        }

        /* Stats Cards - Single Row */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          background: #f1f5f9;
          color: #475569;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        /* Filters */
        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          margin-bottom: 24px;
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .search-wrapper {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .filter-select {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          min-width: 160px;
          transition: all 0.3s;
        }

        .filter-select:focus {
          outline: none;
          border-color: #10b981;
        }

        /* Table */
        .table-container {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }

        th {
          padding: 16px 20px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        tbody tr {
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s;
        }

        tbody tr:hover {
          background: #f8fafc;
        }

        td {
          padding: 20px;
          font-size: 14px;
          color: #334155;
        }

        .commission-id {
          font-weight: 700;
          color: #0f172a;
          font-family: 'Monaco', 'Menlo', monospace;
        }

        .customer-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .customer-name {
          font-weight: 600;
          color: #0f172a;
        }

        .customer-id {
          font-size: 12px;
          color: #94a3b8;
        }

        .loan-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .loan-type {
          font-weight: 600;
          color: #0f172a;
        }

        .loan-amount {
          font-size: 13px;
          color: #64748b;
          font-family: 'Monaco', monospace;
        }

        .commission-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .commission-amount {
          font-size: 18px;
          font-weight: 800;
          color: #10b981;
          font-family: 'Monaco', monospace;
        }

        .commission-rate {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .status-badge {
          display: inline-flex;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-view {
          background: #f8fafc;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .btn-view:hover {
          background: #f1f5f9;
        }

        .btn-pay {
          background: #10b981;
          color: white;
        }

        .btn-pay:hover {
          background: #059669;
        }

        .empty-state {
          padding: 80px 20px;
          text-align: center;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .empty-text {
          font-size: 14px;
          color: #64748b;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .commission-container {
            padding: 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            gap: 16px;
          }

          .filters-section {
            flex-direction: column;
          }

          .table-container {
            overflow-x: auto;
          }
        }
      `}</style>

      <div className="commission-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Commission Management</h1>
            <p>Track and manage commission payments efficiently</p>
          </div>
          <button className="add-btn" onClick={() => (window.location.href = "/admin/add-commission")}>
            <span style={{ fontSize: "20px" }}>+</span>
            Add Commission
          </button>
        </div>

        {/* Stats Cards - Single Row */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: "rgba(139, 92, 246, 0.1)" }}>
                💰
              </div>
            </div>
            <div className="stat-label">Total Commission</div>
            <div className="stat-value">{formatCurrency(stats.total)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
                ✅
              </div>
              <div className="stat-badge">{stats.count.paid} paid</div>
            </div>
            <div className="stat-label">Paid Amount</div>
            <div className="stat-value">{formatCurrency(stats.paid)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                ⏳
              </div>
              <div className="stat-badge">{stats.count.pending} pending</div>
            </div>
            <div className="stat-label">Pending Amount</div>
            <div className="stat-value">{formatCurrency(stats.pending)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: "rgba(59, 130, 246, 0.1)" }}>
                📈
              </div>
            </div>
            <div className="stat-label">Success Rate</div>
            <div className="stat-value">
              {allCommissions.length > 0 ? Math.round((stats.count.paid / allCommissions.length) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by commission ID, customer, or bank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Bank</th>
                <th>Loan Details</th>
                <th>Commission</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <div className="empty-icon">📊</div>
                      <div className="empty-title">No commissions found</div>
                      <div className="empty-text">Try adjusting your search or filters</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCommissions.map((comm) => {
                  const statusColor = getStatusColor(comm.payment_status);
                  return (
                    <tr key={comm.id}>
                      <td>
                        <span className="commission-id">{comm.commission_id}</span>
                      </td>
                      <td>
                        <div className="customer-info">
                          <span className="customer-name">{comm.customer_name}</span>
                          <span className="customer-id">ID: {comm.file_id}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500 }}>{comm.bank_name}</span>
                      </td>
                      <td>
                        <div className="loan-info">
                          <span className="loan-type">{comm.loan_type}</span>
                          <span className="loan-amount">{formatCurrency(comm.loan_amount)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="commission-info">
                          <span className="commission-amount">{formatCurrency(comm.commission_amount)}</span>
                          <span className="commission-rate">{comm.commission_percentage}% rate</span>
                        </div>
                      </td>
                      <td>{comm.disbursement_date}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            background: statusColor.bg,
                            color: statusColor.text,
                            borderColor: statusColor.border,
                          }}
                        >
                          {comm.payment_status}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-view" onClick={() => (window.location.href = `/admin/commission/${comm.id}`)}>
                            View
                          </button>
                          {comm.payment_status === "Pending" && (
                            <button className="btn btn-pay" onClick={() => handleMarkAsPaid(comm.id)}>
                              Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Commission;
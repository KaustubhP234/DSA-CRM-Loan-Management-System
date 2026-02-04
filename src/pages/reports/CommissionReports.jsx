    import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CommissionReports = () => {
  const navigate = useNavigate();

  /* ---------------- LOAD DATA ---------------- */
  const [commissions, setCommissions] = useState([]);
  const [filteredCommissions, setFilteredCommissions] = useState([]);

  /* ---------------- FILTERS ---------------- */
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    dateRange: "All",
    bank: "All",
  });

  /* ---------------- ANALYTICS ---------------- */
  const [analytics, setAnalytics] = useState({
    totalCommission: 0,
    paidCommission: 0,
    pendingCommission: 0,
    processingCommission: 0,
    totalCount: 0,
    paidCount: 0,
    pendingCount: 0,
    byBank: {},
    byStatus: {},
  });

  useEffect(() => {
    // Load commissions
    const commissionsData = JSON.parse(localStorage.getItem("commissions")) || [];
    setCommissions(commissionsData);
    setFilteredCommissions(commissionsData);

    // Calculate analytics
    calculateAnalytics(commissionsData);
  }, []);

  /* ---------------- CALCULATE ANALYTICS ---------------- */
  const calculateAnalytics = (data) => {
    const totalCommission = data.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
    const paidCommission = data
      .filter((c) => c.payment_status === "Paid")
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0);
    const pendingCommission = data
      .filter((c) => c.payment_status === "Pending")
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0);
    const processingCommission = data
      .filter((c) => c.payment_status === "Processing")
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0);

    const paidCount = data.filter((c) => c.payment_status === "Paid").length;
    const pendingCount = data.filter((c) => c.payment_status === "Pending").length;

    // By bank
    const byBank = {};
    data.forEach((c) => {
      const bank = c.bank_name || "Unknown";
      byBank[bank] = (byBank[bank] || 0) + (c.commission_amount || 0);
    });

    // By status
    const byStatus = {
      Paid: paidCount,
      Pending: pendingCount,
      Processing: data.filter((c) => c.payment_status === "Processing").length,
    };

    setAnalytics({
      totalCommission,
      paidCommission,
      pendingCommission,
      processingCommission,
      totalCount: data.length,
      paidCount,
      pendingCount,
      byBank,
      byStatus,
    });
  };

  /* ---------------- APPLY FILTERS ---------------- */
  useEffect(() => {
    let filtered = [...commissions];

    // Search
    if (filters.search) {
      filtered = filtered.filter(
        (c) =>
          c.commission_id?.toLowerCase().includes(filters.search.toLowerCase()) ||
          c.customer_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          c.bank_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          c.file_id?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== "All") {
      filtered = filtered.filter((c) => c.payment_status === filters.status);
    }

    // Bank filter
    if (filters.bank !== "All") {
      filtered = filtered.filter((c) => c.bank_name === filters.bank);
    }

    setFilteredCommissions(filtered);
  }, [filters, commissions]);

  /* ---------------- FORMAT CURRENCY ---------------- */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /* ---------------- GET UNIQUE BANKS ---------------- */
  const uniqueBanks = [...new Set(commissions.map((c) => c.bank_name))];

  /* ---------------- EXPORT TO CSV ---------------- */
  const exportToCSV = () => {
    const headers = [
      "Commission ID",
      "Customer",
      "Bank",
      "Loan Type",
      "Loan Amount",
      "Commission %",
      "Commission Amount",
      "Status",
      "Payment Date",
    ];

    const csvData = filteredCommissions.map((c) => [
      c.commission_id,
      c.customer_name,
      c.bank_name,
      c.loan_type,
      c.loan_amount,
      c.commission_percentage,
      c.commission_amount,
      c.payment_status,
      c.payment_date || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `commission-report-${Date.now()}.csv`;
    link.click();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .commission-reports-container {
          font-family: 'Inter', sans-serif;
          padding: 2.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        /* Header */
        .reports-header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          margin-bottom: 2.5rem;
          box-shadow: 0 20px 60px rgba(245, 158, 11, 0.25);
          position: relative;
          overflow: hidden;
        }

        .reports-header::before {
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
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          flex: 1;
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
          margin-bottom: 1rem;
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
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.03em;
        }

        .page-subtitle {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.1rem;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          padding: 1rem 1.5rem;
          background: white;
          color: #f59e0b;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }

        /* Analytics Grid */
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .analytics-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          transition: all 0.3s;
        }

        .analytics-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }

        .analytics-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          background: var(--icon-color);
          color: white;
        }

        .analytics-card.total { --icon-color: linear-gradient(135deg, #f59e0b, #d97706); }
        .analytics-card.paid { --icon-color: linear-gradient(135deg, #10b981, #059669); }
        .analytics-card.pending { --icon-color: linear-gradient(135deg, #ef4444, #dc2626); }
        .analytics-card.processing { --icon-color: linear-gradient(135deg, #3b82f6, #2563eb); }

        .analytics-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .analytics-value {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          font-family: 'JetBrains Mono', monospace;
        }

        .analytics-subtext {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        /* Filters */
        .filters-card {
          background: white;
          padding: 1.75rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1rem;
        }

        .search-input,
        .filter-select {
          padding: 1rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s;
          background: #f8fafc;
          font-weight: 500;
        }

        .search-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #f59e0b;
          background: white;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
        }

        /* Charts */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        .chart-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }

        .chart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .chart-item:last-child {
          border-bottom: none;
        }

        .chart-label {
          font-weight: 600;
          color: #334155;
        }

        .chart-value {
          font-weight: 800;
          color: #0f172a;
          font-family: 'JetBrains Mono', monospace;
        }

        .chart-bar {
          height: 10px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          border-radius: 5px;
          margin-top: 0.5rem;
        }

        /* Table */
        .table-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .data-table th {
          padding: 1.25rem 1.5rem;
          text-align: left;
          font-size: 0.8rem;
          font-weight: 800;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .data-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-size: 0.95rem;
        }

        .data-table tbody tr:hover {
          background: linear-gradient(to right, #fffbeb, #ffffff);
        }

        .commission-id {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          color: #0f172a;
        }

        .commission-amount {
          font-size: 1.1rem;
          font-weight: 800;
          color: #f59e0b;
          font-family: 'JetBrains Mono', monospace;
        }

        .status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-paid {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          color: #065f46;
        }

        .status-pending {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #92400e;
        }

        .status-processing {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          color: #1e40af;
        }

        @media (max-width: 1200px) {
          .analytics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .filters-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .commission-reports-container {
            padding: 1.5rem;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 1.5rem;
          }
        }
      `}</style>

      <div className="commission-reports-container">
        {/* Header */}
        <div className="reports-header">
          <div className="header-content">
            <div className="header-left">
              <button className="back-btn" onClick={() => navigate("/admin/reports")}>
                <span>←</span>
                <span>Back to Reports</span>
              </button>
              <h1 className="page-title">💰 Commission Reports</h1>
              <p className="page-subtitle">Track commissions and payment status</p>
            </div>
            <div className="header-actions">
              <button className="action-btn" onClick={exportToCSV}>
                <span>📥</span>
                <span>Export CSV</span>
              </button>
              <button className="action-btn" onClick={() => window.print()}>
                <span>🖨️</span>
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="analytics-grid">
          <div className="analytics-card total">
            <div className="analytics-icon">💰</div>
            <div className="analytics-label">Total Commission</div>
            <div className="analytics-value">{formatCurrency(analytics.totalCommission)}</div>
            <div className="analytics-subtext">{analytics.totalCount} entries</div>
          </div>

          <div className="analytics-card paid">
            <div className="analytics-icon">✅</div>
            <div className="analytics-label">Paid Commission</div>
            <div className="analytics-value">{formatCurrency(analytics.paidCommission)}</div>
            <div className="analytics-subtext">{analytics.paidCount} paid</div>
          </div>

          <div className="analytics-card pending">
            <div className="analytics-icon">⏳</div>
            <div className="analytics-label">Pending Commission</div>
            <div className="analytics-value">{formatCurrency(analytics.pendingCommission)}</div>
            <div className="analytics-subtext">{analytics.pendingCount} pending</div>
          </div>

          <div className="analytics-card processing">
            <div className="analytics-icon">🔄</div>
            <div className="analytics-label">Processing</div>
            <div className="analytics-value">{formatCurrency(analytics.processingCommission)}</div>
            <div className="analytics-subtext">{analytics.byStatus.Processing || 0} processing</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <div className="filters-grid">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search by commission ID, customer, bank, file ID..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select
              className="filter-select"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
            </select>
            <select
              className="filter-select"
              value={filters.bank}
              onChange={(e) => setFilters({ ...filters, bank: e.target.value })}
            >
              <option value="All">All Banks</option>
              {uniqueBanks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            >
              <option value="All">All Time</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* By Bank */}
          <div className="chart-card">
            <h3 className="chart-title">Commission by Bank</h3>
            {Object.entries(analytics.byBank).map(([bank, amount]) => {
              const percentage = (amount / analytics.totalCommission) * 100;
              return (
                <div key={bank} className="chart-item">
                  <div>
                    <div className="chart-label">{bank}</div>
                    <div
                      className="chart-bar"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="chart-value">{formatCurrency(amount)}</div>
                </div>
              );
            })}
          </div>

          {/* By Status */}
          <div className="chart-card">
            <h3 className="chart-title">Commission by Status</h3>
            {Object.entries(analytics.byStatus).map(([status, count]) => {
              const percentage = (count / analytics.totalCount) * 100;
              return (
                <div key={status} className="chart-item">
                  <div>
                    <div className="chart-label">{status}</div>
                    <div
                      className="chart-bar"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="chart-value">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Commission ID</th>
                <th>Customer</th>
                <th>Bank</th>
                <th>Loan Type</th>
                <th>Loan Amount</th>
                <th>Commission %</th>
                <th>Commission Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.map((commission) => (
                <tr key={commission.id}>
                  <td className="commission-id">{commission.commission_id}</td>
                  <td>{commission.customer_name}</td>
                  <td>{commission.bank_name}</td>
                  <td>{commission.loan_type}</td>
                  <td>{formatCurrency(commission.loan_amount)}</td>
                  <td>{commission.commission_percentage}%</td>
                  <td className="commission-amount">
                    {formatCurrency(commission.commission_amount)}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${commission.payment_status.toLowerCase()}`}
                    >
                      {commission.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CommissionReports;
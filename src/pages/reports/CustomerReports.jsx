import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CustomerReports = () => {
  const navigate = useNavigate();

  /* ---------------- LOAD CUSTOMER DATA ---------------- */
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loanFiles, setLoanFiles] = useState([]);

  /* ---------------- FILTERS ---------------- */
  const [filters, setFilters] = useState({
    search: "",
    loanType: "All",
    dateRange: "All",
  });

  /* ---------------- ANALYTICS ---------------- */
  const [analytics, setAnalytics] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalLoans: 0,
    averageLoanAmount: 0,
    byLoanType: {},
    byCity: {},
  });

  useEffect(() => {
    // Load data
    const customersData = JSON.parse(localStorage.getItem("customers")) || [];
    const filesData = JSON.parse(localStorage.getItem("loanFiles")) || [];

    setCustomers(customersData);
    setLoanFiles(filesData);
    setFilteredCustomers(customersData);

    // Calculate analytics
    calculateAnalytics(customersData, filesData);
  }, []);

  /* ---------------- CALCULATE ANALYTICS ---------------- */
  const calculateAnalytics = (customersData, filesData) => {
    const totalCustomers = customersData.length;
    const activeCustomers = filesData.length; // Customers with files
    const totalLoans = filesData.length;

    // Average loan amount
    const totalAmount = filesData.reduce(
      (sum, file) => sum + (file.amount || file.loanAmount || 0),
      0
    );
    const averageLoanAmount = totalLoans > 0 ? totalAmount / totalLoans : 0;

    // By loan type
    const byLoanType = {};
    filesData.forEach((file) => {
      const type = file.loanType || file.loan_type || "Unknown";
      byLoanType[type] = (byLoanType[type] || 0) + 1;
    });

    // By city
    const byCity = {};
    customersData.forEach((customer) => {
      const city = customer.city || "Unknown";
      byCity[city] = (byCity[city] || 0) + 1;
    });

    setAnalytics({
      totalCustomers,
      activeCustomers,
      totalLoans,
      averageLoanAmount,
      byLoanType,
      byCity,
    });
  };

  /* ---------------- APPLY FILTERS ---------------- */
  useEffect(() => {
    let filtered = [...customers];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          customer.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
          customer.phone?.includes(filters.search) ||
          customer.city?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Loan type filter
    if (filters.loanType !== "All") {
      const customerIds = loanFiles
        .filter((file) => (file.loanType || file.loan_type) === filters.loanType)
        .map((file) => file.customerId || file.customer_id);
      filtered = filtered.filter((c) => customerIds.includes(c.id));
    }

    setFilteredCustomers(filtered);
  }, [filters, customers, loanFiles]);

  /* ---------------- FORMAT CURRENCY ---------------- */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /* ---------------- EXPORT TO CSV ---------------- */
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "City", "PAN", "Aadhar"];
    const csvData = filteredCustomers.map((c) => [
      c.name,
      c.email,
      c.phone,
      c.city || "",
      c.pan || "",
      c.aadhar || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `customer-report-${Date.now()}.csv`;
    link.click();
  };

  /* ---------------- PRINT REPORT ---------------- */
  const printReport = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .customer-reports-container {
          font-family: 'Inter', sans-serif;
          padding: 2.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        /* Header */
        .reports-header {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          margin-bottom: 2.5rem;
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.25);
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
          color: #3b82f6;
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

        /* Analytics Cards */
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

        .analytics-card.total { --icon-color: linear-gradient(135deg, #3b82f6, #2563eb); }
        .analytics-card.active { --icon-color: linear-gradient(135deg, #10b981, #059669); }
        .analytics-card.loans { --icon-color: linear-gradient(135deg, #f59e0b, #d97706); }
        .analytics-card.average { --icon-color: linear-gradient(135deg, #8b5cf6, #7c3aed); }

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
          grid-template-columns: 2fr 1fr 1fr;
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
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        /* Charts Section */
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
          padding: 0.875rem 0;
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
          height: 8px;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          border-radius: 4px;
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
          background: linear-gradient(135deg, #3b82f6, #2563eb);
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
          background: #f8fafc;
        }

        .customer-name {
          font-weight: 700;
          color: #0f172a;
        }

        @media (max-width: 1200px) {
          .analytics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .customer-reports-container {
            padding: 1.5rem;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 1.5rem;
          }
        }

        @media print {
          .filters-card,
          .header-actions,
          .back-btn {
            display: none;
          }
        }
      `}</style>

      <div className="customer-reports-container">
        {/* Header */}
        <div className="reports-header">
          <div className="header-content">
            <div className="header-left">
              <button className="back-btn" onClick={() => navigate("/admin/reports")}>
                <span>←</span>
                <span>Back to Reports</span>
              </button>
              <h1 className="page-title">👥 Customer Reports</h1>
              <p className="page-subtitle">Analyze customer data and demographics</p>
            </div>
            <div className="header-actions">
              <button className="action-btn" onClick={exportToCSV}>
                <span>📥</span>
                <span>Export CSV</span>
              </button>
              <button className="action-btn" onClick={printReport}>
                <span>🖨️</span>
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="analytics-grid">
          <div className="analytics-card total">
            <div className="analytics-icon">👥</div>
            <div className="analytics-label">Total Customers</div>
            <div className="analytics-value">{analytics.totalCustomers}</div>
          </div>

          <div className="analytics-card active">
            <div className="analytics-icon">✅</div>
            <div className="analytics-label">Active Customers</div>
            <div className="analytics-value">{analytics.activeCustomers}</div>
          </div>

          <div className="analytics-card loans">
            <div className="analytics-icon">📁</div>
            <div className="analytics-label">Total Loans</div>
            <div className="analytics-value">{analytics.totalLoans}</div>
          </div>

          <div className="analytics-card average">
            <div className="analytics-icon">💰</div>
            <div className="analytics-label">Avg Loan Amount</div>
            <div className="analytics-value">
              {formatCurrency(analytics.averageLoanAmount)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <div className="filters-grid">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search by name, email, phone, city..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select
              className="filter-select"
              value={filters.loanType}
              onChange={(e) => setFilters({ ...filters, loanType: e.target.value })}
            >
              <option value="All">All Loan Types</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Vehicle Loan">Vehicle Loan</option>
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
          {/* By Loan Type */}
          <div className="chart-card">
            <h3 className="chart-title">Customers by Loan Type</h3>
            {Object.entries(analytics.byLoanType).map(([type, count]) => (
              <div key={type} className="chart-item">
                <span className="chart-label">{type}</span>
                <span className="chart-value">{count}</span>
                <div
                  className="chart-bar"
                  style={{ width: `${(count / analytics.totalLoans) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>

          {/* By City */}
          <div className="chart-card">
            <h3 className="chart-title">Customers by City</h3>
            {Object.entries(analytics.byCity)
              .slice(0, 5)
              .map(([city, count]) => (
                <div key={city} className="chart-item">
                  <span className="chart-label">{city}</span>
                  <span className="chart-value">{count}</span>
                  <div
                    className="chart-bar"
                    style={{ width: `${(count / analytics.totalCustomers) * 100}%` }}
                  ></div>
                </div>
              ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>PAN</th>
                <th>Aadhar</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="customer-name">{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.city || "N/A"}</td>
                  <td>{customer.pan || "N/A"}</td>
                  <td>{customer.aadhar || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CustomerReports;
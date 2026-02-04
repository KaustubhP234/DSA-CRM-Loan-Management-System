import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MarketingReports = () => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const [reportData, setReportData] = useState({
    summary: {
      totalLeads: 0,
      convertedLeads: 0,
      totalFiles: 0,
      totalValue: 0,
      conversionRate: 0,
      avgDealSize: 0,
    },
    byBank: [],
    byLoanType: [],
    byStatus: [],
    byMonth: [],
    topCustomers: [],
  });

  useEffect(() => {
    generateReport();
  }, [dateRange]);

  const generateReport = () => {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const loanFiles = JSON.parse(localStorage.getItem("loanFiles")) || [];

    // Filter by date range
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    const filteredCustomers = customers.filter(c => {
      const date = new Date(c.date_of_registration || c.registrationDate || c.created_date);
      return date >= startDate && date <= endDate;
    });

    const filteredFiles = loanFiles.filter(f => {
      const date = new Date(f.createdAt || f.createdDate || f.date_of_registration);
      return date >= startDate && date <= endDate;
    });

    // Summary stats
    const totalLeads = filteredCustomers.length;
    const customerIds = new Set(filteredFiles.map(f => f.customerId || f.customer_id));
    const convertedLeads = customerIds.size;
    const totalFiles = filteredFiles.length;
    const totalValue = filteredFiles.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100) : 0;
    const avgDealSize = totalFiles > 0 ? totalValue / totalFiles : 0;

    // By Bank
    const bankStats = {};
    filteredFiles.forEach(file => {
      const bank = file.bankName || file.bank_name || "Unknown";
      if (!bankStats[bank]) {
        bankStats[bank] = { name: bank, files: 0, amount: 0 };
      }
      bankStats[bank].files++;
      bankStats[bank].amount += parseFloat(file.amount || 0);
    });
    const byBank = Object.values(bankStats).sort((a, b) => b.amount - a.amount);

    // By Loan Type
    const typeStats = {};
    filteredFiles.forEach(file => {
      const type = file.loanType || file.loan_type || "Unknown";
      if (!typeStats[type]) {
        typeStats[type] = { name: type, files: 0, amount: 0 };
      }
      typeStats[type].files++;
      typeStats[type].amount += parseFloat(file.amount || 0);
    });
    const byLoanType = Object.values(typeStats).sort((a, b) => b.amount - a.amount);

    // By Status
    const statusStats = {};
    filteredFiles.forEach(file => {
      const status = file.status || file.fileStatus || "Unknown";
      if (!statusStats[status]) {
        statusStats[status] = { name: status, files: 0, amount: 0 };
      }
      statusStats[status].files++;
      statusStats[status].amount += parseFloat(file.amount || 0);
    });
    const byStatus = Object.values(statusStats);

    // By Month (last 6 months within range)
    const monthStats = {};
    filteredFiles.forEach(file => {
      const date = new Date(file.createdAt || file.createdDate || file.date_of_registration);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthStats[monthKey]) {
        monthStats[monthKey] = { month: monthKey, files: 0, amount: 0 };
      }
      monthStats[monthKey].files++;
      monthStats[monthKey].amount += parseFloat(file.amount || 0);
    });
    const byMonth = Object.values(monthStats);

    // Top Customers
    const customerStats = {};
    filteredFiles.forEach(file => {
      const customerId = file.customerId || file.customer_id;
      if (!customerStats[customerId]) {
        const customer = customers.find(c => String(c.id) === String(customerId));
        customerStats[customerId] = {
          name: customer ? customer.name : "Unknown",
          files: 0,
          amount: 0,
        };
      }
      customerStats[customerId].files++;
      customerStats[customerId].amount += parseFloat(file.amount || 0);
    });
    const topCustomers = Object.values(customerStats)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    setReportData({
      summary: {
        totalLeads,
        convertedLeads,
        totalFiles,
        totalValue,
        conversionRate,
        avgDealSize,
      },
      byBank,
      byLoanType,
      byStatus,
      byMonth,
      topCustomers,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const exportReport = () => {
    const report = `
MARKETING REPORT
Date Range: ${dateRange.start} to ${dateRange.end}
Generated: ${new Date().toLocaleString()}

=== SUMMARY ===
Total Leads: ${reportData.summary.totalLeads}
Converted Leads: ${reportData.summary.convertedLeads}
Total Files: ${reportData.summary.totalFiles}
Total Value: ${formatCurrency(reportData.summary.totalValue)}
Conversion Rate: ${reportData.summary.conversionRate.toFixed(2)}%
Average Deal Size: ${formatCurrency(reportData.summary.avgDealSize)}

=== BY BANK ===
${reportData.byBank.map(b => `${b.name}: ${b.files} files, ${formatCurrency(b.amount)}`).join('\n')}

=== BY LOAN TYPE ===
${reportData.byLoanType.map(t => `${t.name}: ${t.files} files, ${formatCurrency(t.amount)}`).join('\n')}

=== BY STATUS ===
${reportData.byStatus.map(s => `${s.name}: ${s.files} files, ${formatCurrency(s.amount)}`).join('\n')}

=== TOP 10 CUSTOMERS ===
${reportData.topCustomers.map((c, i) => `${i + 1}. ${c.name}: ${c.files} files, ${formatCurrency(c.amount)}`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketing-report-${dateRange.start}-to-${dateRange.end}.txt`;
    a.click();
  };

  const printReport = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .reports-page {
          font-family: 'Inter', sans-serif;
          padding: 2rem;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header-left h1 {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
        }

        .header-left p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        .btn-secondary {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          border-color: #10b981;
          color: #10b981;
        }

        /* Date Range */
        .date-range-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 2px solid #e2e8f0;
        }

        .date-range-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .date-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 1rem;
          align-items: end;
        }

        .date-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .date-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .date-input {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.3s;
        }

        .date-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        /* Summary Stats */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 2px solid #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .summary-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--card-color);
        }

        .summary-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .summary-value {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0.5rem 0;
        }

        .summary-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 2px solid #e2e8f0;
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chart-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .chart-bar-container {
          flex: 1;
          background: #f1f5f9;
          border-radius: 6px;
          height: 40px;
          position: relative;
          overflow: hidden;
        }

        .chart-bar {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 6px;
          transition: width 0.5s ease;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .chart-label {
          min-width: 100px;
          font-weight: 600;
          color: #0f172a;
          font-size: 0.875rem;
        }

        .chart-value {
          min-width: 120px;
          text-align: right;
          font-weight: 700;
          color: #10b981;
          font-size: 0.875rem;
        }

        /* Table */
        .table-card {
          background: white;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          overflow: hidden;
        }

        .table-header {
          padding: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
        }

        .report-table thead th {
          text-align: left;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .report-table tbody td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.875rem;
          color: #475569;
        }

        .report-table tbody tr:hover {
          background: #f8fafc;
        }

        /* Print Styles */
        @media print {
          .header-actions,
          .btn,
          .page-header {
            display: none !important;
          }

          .reports-page {
            padding: 0;
            background: white;
          }

          .chart-card,
          .summary-card,
          .date-range-card {
            page-break-inside: avoid;
          }
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .reports-page {
            padding: 1rem;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .date-inputs {
            grid-template-columns: 1fr;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="reports-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <h1>📈 Marketing Reports</h1>
            <p>Generate and analyze marketing performance reports</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={printReport}>
              <span>🖨️</span>
              <span>Print</span>
            </button>
            <button className="btn btn-secondary" onClick={exportReport}>
              <span>📥</span>
              <span>Export</span>
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/marketing")}>
              <span>📊</span>
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div className="date-range-card">
          <h3 className="date-range-title">📅 Report Date Range</h3>
          <div className="date-inputs">
            <div className="date-group">
              <label className="date-label">Start Date</label>
              <input
                type="date"
                className="date-input"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="date-group">
              <label className="date-label">End Date</label>
              <input
                type="date"
                className="date-input"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" onClick={generateReport}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-card" style={{ '--card-color': '#10b981' }}>
            <div className="summary-icon">👥</div>
            <div className="summary-value">{reportData.summary.totalLeads}</div>
            <div className="summary-label">Total Leads</div>
          </div>
          <div className="summary-card" style={{ '--card-color': '#3b82f6' }}>
            <div className="summary-icon">✅</div>
            <div className="summary-value">{reportData.summary.convertedLeads}</div>
            <div className="summary-label">Converted Leads</div>
          </div>
          <div className="summary-card" style={{ '--card-color': '#8b5cf6' }}>
            <div className="summary-icon">📋</div>
            <div className="summary-value">{reportData.summary.totalFiles}</div>
            <div className="summary-label">Total Files</div>
          </div>
          <div className="summary-card" style={{ '--card-color': '#f59e0b' }}>
            <div className="summary-icon">💰</div>
            <div className="summary-value">{formatCurrency(reportData.summary.totalValue).split('.')[0]}</div>
            <div className="summary-label">Total Value</div>
          </div>
          <div className="summary-card" style={{ '--card-color': '#ec4899' }}>
            <div className="summary-icon">📊</div>
            <div className="summary-value">{reportData.summary.conversionRate.toFixed(1)}%</div>
            <div className="summary-label">Conversion Rate</div>
          </div>
          <div className="summary-card" style={{ '--card-color': '#06b6d4' }}>
            <div className="summary-icon">💵</div>
            <div className="summary-value">{formatCurrency(reportData.summary.avgDealSize).split('.')[0]}</div>
            <div className="summary-label">Avg Deal Size</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* By Bank */}
          <div className="chart-card">
            <h3 className="chart-title">
              <span>🏦</span>
              <span>Performance by Bank</span>
            </h3>
            <div className="chart-list">
              {reportData.byBank.slice(0, 5).map((bank, idx) => {
                const maxAmount = Math.max(...reportData.byBank.map(b => b.amount));
                const percentage = (bank.amount / maxAmount) * 100;
                return (
                  <div key={idx} className="chart-item">
                    <div className="chart-label">{bank.name}</div>
                    <div className="chart-bar-container">
                      <div className="chart-bar" style={{ width: `${percentage}%` }}>
                        {bank.files} files
                      </div>
                    </div>
                    <div className="chart-value">{formatCurrency(bank.amount)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Loan Type */}
          <div className="chart-card">
            <h3 className="chart-title">
              <span>💼</span>
              <span>Performance by Loan Type</span>
            </h3>
            <div className="chart-list">
              {reportData.byLoanType.slice(0, 5).map((type, idx) => {
                const maxAmount = Math.max(...reportData.byLoanType.map(t => t.amount));
                const percentage = (type.amount / maxAmount) * 100;
                return (
                  <div key={idx} className="chart-item">
                    <div className="chart-label">{type.name}</div>
                    <div className="chart-bar-container">
                      <div className="chart-bar" style={{ width: `${percentage}%` }}>
                        {type.files} files
                      </div>
                    </div>
                    <div className="chart-value">{formatCurrency(type.amount)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="table-card">
          <div className="table-header">
            <h3 className="chart-title">
              <span>🏆</span>
              <span>Top 10 Customers by Value</span>
            </h3>
          </div>
          <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Customer Name</th>
                <th>Files</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {reportData.topCustomers.map((customer, idx) => (
                <tr key={idx}>
                  <td><strong>#{idx + 1}</strong></td>
                  <td><strong>{customer.name}</strong></td>
                  <td>{customer.files}</td>
                  <td><strong>{formatCurrency(customer.amount)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MarketingReports;
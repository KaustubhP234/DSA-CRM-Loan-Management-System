import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ConvertedLeads = () => {
  const navigate = useNavigate();

  const [convertedLeads, setConvertedLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bankFilter, setBankFilter] = useState("all");
  const [loanTypeFilter, setLoanTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    loadConvertedLeads();
  }, []);

  useEffect(() => {
    filterAndSortLeads();
  }, [convertedLeads, searchTerm, bankFilter, loanTypeFilter, sortBy]);

  const loadConvertedLeads = () => {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const loanFiles = JSON.parse(localStorage.getItem("loanFiles")) || [];

    // Get only customers with files
    const converted = customers
      .map(customer => {
        const customerFiles = loanFiles.filter(f => 
          String(f.customerId || f.customer_id) === String(customer.id)
        );

        if (customerFiles.length === 0) return null;

        const totalAmount = customerFiles.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
        const latestFile = customerFiles.sort((a, b) => 
          new Date(b.createdAt || b.createdDate) - new Date(a.createdAt || a.createdDate)
        )[0];

        return {
          ...customer,
          fileCount: customerFiles.length,
          totalAmount,
          latestFile,
          files: customerFiles,
          bankName: latestFile?.bankName || latestFile?.bank_name || "N/A",
          loanType: latestFile?.loanType || latestFile?.loan_type || "N/A",
          status: latestFile?.status || latestFile?.fileStatus || "N/A",
        };
      })
      .filter(Boolean);

    setConvertedLeads(converted);
  };

  const filterAndSortLeads = () => {
    let result = [...convertedLeads];

    // Search filter
    if (searchTerm) {
      result = result.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.bankName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.loanType || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Bank filter
    if (bankFilter !== "all") {
      result = result.filter(lead => 
        (lead.bankName || "").toLowerCase() === bankFilter.toLowerCase()
      );
    }

    // Loan type filter
    if (loanTypeFilter !== "all") {
      result = result.filter(lead => 
        (lead.loanType || "").toLowerCase() === loanTypeFilter.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case "date-desc":
        result.sort((a, b) => new Date(b.latestFile.createdAt || b.latestFile.createdDate) - new Date(a.latestFile.createdAt || a.latestFile.createdDate));
        break;
      case "date-asc":
        result.sort((a, b) => new Date(a.latestFile.createdAt || a.latestFile.createdDate) - new Date(b.latestFile.createdAt || b.latestFile.createdDate));
        break;
      case "amount-desc":
        result.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "amount-asc":
        result.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case "files-desc":
        result.sort((a, b) => b.fileCount - a.fileCount);
        break;
      case "files-asc":
        result.sort((a, b) => a.fileCount - b.fileCount);
        break;
      default:
        break;
    }

    setFilteredLeads(result);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      "In-Process": { class: "badge-warning", icon: "⏳" },
      "Is-Disbursement": { class: "badge-info", icon: "💰" },
      "Completed": { class: "badge-success", icon: "✅" },
      "Rejected": { class: "badge-danger", icon: "❌" },
      "Pending": { class: "badge-pending", icon: "⏸️" },
    };

    const badge = statusMap[status] || { class: "badge-default", icon: "❓" };
    return (
      <span className={`badge ${badge.class}`}>
        {badge.icon} {status}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Contact", "Bank", "Loan Type", "Files", "Total Amount", "Status", "Latest File Date"];
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email || "N/A",
      lead.contact || lead.phone || "N/A",
      lead.bankName,
      lead.loanType,
      lead.fileCount,
      lead.totalAmount.toFixed(2),
      lead.status,
      lead.latestFile.createdAt || lead.latestFile.createdDate || "N/A",
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Get unique banks and loan types for filters
  const uniqueBanks = [...new Set(convertedLeads.map(l => l.bankName).filter(Boolean))];
  const uniqueLoanTypes = [...new Set(convertedLeads.map(l => l.loanType).filter(Boolean))];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .converted-leads-page {
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

        /* Stats */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 2px solid #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--stat-color);
        }

        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0.5rem 0;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Filters */
        .filters-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 2px solid #e2e8f0;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .filter-input,
        .filter-select {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.3s;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        /* Table */
        .leads-table-container {
          background: white;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          overflow: hidden;
        }

        .table-header {
          padding: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
        }

        .results-count {
          font-size: 0.875rem;
          color: #64748b;
        }

        .leads-table {
          width: 100%;
          border-collapse: collapse;
        }

        .leads-table thead th {
          text-align: left;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .leads-table tbody td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.875rem;
          color: #475569;
        }

        .leads-table tbody tr:hover {
          background: #f8fafc;
        }

        .lead-name {
          font-weight: 700;
          color: #0f172a;
        }

        .lead-email {
          color: #64748b;
          font-size: 0.8125rem;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .badge-success {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-info {
          background: #dbeafe;
          color: #1e40af;
        }

        .badge-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .badge-pending {
          background: #f3f4f6;
          color: #4b5563;
        }

        .badge-default {
          background: #e5e7eb;
          color: #6b7280;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.4;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .converted-leads-page {
            padding: 1rem;
          }

          .stats-row {
            grid-template-columns: 1fr;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="converted-leads-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <h1>✅ Converted Leads</h1>
            <p>View customers who have created loan files</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={exportToCSV}>
              <span>📥</span>
              <span>Export CSV</span>
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/marketing")}>
              <span>📊</span>
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card" style={{ '--stat-color': '#10b981' }}>
            <div className="stat-icon">✅</div>
            <div className="stat-value">{convertedLeads.length}</div>
            <div className="stat-label">Converted Leads</div>
          </div>
          <div className="stat-card" style={{ '--stat-color': '#3b82f6' }}>
            <div className="stat-icon">📋</div>
            <div className="stat-value">
              {convertedLeads.reduce((sum, l) => sum + l.fileCount, 0)}
            </div>
            <div className="stat-label">Total Files</div>
          </div>
          <div className="stat-card" style={{ '--stat-color': '#8b5cf6' }}>
            <div className="stat-icon">💰</div>
            <div className="stat-value">
              {formatCurrency(convertedLeads.reduce((sum, l) => sum + l.totalAmount, 0)).split('.')[0]}
            </div>
            <div className="stat-label">Total Value</div>
          </div>
          <div className="stat-card" style={{ '--stat-color': '#f59e0b' }}>
            <div className="stat-icon">📊</div>
            <div className="stat-value">
              {convertedLeads.length > 0 
                ? formatCurrency(convertedLeads.reduce((sum, l) => sum + l.totalAmount, 0) / convertedLeads.length).split('.')[0]
                : "₹0"}
            </div>
            <div className="stat-label">Avg. Value</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Search by name, email, bank..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Bank</label>
              <select
                className="filter-select"
                value={bankFilter}
                onChange={(e) => setBankFilter(e.target.value)}
              >
                <option value="all">All Banks</option>
                {uniqueBanks.map((bank, idx) => (
                  <option key={idx} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Loan Type</label>
              <select
                className="filter-select"
                value={loanTypeFilter}
                onChange={(e) => setLoanTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {uniqueLoanTypes.map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="amount-desc">Amount (High-Low)</option>
                <option value="amount-asc">Amount (Low-High)</option>
                <option value="files-desc">Files (Most)</option>
                <option value="files-asc">Files (Least)</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Actions</label>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.75rem', width: '100%' }}
                onClick={() => {
                  setSearchTerm("");
                  setBankFilter("all");
                  setLoanTypeFilter("all");
                  setSortBy("date-desc");
                }}
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="leads-table-container">
          <div className="table-header">
            <h3 className="table-title">Converted Leads</h3>
            <span className="results-count">
              Showing {filteredLeads.length} of {convertedLeads.length} converted leads
            </span>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No converted leads found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Bank</th>
                  <th>Loan Type</th>
                  <th>Files</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="lead-name">{lead.name}</div>
                      <div className="lead-email">{lead.email || "No email"}</div>
                    </td>
                    <td>{lead.contact || lead.phone || "N/A"}</td>
                    <td><strong>{lead.bankName}</strong></td>
                    <td>{lead.loanType}</td>
                    <td>
                      <span className="badge badge-info">{lead.fileCount} file(s)</span>
                    </td>
                    <td><strong>{formatCurrency(lead.totalAmount)}</strong></td>
                    <td>{getStatusBadge(lead.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ConvertedLeads;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AllLeads = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterAndSortLeads();
  }, [leads, searchTerm, statusFilter, sortBy]);

  const loadLeads = () => {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const loanFiles = JSON.parse(localStorage.getItem("loanFiles")) || [];

    // Enrich customers with file information
    const enrichedLeads = customers.map(customer => {
      const customerFiles = loanFiles.filter(f => 
        String(f.customerId || f.customer_id) === String(customer.id)
      );

      return {
        ...customer,
        hasFile: customerFiles.length > 0,
        fileCount: customerFiles.length,
        totalAmount: customerFiles.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0),
        latestFile: customerFiles.length > 0 
          ? customerFiles.sort((a, b) => new Date(b.createdAt || b.createdDate) - new Date(a.createdAt || a.createdDate))[0]
          : null,
      };
    });

    setLeads(enrichedLeads);
  };

  const filterAndSortLeads = () => {
    let result = [...leads];

    // Search filter
    if (searchTerm) {
      result = result.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.contact || "").includes(searchTerm) ||
        (lead.district || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter === "converted") {
      result = result.filter(lead => lead.hasFile);
    } else if (statusFilter === "pending") {
      result = result.filter(lead => !lead.hasFile);
    }

    // Sort
    switch (sortBy) {
      case "date-desc":
        result.sort((a, b) => new Date(b.date_of_registration || b.registrationDate) - new Date(a.date_of_registration || a.registrationDate));
        break;
      case "date-asc":
        result.sort((a, b) => new Date(a.date_of_registration || a.registrationDate) - new Date(b.date_of_registration || b.registrationDate));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "amount-desc":
        result.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "amount-asc":
        result.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      default:
        break;
    }

    setFilteredLeads(result);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Contact", "District", "Registration Date", "Status", "Files", "Total Amount"];
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email || "N/A",
      lead.contact || lead.phone || "N/A",
      lead.district || "N/A",
      lead.date_of_registration || lead.registrationDate || "N/A",
      lead.hasFile ? "Converted" : "Pending",
      lead.fileCount,
      lead.totalAmount.toFixed(2),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (lead) => {
    if (lead.hasFile) {
      return <span className="badge badge-success">✓ Converted</span>;
    }
    return <span className="badge badge-pending">⏳ Pending</span>;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .all-leads-page {
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

        /* Stats Cards */
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
          grid-template-columns: 2fr 1fr 1fr 1fr;
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
        }

        .badge-success {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-info {
          background: #dbeafe;
          color: #1e40af;
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
          .all-leads-page {
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

      <div className="all-leads-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <h1>👥 All Leads</h1>
            <p>Manage and track all customer leads</p>
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
            <div className="stat-label">Total Leads</div>
            <div className="stat-value">{leads.length}</div>
          </div>
          <div className="stat-card" style={{ '--stat-color': '#3b82f6' }}>
            <div className="stat-label">Converted</div>
            <div className="stat-value">{leads.filter(l => l.hasFile).length}</div>
          </div>
          <div className="stat-card" style={{ '--stat-color': '#f59e0b' }}>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{leads.filter(l => !l.hasFile).length}</div>
          </div>
          <div className="stat-card" style={{ '--stat-color': '#8b5cf6' }}>
            <div className="stat-label">Conversion Rate</div>
            <div className="stat-value">
              {leads.length > 0 ? ((leads.filter(l => l.hasFile).length / leads.length) * 100).toFixed(1) : 0}%
            </div>
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
                placeholder="Search by name, email, contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Leads</option>
                <option value="converted">Converted</option>
                <option value="pending">Pending</option>
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
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="amount-desc">Amount (High-Low)</option>
                <option value="amount-asc">Amount (Low-High)</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Actions</label>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.75rem', width: '100%' }}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
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
            <h3 className="table-title">Leads List</h3>
            <span className="results-count">
              Showing {filteredLeads.length} of {leads.length} leads
            </span>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No leads found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>District</th>
                  <th>Registration</th>
                  <th>Status</th>
                  <th>Files</th>
                  <th>Total Amount</th>
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
                    <td>{lead.district || "N/A"}</td>
                    <td>{lead.date_of_registration || lead.registrationDate || "N/A"}</td>
                    <td>{getStatusBadge(lead)}</td>
                    <td>
                      {lead.fileCount > 0 ? (
                        <span className="badge badge-info">{lead.fileCount} file(s)</span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td>
                      {lead.totalAmount > 0 ? (
                        <strong>{formatCurrency(lead.totalAmount)}</strong>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>-</span>
                      )}
                    </td>
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

export default AllLeads;
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Banks = () => {
  const navigate = useNavigate();

  /* ---------------- DEFAULT BANKS DATA ---------------- */
  const defaultBanks = [
    {
      id: 1,
      bank_name: "HDFC Bank",
      branch: "Connaught Place",
      ifsc_code: "HDFC0000123",
      contact_person: "Rajesh Kumar",
      contact_number: "+91 9876543210",
      email: "rajesh.kumar@hdfcbank.com",
      status: "Active",
      loan_types: ["Home Loan", "Personal Loan", "Business Loan"],
      interest_rate_min: 8.5,
      interest_rate_max: 12.5,
      date_of_registration: "2025-01-01",
    },
    {
      id: 2,
      bank_name: "ICICI Bank",
      branch: "Nehru Place",
      ifsc_code: "ICIC0000456",
      contact_person: "Priya Sharma",
      contact_number: "+91 9876543211",
      email: "priya.sharma@icicibank.com",
      status: "Active",
      loan_types: ["Home Loan", "Car Loan", "Education Loan"],
      interest_rate_min: 9.0,
      interest_rate_max: 13.0,
      date_of_registration: "2025-01-05",
    },
    {
      id: 3,
      bank_name: "State Bank of India",
      branch: "Lajpat Nagar",
      ifsc_code: "SBIN0000789",
      contact_person: "Amit Verma",
      contact_number: "+91 9876543212",
      email: "amit.verma@sbi.co.in",
      status: "Inactive",
      loan_types: ["Home Loan", "Agricultural Loan"],
      interest_rate_min: 8.0,
      interest_rate_max: 11.5,
      date_of_registration: "2025-01-10",
    },
    {
      id: 4,
      bank_name: "Axis Bank",
      branch: "Saket",
      ifsc_code: "UTIB0000321",
      contact_person: "Sneha Patel",
      contact_number: "+91 9876543213",
      email: "sneha.patel@axisbank.com",
      status: "Active",
      loan_types: ["Personal Loan", "Business Loan"],
      interest_rate_min: 9.5,
      interest_rate_max: 14.0,
      date_of_registration: "2025-01-15",
    },
  ];

  /* ---------------- INIT STORAGE (ONLY IF EMPTY) ---------------- */
  useEffect(() => {
    const existingBanks = localStorage.getItem("banks");
    if (!existingBanks) {
      localStorage.setItem("banks", JSON.stringify(defaultBanks));
    }
  }, []);

  const allBanks = JSON.parse(localStorage.getItem("banks")) || [];

  /* ---------------- STATE ---------------- */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ---------------- FILTER BANKS ---------------- */
  const filteredBanks = allBanks.filter((bank) => {
    const matchesSearch =
      bank.bank_name?.toLowerCase().includes(search.toLowerCase()) ||
      bank.branch?.toLowerCase().includes(search.toLowerCase()) ||
      bank.ifsc_code?.toLowerCase().includes(search.toLowerCase()) ||
      bank.contact_person?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || bank.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* ---------------- DELETE BANK ---------------- */
  const deleteBank = (bankId) => {
    if (!window.confirm("Are you sure you want to delete this bank?")) return;

    const banks = JSON.parse(localStorage.getItem("banks")) || [];
    const updatedBanks = banks.filter((b) => b.id !== bankId);

    localStorage.setItem("banks", JSON.stringify(updatedBanks));
    window.location.reload();
  };

  /* ---------------- BANK STATS ---------------- */
  const bankStats = {
    total: allBanks.length,
    active: allBanks.filter((b) => b.status === "Active").length,
    inactive: allBanks.filter((b) => b.status === "Inactive").length,
    totalLoanTypes: [...new Set(allBanks.flatMap((b) => b.loan_types || []))].length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .banks-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          animation: fadeIn 0.6s ease-out;
          padding: 0 1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          animation: slideDown 0.7s ease-out;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .header-content h1 {
          font-size: 1.875rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.375rem 0;
          letter-spacing: -0.02em;
        }

        .header-content p {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
          font-weight: 500;
        }

        .create-bank-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #004E89 0%, #003366 100%);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 78, 137, 0.2);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .create-bank-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 78, 137, 0.3);
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .stat-chip {
          background: white;
          padding: 0.875rem 1rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }

        .stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .stat-info {
          flex: 1;
          min-width: 0;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-count {
          font-size: 1.375rem;
          font-weight: 800;
          color: #1e293b;
          font-family: 'JetBrains Mono', monospace;
        }

        /* Filters */
        .filters-card {
          background: white;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 0.875rem;
        }

        .search-box {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 0.875rem 0.75rem 2.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.875rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #004E89;
          box-shadow: 0 0 0 3px rgba(0, 78, 137, 0.1);
        }

        .filter-select {
          padding: 0.75rem 0.875rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.875rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
          background: white;
          font-weight: 500;
        }

        .filter-select:focus {
          outline: none;
          border-color: #004E89;
          box-shadow: 0 0 0 3px rgba(0, 78, 137, 0.1);
        }

        /* Table */
        .table-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .data-table thead {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .data-table th {
          padding: 1rem 1.25rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .data-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-size: 0.875rem;
          vertical-align: middle;
        }

        .data-table tbody tr {
          transition: background-color 0.15s ease;
        }

        .data-table tbody tr:hover {
          background: #fafbfc;
        }

        .data-table tbody tr:last-child td {
          border-bottom: none;
        }

        .bank-name {
          font-weight: 600;
          color: #1e293b;
          display: block;
          margin-bottom: 0.125rem;
        }

        .bank-id {
          font-family: 'JetBrains Mono', monospace;
          color: #64748b;
          font-size: 0.813rem;
          font-weight: 500;
        }

        .loan-types-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .loan-type-badge {
          background: #e0f2fe;
          color: #0369a1;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .interest-rate {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.813rem;
          color: #059669;
          font-weight: 600;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-inactive {
          background: #f1f5f9;
          color: #475569;
        }

        .actions-cell {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          justify-content: flex-start;
        }

        .action-btn {
          padding: 0.5rem 0.875rem;
          border: none;
          border-radius: 6px;
          font-size: 0.813rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .btn-view {
          background: #ffffff;
          color: #004E89;
          border: 1px solid #e2e8f0;
        }

        .btn-view:hover {
          background: #f8fafc;
          border-color: #004E89;
          color: #003d6b;
        }

        .btn-edit {
          background: #004E89;
          color: white;
        }

        .btn-edit:hover {
          background: #003d6b;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 78, 137, 0.2);
        }

        .btn-delete {
          background: #ffffff;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .btn-delete:hover {
          background: #fef2f2;
          border-color: #dc2626;
          color: #b91c1c;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #334155;
          margin: 0 0 0.5rem 0;
        }

        .empty-state p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        /* Mobile Card View */
        .mobile-cards {
          display: none;
        }

        .bank-card {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .bank-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .card-title-section {
          flex: 1;
          min-width: 0;
        }

        .card-bank-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .card-bank-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: #64748b;
        }

        .card-info-grid {
          display: grid;
          gap: 0.875rem;
          margin-bottom: 1rem;
        }

        .card-info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .card-info-label {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-info-value {
          font-size: 0.875rem;
          color: #1e293b;
          font-weight: 500;
        }

        .card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.625rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        .card-action-btn {
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-align: center;
        }

        /* Tablet Breakpoint */
        @media (max-width: 1024px) {
          .banks-container {
            padding: 0 0.75rem;
          }

          .data-table {
            min-width: 900px;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Small Tablet */
        @media (max-width: 768px) {
          .banks-container {
            padding: 0 0.5rem;
          }

          .header-content h1 {
            font-size: 1.5rem;
          }

          .header-content p {
            font-size: 0.813rem;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .stats-row {
            grid-template-columns: 1fr 1fr;
            gap: 0.625rem;
          }

          .stat-chip {
            padding: 0.75rem 0.875rem;
          }

          .stat-icon {
            width: 28px;
            height: 28px;
            font-size: 0.875rem;
          }

          .stat-label {
            font-size: 0.65rem;
          }

          .stat-count {
            font-size: 1.125rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .create-bank-btn {
            width: 100%;
            justify-content: center;
            padding: 0.875rem 1.25rem;
          }

          /* Hide table, show cards on mobile */
          .table-card {
            display: none;
          }

          .mobile-cards {
            display: block;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .banks-container {
            padding: 0;
          }

          .header-content h1 {
            font-size: 1.375rem;
          }

          .stats-row {
            grid-template-columns: 1fr;
          }

          .search-input {
            font-size: 0.813rem;
          }

          .search-input::placeholder {
            font-size: 0.75rem;
          }

          .filter-select {
            font-size: 0.813rem;
          }

          .bank-card {
            padding: 1rem;
            border-radius: 10px;
          }

          .card-bank-name {
            font-size: 1rem;
          }

          .card-actions {
            grid-template-columns: 1fr;
          }

          .card-action-btn {
            padding: 0.875rem;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .header-content h1 {
            font-size: 1.25rem;
          }

          .create-bank-btn {
            font-size: 0.813rem;
            padding: 0.75rem 1rem;
          }

          .stat-count {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="banks-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Bank Management</h1>
            <p>Manage banking partners and loan products</p>
          </div>
          <button
            className="create-bank-btn"
            onClick={() => navigate("/admin/create-bank")}
          >
            <span>➕</span>
            <span>Add Bank Partner</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(0, 78, 137, 0.1)", color: "#004E89" }}
            >
              🏦
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Banks</div>
              <div className="stat-count">{bankStats.total}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}
            >
              ✅
            </div>
            <div className="stat-info">
              <div className="stat-label">Active</div>
              <div className="stat-count">{bankStats.active}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(100, 116, 139, 0.1)", color: "#64748b" }}
            >
              ⏸️
            </div>
            <div className="stat-info">
              <div className="stat-label">Inactive</div>
              <div className="stat-count">{bankStats.inactive}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}
            >
              📋
            </div>
            <div className="stat-info">
              <div className="stat-label">Loan Types</div>
              <div className="stat-count">{bankStats.totalLoanTypes}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <div className="filters-grid">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by bank name, branch, IFSC, or contact person..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bank ID</th>
                  <th>Bank Name</th>
                  <th>Branch</th>
                  <th>IFSC Code</th>
                  <th>Contact Person</th>
                  <th>Loan Types</th>
                  <th>Interest Rate</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBanks.length === 0 ? (
                  <tr>
                    <td colSpan="9">
                      <div className="empty-state">
                        <div className="empty-icon">🏦</div>
                        <h3>No banks found</h3>
                        <p>Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBanks.map((bank) => (
                    <tr key={bank.id}>
                      <td>
                        <span className="bank-id">{bank.id}</span>
                      </td>
                      <td>
                        <span className="bank-name">{bank.bank_name || "N/A"}</span>
                      </td>
                      <td>{bank.branch || "N/A"}</td>
                      <td>
                        <span className="bank-id">{bank.ifsc_code || "N/A"}</span>
                      </td>
                      <td>{bank.contact_person || "N/A"}</td>
                      <td>
                        <div className="loan-types-list">
                          {(bank.loan_types || []).slice(0, 2).map((type, idx) => (
                            <span key={idx} className="loan-type-badge">
                              {type}
                            </span>
                          ))}
                          {bank.loan_types && bank.loan_types.length > 2 && (
                            <span className="loan-type-badge">
                              +{bank.loan_types.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="interest-rate">
                          {bank.interest_rate_min}% - {bank.interest_rate_max}%
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${(
                            bank.status || "active"
                          ).toLowerCase()}`}
                        >
                          <span>●</span>
                          <span>{bank.status || "Active"}</span>
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn btn-edit"
                            onClick={() => navigate(`/admin/edit-bank/${bank.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn btn-delete"
                            onClick={() => deleteBank(bank.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="mobile-cards">
          {filteredBanks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏦</div>
              <h3>No banks found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredBanks.map((bank) => (
              <div key={bank.id} className="bank-card">
                <div className="card-header">
                  <div className="card-title-section">
                    <div className="card-bank-name">{bank.bank_name || "N/A"}</div>
                    <div className="card-bank-id">ID: {bank.id}</div>
                  </div>
                  <span
                    className={`status-badge status-${(
                      bank.status || "active"
                    ).toLowerCase()}`}
                  >
                    <span>●</span>
                    <span>{bank.status || "Active"}</span>
                  </span>
                </div>

                <div className="card-info-grid">
                  <div className="card-info-item">
                    <div className="card-info-label">Branch</div>
                    <div className="card-info-value">{bank.branch || "N/A"}</div>
                  </div>

                  <div className="card-info-item">
                    <div className="card-info-label">IFSC Code</div>
                    <div className="card-info-value">
                      <span className="bank-id">{bank.ifsc_code || "N/A"}</span>
                    </div>
                  </div>

                  <div className="card-info-item">
                    <div className="card-info-label">Contact Person</div>
                    <div className="card-info-value">{bank.contact_person || "N/A"}</div>
                  </div>

                  <div className="card-info-item">
                    <div className="card-info-label">Interest Rate</div>
                    <div className="card-info-value">
                      <span className="interest-rate">
                        {bank.interest_rate_min}% - {bank.interest_rate_max}%
                      </span>
                    </div>
                  </div>

                  <div className="card-info-item">
                    <div className="card-info-label">Loan Types</div>
                    <div className="loan-types-list">
                      {(bank.loan_types || []).map((type, idx) => (
                        <span key={idx} className="loan-type-badge">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="card-action-btn btn-edit"
                    onClick={() => navigate(`/admin/edit-bank/${bank.id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="card-action-btn btn-delete"
                    onClick={() => deleteBank(bank.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Banks;
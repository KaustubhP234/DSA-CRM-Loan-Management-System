import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LoanFiles = () => {
  const navigate = useNavigate();

  /* ---------------- DEFAULT DATA ---------------- */
  const defaultLoans = [
    {
      id: 1766568482820,
      name: "Rahul Sharma",
      loanType: "Vehicle Loan",
      amount: "5,00,000",
      status: "Completed",
      createdBy: "ADMIN",
    },
    {
      id: 1766631417655,
      name: "Priya Verma",
      loanType: "Home Loan",
      amount: "25,00,000",
      status: "Rejected",
      createdBy: "ADMIN",
    },
    {
      id: 1766631912487,
      name: "Amit Patil",
      loanType: "Vehicle Loan",
      amount: "7,50,000",
      status: "Completed",
      createdBy: "ADMIN",
    },
    {
      id: 1766802979342,
      name: "Sneha Kulkarni",
      loanType: "Vehicle Loan",
      amount: "6,20,000",
      status: "Rejected",
      createdBy: "ADMIN",
    },
    {
      id: 1766806245915,
      name: "Vikram Deshmukh",
      loanType: "Home Loan",
      amount: "30,00,000",
      status: "Is-Disbursement",
      createdBy: "ADMIN",
    },
  ];

  const PAGE_SIZE = 10;

  /* ---------------- INIT STORAGE ---------------- */
  useEffect(() => {
    if (!localStorage.getItem("loanFiles")) {
      localStorage.setItem("loanFiles", JSON.stringify(defaultLoans));
    }
  }, []);

  const allLoans = JSON.parse(localStorage.getItem("loanFiles")) || [];

  /* ---------------- STATE ---------------- */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(Number(sessionStorage.getItem("loanPage")) || 1);

  /* ---------------- FILTER ---------------- */
  const filteredLoans = allLoans.filter((loan) => {
    if (loan.status === "Deleted") return false;
    const name = loan?.name ?? "";
    const matchesName = name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All" || loan.status === status;
    return matchesName && matchesStatus;
  });

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredLoans.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentLoans = filteredLoans.slice(startIndex, startIndex + PAGE_SIZE);

  /* ---------------- EXPORT EXCEL (Mock) ---------------- */
  const exportExcel = () => {
    if (filteredLoans.length === 0) return;
    alert("Excel export functionality - integrate XLSX library in your project");
  };

  /* ---------------- EXPORT PDF (Mock) ---------------- */
  const exportPDF = () => {
    if (filteredLoans.length === 0) return;
    alert("PDF export functionality - integrate jsPDF library in your project");
  };

  const statusCounts = {
    all: allLoans.filter((l) => l.status !== "Deleted").length,
    inProcess: allLoans.filter((l) => l.status === "In-Process").length,
    disbursement: allLoans.filter((l) => l.status === "Is-Disbursement").length,
    completed: allLoans.filter((l) => l.status === "Completed").length,
    rejected: allLoans.filter((l) => l.status === "Rejected").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .loan-files-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          animation: fadeIn 0.6s ease-out;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          animation: slideDown 0.7s ease-out;
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

        .header-content p {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
          font-weight: 500;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-chip {
          background: white;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          animation: slideUp 0.6s ease-out both;
        }

        .stat-chip:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .stat-chip.active {
          border-color: #004E89;
          background: linear-gradient(135deg, rgba(0, 78, 137, 0.05), rgba(0, 78, 137, 0.1));
          box-shadow: 0 4px 12px rgba(0, 78, 137, 0.15);
        }

        .stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
          flex-shrink: 0;
        }

        .stat-info {
          flex: 1;
          min-width: 0;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-count {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          font-family: 'JetBrains Mono', monospace;
        }

        .controls-row {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
          animation: slideUp 0.7s ease-out 0.2s both;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .search-box {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1.125rem;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #004E89;
          box-shadow: 0 0 0 3px rgba(0, 78, 137, 0.1);
        }

        .status-select {
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
          background: white;
          font-weight: 500;
        }

        .status-select:focus {
          outline: none;
          border-color: #004E89;
          box-shadow: 0 0 0 3px rgba(0, 78, 137, 0.1);
        }

        .export-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .export-btn {
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
        }

        .export-excel {
          background: linear-gradient(135deg, #1FA883, #16875e);
          color: white;
          box-shadow: 0 4px 12px rgba(31, 168, 131, 0.25);
        }

        .export-excel:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(31, 168, 131, 0.35);
        }

        .export-pdf {
          background: linear-gradient(135deg, #DC2626, #b91c1c);
          color: white;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
        }

        .export-pdf:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.35);
        }

        /* Desktop Table */
        .table-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
          animation: scaleIn 0.6s ease-out 0.5s both;
        }

        .table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 650px;
        }

        .data-table thead {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-bottom: 2px solid #e2e8f0;
        }

        .data-table th {
          padding: 1.125rem 1.5rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .data-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-size: 0.95rem;
        }

        .data-table tbody tr {
          transition: all 0.2s;
        }

        .data-table tbody tr:hover {
          background: #f8fafc;
        }

        .data-table tbody tr:last-child td {
          border-bottom: none;
        }

        .customer-name {
          font-weight: 600;
          color: #1e293b;
        }

        .loan-id {
          font-family: 'JetBrains Mono', monospace;
          color: #64748b;
          font-size: 0.875rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          white-space: nowrap;
        }

        .status-badge span:first-child {
          animation: pulse 1.5s ease-in-out infinite;
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

        .view-btn {
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg, #004E89, #003366);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .view-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 78, 137, 0.3);
        }

        /* Mobile Card View */
        .mobile-cards {
          display: none;
        }

        .loan-card {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .loan-card:hover {
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

        .card-customer-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .card-loan-id {
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
          justify-content: space-between;
          align-items: center;
        }

        .card-info-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-info-value {
          font-size: 0.875rem;
          color: #1e293b;
          font-weight: 600;
        }

        .card-action-btn {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #004E89, #003366);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 1rem;
        }

        .card-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 78, 137, 0.3);
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border-radius: 16px;
          margin-top: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .pagination-btn {
          padding: 0.625rem 1.25rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #475569;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #004E89;
          color: #004E89;
          transform: translateY(-2px);
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-info {
          font-weight: 600;
          color: #475569;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .loan-files-container {
            padding: 1.5rem;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .loan-files-container {
            padding: 1rem;
          }

          .page-header {
            margin-bottom: 1.5rem;
          }

          .header-content h1 {
            font-size: 1.75rem;
          }

          .header-content p {
            font-size: 0.875rem;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            margin-bottom: 1.5rem;
          }

          .stat-chip {
            padding: 0.875rem 1rem;
          }

          .stat-icon {
            width: 32px;
            height: 32px;
            font-size: 1rem;
          }

          .stat-label {
            font-size: 0.7rem;
          }

          .stat-count {
            font-size: 1.25rem;
          }

          .controls-row {
            padding: 1.25rem;
            margin-bottom: 1.25rem;
          }

          .filters-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
          }

          .search-input,
          .status-select {
            font-size: 0.875rem;
            padding: 0.75rem 1rem;
          }

          .search-input {
            padding-left: 2.75rem;
          }

          .export-buttons {
            gap: 0.5rem;
          }

          .export-btn {
            flex: 1;
            justify-content: center;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }

          /* Hide table, show cards */
          .table-card {
            display: none;
          }

          .mobile-cards {
            display: block;
          }

          .pagination {
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .pagination-btn {
            font-size: 0.813rem;
            padding: 0.625rem 1rem;
          }

          .page-info {
            font-size: 0.813rem;
            width: 100%;
            text-align: center;
            order: -1;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .loan-files-container {
            padding: 0.75rem;
          }

          .header-content h1 {
            font-size: 1.5rem;
          }

          .stats-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .stat-chip {
            padding: 0.75rem 0.875rem;
          }

          .controls-row {
            padding: 1rem;
          }

          .export-buttons {
            flex-direction: column;
          }

          .export-btn {
            width: 100%;
          }

          .loan-card {
            padding: 1rem;
          }

          .card-customer-name {
            font-size: 1rem;
          }

          .pagination {
            padding: 1rem;
          }

          .pagination-btn {
            flex: 1;
          }
        }

        @media (max-width: 360px) {
          .loan-files-container {
            padding: 0.5rem;
          }

          .header-content h1 {
            font-size: 1.375rem;
          }

          .stat-icon {
            width: 28px;
            height: 28px;
          }

          .stat-count {
            font-size: 1.125rem;
          }
        }
      `}</style>

      <div className="loan-files-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Loan Files</h1>
            <p>Manage and track all loan applications</p>
          </div>
        </div>

        {/* Status Stats */}
        <div className="stats-row">
          <div
            className={`stat-chip ${status === "All" ? "active" : ""}`}
            onClick={() => {
              setStatus("All");
              setPage(1);
            }}
          >
            <div
              className="stat-icon"
              style={{ background: "rgba(0, 78, 137, 0.1)", color: "#004E89" }}
            >
              📊
            </div>
            <div className="stat-info">
              <div className="stat-label">All Loans</div>
              <div className="stat-count">{statusCounts.all}</div>
            </div>
          </div>

          <div
            className={`stat-chip ${status === "In-Process" ? "active" : ""}`}
            onClick={() => {
              setStatus("In-Process");
              setPage(1);
            }}
          >
            <div
              className="stat-icon"
              style={{ background: "rgba(255, 107, 53, 0.1)", color: "#FF6B35" }}
            >
              ⏳
            </div>
            <div className="stat-info">
              <div className="stat-label">In-Process</div>
              <div className="stat-count">{statusCounts.inProcess}</div>
            </div>
          </div>

          <div
            className={`stat-chip ${status === "Is-Disbursement" ? "active" : ""}`}
            onClick={() => {
              setStatus("Is-Disbursement");
              setPage(1);
            }}
          >
            <div
              className="stat-icon"
              style={{ background: "rgba(0, 78, 137, 0.1)", color: "#004E89" }}
            >
              💰
            </div>
            <div className="stat-info">
              <div className="stat-label">Disbursement</div>
              <div className="stat-count">{statusCounts.disbursement}</div>
            </div>
          </div>

          <div
            className={`stat-chip ${status === "Completed" ? "active" : ""}`}
            onClick={() => {
              setStatus("Completed");
              setPage(1);
            }}
          >
            <div
              className="stat-icon"
              style={{ background: "rgba(31, 168, 131, 0.1)", color: "#1FA883" }}
            >
              ✅
            </div>
            <div className="stat-info">
              <div className="stat-label">Completed</div>
              <div className="stat-count">{statusCounts.completed}</div>
            </div>
          </div>

          <div
            className={`stat-chip ${status === "Rejected" ? "active" : ""}`}
            onClick={() => {
              setStatus("Rejected");
              setPage(1);
            }}
          >
            <div
              className="stat-icon"
              style={{ background: "rgba(220, 38, 38, 0.1)", color: "#DC2626" }}
            >
              ❌
            </div>
            <div className="stat-info">
              <div className="stat-label">Rejected</div>
              <div className="stat-count">{statusCounts.rejected}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-row">
          <div className="filters-grid">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by customer name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                  sessionStorage.setItem("loanPage", "1");
                }}
                className="search-input"
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
                sessionStorage.setItem("loanPage", "1");
              }}
              className="status-select"
            >
              <option value="All">All Status</option>
              <option value="In-Process">In-Process</option>
              <option value="Is-Disbursement">Is-Disbursement</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="export-buttons">
            <button className="export-btn export-excel" onClick={exportExcel}>
              <span>📊</span>
              <span>Export Excel</span>
            </button>
            <button className="export-btn export-pdf" onClick={exportPDF}>
              <span>📄</span>
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Customer</th>
                  <th>Loan Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentLoans.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No loan files found</h3>
                        <p>Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentLoans.map((loan) => (
                    <tr key={loan.id}>
                      <td>
                        <span className="loan-id">{loan.id}</span>
                      </td>
                      <td>
                        <span className="customer-name">{loan.name}</span>
                      </td>
                      <td>{loan.loanType}</td>
                      <td>
                        <span
                          className={`status-badge status-${loan.status
                            .toLowerCase()
                            .replace("-", "")}`}
                        >
                          <span>●</span>
                          <span>{loan.status}</span>
                        </span>
                      </td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => {
                            sessionStorage.setItem("loanPage", page);
                            navigate(`/admin/loan-files/${loan.id}`);
                          }}
                        >
                          View Details
                        </button>
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
          {currentLoans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No loan files found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            currentLoans.map((loan) => (
              <div key={loan.id} className="loan-card">
                <div className="card-header">
                  <div className="card-title-section">
                    <div className="card-customer-name">{loan.name}</div>
                    <div className="card-loan-id">ID: {loan.id}</div>
                  </div>
                  <span
                    className={`status-badge status-${loan.status
                      .toLowerCase()
                      .replace("-", "")}`}
                  >
                    <span>●</span>
                    <span>{loan.status}</span>
                  </span>
                </div>

                <div className="card-info-grid">
                  <div className="card-info-item">
                    <span className="card-info-label">Loan Type</span>
                    <span className="card-info-value">{loan.loanType}</span>
                  </div>

                  <div className="card-info-item">
                    <span className="card-info-label">Amount</span>
                    <span className="card-info-value">₹{loan.amount}</span>
                  </div>

                  <div className="card-info-item">
                    <span className="card-info-label">Created By</span>
                    <span className="card-info-value">{loan.createdBy}</span>
                  </div>
                </div>

                <button
                  className="card-action-btn"
                  onClick={() => {
                    sessionStorage.setItem("loanPage", page);
                    navigate(`/admin/loan-files/${loan.id}`);
                  }}
                >
                  View Details →
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => {
                sessionStorage.setItem("loanPage", page - 1);
                setPage(page - 1);
              }}
            >
              ← Previous
            </button>

            <span className="page-info">
              Page {page} of {totalPages}
            </span>

            <button
              className="pagination-btn"
              disabled={page === totalPages}
              onClick={() => {
                sessionStorage.setItem("loanPage", page + 1);
                setPage(page + 1);
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LoanFiles;
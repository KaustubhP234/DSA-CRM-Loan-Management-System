import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Documents = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ---------------- INITIALIZE DEFAULT DOCUMENTS ---------------- */
  useEffect(() => {
    loadDocuments();
    window.addEventListener("focus", loadDocuments);
    return () => window.removeEventListener("focus", loadDocuments);
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [searchTerm, filterStatus, filterType, documents]);

  const loadDocuments = () => {
    const storedDocuments = JSON.parse(localStorage.getItem("documents"));
    
    if (!storedDocuments || storedDocuments.length === 0) {
      // Initialize with empty array - documents should be uploaded through the system
      console.log("No documents found. Please upload documents through Upload Document page.");
      setDocuments([]);
      setFilteredDocuments([]);
    } else {
      // Auto-fix documents that have wrong file_id format
      const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
      const fixedDocuments = storedDocuments.map(doc => {
        // If file_id is in old format (FILE001, FILE002), try to match to real file
        if (doc.file_id && (doc.file_id.startsWith("FILE") || doc.file_id.startsWith("CUST"))) {
          console.log(`Auto-fixing document ${doc.doc_id} with old file_id: ${doc.file_id}`);
          
          // Try to find matching file by customer name
          const matchingFile = files.find(f => 
            (f.customerName || f.customer_name || "").toLowerCase() === (doc.customer_name || "").toLowerCase()
          );
          
          if (matchingFile) {
            console.log(`  → Linked to file: ${matchingFile.id}`);
            return {
              ...doc,
              file_id: matchingFile.id,
              fileId: matchingFile.id
            };
          }
        }
        return doc;
      });
      
      // Save fixed documents back
      if (JSON.stringify(fixedDocuments) !== JSON.stringify(storedDocuments)) {
        localStorage.setItem("documents", JSON.stringify(fixedDocuments));
        console.log("✅ Documents auto-fixed and saved!");
      }
      
      setDocuments(fixedDocuments);
      setFilteredDocuments(fixedDocuments);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          (doc.doc_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.file_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.doc_number || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "All") {
      filtered = filtered.filter((doc) => doc.status === filterStatus);
    }

    if (filterType !== "All") {
      filtered = filtered.filter((doc) => doc.type === filterType);
    }

    setFilteredDocuments(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (docId) => {
    if (
      window.confirm(
        "⚠️ Are you sure you want to delete this document?\n\nThis action cannot be undone!"
      )
    ) {
      const updatedDocuments = documents.filter((doc) => doc.id !== docId);
      localStorage.setItem("documents", JSON.stringify(updatedDocuments));
      setDocuments(updatedDocuments);
      alert("✅ Document deleted successfully!");
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      Approved: "status-approved",
      Pending: "status-pending",
      Rejected: "status-rejected",
      "Under Review": "status-review",
    };
    return colors[status] || "status-default";
  };

  const getDocTypeIcon = (type) => {
    const icons = {
      "Aadhaar Card": "🆔",
      "Aadhar Card": "🆔",
      "PAN Card": "💳",
      "Bank Statement": "🏦",
      "Salary Slip": "💰",
      "Property Documents": "🏠",
      "Income Proof": "📊",
      "Address Proof": "📍",
      "ITR": "📝",
      "Form 16": "📋",
      "Business Documents": "💼",
      "Passport": "🛂",
      "Driving License": "🚗",
      "Voter ID": "🗳️",
      "Identity Proof": "🆔",
      "Other": "📄",
    };
    return icons[type] || "📄";
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body, html {
          overflow-x: hidden;
        }

        .documents-page {
          font-family: 'Inter', sans-serif;
          background: #f8fafc;
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        /* Breadcrumb */
        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .breadcrumb-link {
          color: #64748b;
          cursor: pointer;
          transition: color 0.2s;
          font-weight: 500;
        }

        .breadcrumb-link:hover {
          color: #004E89;
        }

        .breadcrumb-separator {
          color: #cbd5e1;
        }

        .breadcrumb-current {
          color: #0f172a;
          font-weight: 600;
        }

        /* Header Section */
        .page-header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1.75rem 2rem;
          background: linear-gradient(135deg, #004E89 0%, #003366 100%);
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 78, 137, 0.15);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .header-text {
          color: white;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
          color: white;
          letter-spacing: -0.02em;
        }

        .page-description {
          font-size: 0.9375rem;
          margin: 0;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 400;
        }

        .btn-upload-document {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: white;
          color: #004E89;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          white-space: nowrap;
        }

        .btn-upload-document:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-icon {
          font-size: 18px;
          font-weight: 600;
        }

        /* Stats Dashboard */
        .stats-dashboard {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 1.25rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: currentColor;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .stat-total::before { color: #004E89; }
        .stat-approved::before { color: #10b981; }
        .stat-pending::before { color: #f59e0b; }
        .stat-rejected::before { color: #ef4444; }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .stat-icon {
          font-size: 1.75rem;
        }

        .stat-trend {
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          background: #f1f5f9;
          color: #64748b;
        }

        .stat-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.25rem 0;
          line-height: 1;
          font-family: 'JetBrains Mono', monospace;
        }

        .stat-label {
          font-size: 0.8125rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Filters Section */
        .filters-section {
          background: white;
          border-radius: 10px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .filter-group {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .search-input-wrapper {
          position: relative;
          flex: 1;
          min-width: 280px;
        }

        .search-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: #94a3b8;
          stroke-width: 2;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.625rem 2.5rem 0.625rem 2.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          background: #f8fafc;
          font-weight: 400;
        }

        .search-input:focus {
          outline: none;
          border-color: #004E89;
          background: white;
          box-shadow: 0 0 0 3px rgba(0, 78, 137, 0.08);
        }

        .clear-search {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border: none;
          background: #e2e8f0;
          color: #64748b;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .clear-search:hover {
          background: #ef4444;
          color: white;
        }

        .filter-dropdown {
          padding: 0.625rem 0.875rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 160px;
          font-weight: 500;
          color: #475569;
        }

        .filter-dropdown:focus {
          outline: none;
          border-color: #004E89;
          background: white;
          box-shadow: 0 0 0 3px rgba(0, 78, 137, 0.08);
        }

        .btn-reset {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-reset:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .btn-reset svg {
          width: 14px;
          height: 14px;
          stroke-width: 2;
        }

        .results-info {
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .results-text {
          font-size: 0.8125rem;
          color: #64748b;
          font-weight: 500;
        }

        .results-text strong {
          color: #0f172a;
          font-weight: 600;
        }

        /* Table Container */
        .table-wrapper {
          width: 100%;
          overflow-x: auto;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          background: white;
        }

        .table-wrapper::-webkit-scrollbar {
          height: 6px;
        }

        .table-wrapper::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .table-wrapper::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .documents-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1100px;
        }

        .documents-table thead {
          background: linear-gradient(135deg, #004E89 0%, #003366 100%);
        }

        .documents-table thead th {
          padding: 0.875rem 1rem;
          text-align: left;
          font-size: 0.6875rem;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .documents-table tbody tr {
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.15s ease;
        }

        .documents-table tbody tr:hover {
          background: #f8fafc;
        }

        .documents-table tbody td {
          padding: 1rem;
          font-size: 0.8125rem;
          color: #475569;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }

        .checkbox-header,
        .checkbox-row {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #004E89;
        }

        /* Document Info */
        .doc-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .doc-icon-wrapper {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #004E89 0%, #003366 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .doc-details {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          min-width: 0;
        }

        .doc-id {
          font-weight: 600;
          color: #0f172a;
          font-size: 0.8125rem;
        }

        .doc-type {
          font-size: 0.6875rem;
          color: #64748b;
          font-weight: 400;
        }

        /* Customer Info */
        .customer-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .customer-name {
          font-weight: 600;
          color: #0f172a;
          font-size: 0.8125rem;
        }

        .customer-id {
          font-size: 0.6875rem;
          color: #64748b;
          font-weight: 400;
        }

        /* File Badge */
        .file-badge {
          display: inline-block;
          padding: 0.3125rem 0.625rem;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
          border: 1px solid #bfdbfe;
        }

        /* Document Number */
        .doc-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          background: #f1f5f9;
          padding: 0.3125rem 0.625rem;
          border-radius: 6px;
          color: #475569;
          font-weight: 500;
          border: 1px solid #e2e8f0;
        }

        /* Date */
        .date {
          color: #64748b;
          font-size: 0.8125rem;
          font-weight: 400;
        }

        /* Status Badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.3125rem 0.75rem;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-approved {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }

        .status-approved .status-dot {
          background: #10b981;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        }

        .status-pending .status-dot {
          background: #f59e0b;
        }

        .status-rejected {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .status-rejected .status-dot {
          background: #ef4444;
        }

        .status-review {
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #93c5fd;
        }

        .status-review .status-dot {
          background: #3b82f6;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .action-btn svg {
          width: 16px;
          height: 16px;
          stroke-width: 2;
        }

        .action-view {
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        }

        .action-view:hover {
          background: #3b82f6;
          color: white;
          transform: translateY(-1px);
        }

        .action-edit {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .action-edit:hover {
          background: #f59e0b;
          color: white;
          transform: translateY(-1px);
        }

        .action-delete {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .action-delete:hover {
          background: #ef4444;
          color: white;
          transform: translateY(-1px);
        }

        /* No Data */
        .no-data {
          padding: 3rem 1rem;
          text-align: center;
        }

        .no-data-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .no-data-icon {
          font-size: 3rem;
          opacity: 0.4;
        }

        .no-data-content h3 {
          font-size: 1.125rem;
          color: #0f172a;
          margin: 0;
          font-weight: 600;
        }

        .no-data-content p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #004E89;
          border-color: #004E89;
          color: white;
          transform: translateY(-1px);
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pagination-btn svg {
          width: 14px;
          height: 14px;
          stroke-width: 2;
        }

        .pagination-pages {
          display: flex;
          gap: 0.375rem;
        }

        .pagination-page {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-page:hover {
          border-color: #004E89;
          color: #004E89;
        }

        .pagination-page.active {
          background: #004E89;
          border-color: #004E89;
          color: white;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-dashboard {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 968px) {
          .documents-page {
            padding: 1rem;
          }

          .page-header-section {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            padding: 1.5rem;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .btn-upload-document {
            width: 100%;
            justify-content: center;
          }

          .stats-dashboard {
            grid-template-columns: 1fr;
          }

          .filter-group {
            flex-direction: column;
          }

          .search-input-wrapper {
            min-width: 100%;
          }

          .filter-dropdown,
          .btn-reset {
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .page-title {
            font-size: 1.5rem;
          }

          .page-description {
            font-size: 0.875rem;
          }

          .header-icon {
            width: 48px;
            height: 48px;
            font-size: 24px;
          }

          .stat-card {
            padding: 1rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .stat-icon {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="documents-page">
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <span onClick={() => navigate("/admin/dashboard")} className="breadcrumb-link">
            Dashboard
          </span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Documents</span>
        </div>

        {/* Header Section */}
        <div className="page-header-section">
          <div className="header-content">
            <div className="header-icon">📄</div>
            <div className="header-text">
              <h1 className="page-title">Document Management</h1>
              <p className="page-description">
                Manage and verify customer documents for loan applications
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin/upload-document")}
            className="btn-upload-document"
          >
            <span className="btn-icon">+</span>
            Upload Document
          </button>
        </div>

        {/* Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card stat-total">
            <div className="stat-header">
              <span className="stat-icon">📊</span>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">{documents.length}</h3>
              <p className="stat-label">Total Documents</p>
            </div>
          </div>

          <div className="stat-card stat-approved">
            <div className="stat-header">
              <span className="stat-icon">✅</span>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">
                {documents.filter((d) => d.status === "Approved").length}
              </h3>
              <p className="stat-label">Approved</p>
            </div>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-header">
              <span className="stat-icon">⏳</span>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">
                {documents.filter((d) => d.status === "Pending" || d.status === "Under Review").length}
              </h3>
              <p className="stat-label">Pending Review</p>
            </div>
          </div>

          <div className="stat-card stat-rejected">
            <div className="stat-header">
              <span className="stat-icon">❌</span>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">
                {documents.filter((d) => d.status === "Rejected").length}
              </h3>
              <p className="stat-label">Rejected</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by Doc ID, Customer, File ID, Type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-dropdown"
            >
              <option value="All">All Status</option>
              <option value="Approved">✅ Approved</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Rejected">❌ Rejected</option>
              <option value="Under Review">🔍 Under Review</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-dropdown"
            >
              <option value="All">All Types</option>
              <option value="Aadhaar Card">🆔 Aadhaar Card</option>
              <option value="Aadhar Card">🆔 Aadhar Card</option>
              <option value="PAN Card">💳 PAN Card</option>
              <option value="Bank Statement">🏦 Bank Statement</option>
              <option value="Salary Slip">💰 Salary Slip</option>
              <option value="Property Documents">🏠 Property Documents</option>
              <option value="Identity Proof">🆔 Identity Proof</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("All");
                setFilterType("All");
              }}
              className="btn-reset"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
              </svg>
              Reset
            </button>
          </div>

          <div className="results-info">
            <span className="results-text">
              Showing <strong>{currentItems.length}</strong> of{" "}
              <strong>{filteredDocuments.length}</strong> documents
            </span>
          </div>
        </div>

        {/* Documents Table */}
        <div className="table-wrapper">
          <table className="documents-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" className="checkbox-header" />
                </th>
                <th>Document Info</th>
                <th>Customer Details</th>
                <th>File ID</th>
                <th>Document Number</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    <div className="no-data-content">
                      <div className="no-data-icon">📭</div>
                      <h3>No documents found</h3>
                      <p>Upload documents to get started or adjust your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((doc) => (
                  <tr key={doc.id} className="table-row">
                    <td>
                      <input type="checkbox" className="checkbox-row" />
                    </td>
                    <td>
                      <div className="doc-info">
                        <div className="doc-icon-wrapper">
                          <span className="doc-type-icon">
                            {getDocTypeIcon(doc.type)}
                          </span>
                        </div>
                        <div className="doc-details">
                          <span className="doc-id">{doc.doc_id || doc.id}</span>
                          <span className="doc-type">{doc.type || doc.document_type}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{doc.customer_name}</span>
                        <span className="customer-id">{doc.customer_id}</span>
                      </div>
                    </td>
                    <td>
                      <span className="file-badge">{doc.file_id}</span>
                    </td>
                    <td>
                      <code className="doc-number">{doc.doc_number || doc.document_number || "N/A"}</code>
                    </td>
                    <td>
                      <span className="date">
                        {doc.date_of_submission || doc.date || doc.submission_date ? 
                          new Date(doc.date_of_submission || doc.date || doc.submission_date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          ) : "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeColor(doc.status || doc.verification_status || "Pending")}`}>
                        <span className="status-dot"></span>
                        {doc.status || doc.verification_status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => navigate(`/admin/documents/${doc.id}`)}
                          className="action-btn action-view"
                          title="View Details"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => alert("Edit feature coming soon!")}
                          className="action-btn action-edit"
                          title="Edit Document"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="action-btn action-delete"
                          title="Delete Document"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Previous
            </button>

            <div className="pagination-pages">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`pagination-page ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Documents;
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Customers = () => {
  const navigate = useNavigate();

  const defaultCustomers = [
    {
      id: 1,
      name: "Ramesh Sharma",
      email: "ramesh.sharma@gmail.com",
      contact: "+91 9876543210",
      whatsapp: "+91 9876543210",
      pin: "110001",
      district: "New Delhi",
      date_of_registration: "2025-01-01",
      login_status: "Active",
      user_id: 2,
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.patel@gmail.com",
      contact: "+91 9876543211",
      whatsapp: "+91 9876543211",
      pin: "400001",
      district: "Mumbai",
      date_of_registration: "2025-01-05",
      login_status: "Active",
      user_id: 3,
    },
    {
      id: 3,
      name: "Arun Kumar",
      email: "arun.kumar@gmail.com",
      contact: "+91 9876543212",
      whatsapp: "+91 9876543212",
      pin: "560001",
      district: "Bangalore",
      date_of_registration: "2025-01-10",
      login_status: "Inactive",
      user_id: 2,
    },
    {
      id: 4,
      name: "Sneha Reddy",
      email: "sneha.reddy@gmail.com",
      contact: "+91 9876543213",
      whatsapp: "+91 9876543213",
      pin: "500001",
      district: "Hyderabad",
      date_of_registration: "2025-01-15",
      login_status: "Active",
      user_id: 3,
    },
  ];

  useEffect(() => {
    const existingCustomers = localStorage.getItem("customers");
    if (!existingCustomers) {
      localStorage.setItem("customers", JSON.stringify(defaultCustomers));
    }
  }, []);

  const [allCustomers, setAllCustomers] = useState([]);

  useEffect(() => {
    const loadCustomers = () => {
      const customers = JSON.parse(localStorage.getItem("customers")) || [];
      setAllCustomers(customers);
    };
    
    loadCustomers();
    
    window.addEventListener('storage', loadCustomers);
    return () => window.removeEventListener('storage', loadCustomers);
  }, []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");

  const filteredCustomers = allCustomers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.contact?.includes(search) ||
      customer.district?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || customer.login_status === statusFilter;
    const matchesDistrict =
      districtFilter === "All" || customer.district === districtFilter;

    return matchesSearch && matchesStatus && matchesDistrict;
  });

  const deleteCustomer = (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const updatedCustomers = customers.filter((c) => c.id !== customerId);

    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    setAllCustomers(updatedCustomers);
  };

  const toggleStatus = (customerId) => {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const updatedCustomers = customers.map((c) =>
      c.id === customerId
        ? {
            ...c,
            login_status: c.login_status === "Active" ? "Inactive" : "Active",
          }
        : c
    );

    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    setAllCustomers(updatedCustomers);
  };

  const customerStats = {
    total: allCustomers.length,
    active: allCustomers.filter((c) => c.login_status === "Active").length,
    inactive: allCustomers.filter((c) => c.login_status === "Inactive").length,
    thisMonth: allCustomers.filter((c) => {
      const regDate = new Date(c.date_of_registration);
      const now = new Date();
      return (
        regDate.getMonth() === now.getMonth() &&
        regDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  const uniqueDistricts = [...new Set(allCustomers.map((c) => c.district))];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * {
          box-sizing: border-box;
        }

        body, html {
          overflow-x: hidden;
        }

        .customers-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          overflow-x: hidden;
          position: relative;
          padding: clamp(1rem, 3vw, 2rem);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: clamp(1rem, 3vw, 1.75rem);
          gap: 1rem;
          flex-wrap: wrap;
        }

        .header-content h1 {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.375rem 0;
          letter-spacing: -0.02em;
        }

        .header-content p {
          color: #64748b;
          font-size: clamp(0.8rem, 2vw, 0.9375rem);
          margin: 0;
          font-weight: 500;
        }

        .create-customer-btn {
          padding: clamp(0.65rem, 1.5vw, 0.875rem) clamp(1.25rem, 2.5vw, 1.75rem);
          background: linear-gradient(135deg, #004E89 0%, #003366 100%);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          font-size: clamp(0.8rem, 1.8vw, 0.9375rem);
          display: flex;
          align-items: center;
          gap: 0.625rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(0, 78, 137, 0.25);
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
        }

        .create-customer-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 78, 137, 0.35);
          background: linear-gradient(135deg, #003d6b 0%, #002952 100%);
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: clamp(0.75rem, 2vw, 1rem);
          margin-bottom: clamp(1.25rem, 3vw, 1.75rem);
        }

        .stat-chip {
          background: white;
          padding: clamp(0.875rem, 2vw, 1.125rem) clamp(1rem, 2vw, 1.25rem);
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.875rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-chip:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          border-color: rgba(0, 78, 137, 0.2);
        }

        .stat-icon {
          width: clamp(32px, 7vw, 38px);
          height: clamp(32px, 7vw, 38px);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(0.95rem, 2.2vw, 1.125rem);
          flex-shrink: 0;
        }

        .stat-info {
          flex: 1;
          min-width: 0;
        }

        .stat-label {
          font-size: clamp(0.625rem, 1.4vw, 0.6875rem);
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.25rem;
        }

        .stat-count {
          font-size: clamp(1.25rem, 3.5vw, 1.625rem);
          font-weight: 800;
          color: #1e293b;
          font-family: 'JetBrains Mono', monospace;
          line-height: 1;
        }

        .filters-card {
          background: white;
          padding: clamp(1rem, 2vw, 1.25rem);
          border-radius: 14px;
          margin-bottom: clamp(1.25rem, 2.5vw, 1.5rem);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1rem;
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
          font-size: 1rem;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: clamp(0.8rem, 1.8vw, 0.875rem);
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #004E89;
          box-shadow: 0 0 0 4px rgba(0, 78, 137, 0.1);
        }

        .filter-select {
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: clamp(0.8rem, 1.8vw, 0.875rem);
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
          background: white;
          font-weight: 600;
        }

        .filter-select:focus {
          outline: none;
          border-color: #004E89;
          box-shadow: 0 0 0 4px rgba(0, 78, 137, 0.1);
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
          border-radius: 14px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: white;
        }

        .table-wrapper::-webkit-scrollbar {
          height: 8px;
        }

        .table-wrapper::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 0 0 14px 14px;
        }

        .table-wrapper::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1100px;
          table-layout: fixed;
        }

        .data-table thead {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 2px solid #e2e8f0;
        }

        .data-table th {
          padding: 1.125rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .data-table th:nth-child(1) { width: 90px; }
        .data-table th:nth-child(2) { width: 150px; }
        .data-table th:nth-child(3) { width: 200px; }
        .data-table th:nth-child(4) { width: 140px; }
        .data-table th:nth-child(5) { width: 120px; }
        .data-table th:nth-child(6) { width: 100px; }
        .data-table th:nth-child(7) { width: 100px; }
        .data-table th:nth-child(8) { width: 110px; }
        .data-table th:nth-child(9) { width: 180px; }

        .data-table td {
          padding: 1.125rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-size: 0.875rem;
          vertical-align: middle;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .data-table tbody tr {
          transition: all 0.2s ease;
          background: white;
        }

        .data-table tbody tr:hover {
          background: #fafbfc;
          box-shadow: inset 0 0 0 1px rgba(0, 78, 137, 0.08);
        }

        .data-table tbody tr:last-child td {
          border-bottom: none;
        }

        .customer-name {
          font-weight: 700;
          color: #1e293b;
          display: block;
          margin-bottom: 0.125rem;
        }

        .customer-id {
          font-family: 'JetBrains Mono', monospace;
          color: #64748b;
          font-size: 0.813rem;
          font-weight: 600;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4375rem;
          padding: 0.4375rem 0.875rem;
          border-radius: 7px;
          font-size: 0.75rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-active {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
          border: 1px solid #6ee7b7;
        }

        .status-inactive {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
          border: 1px solid #cbd5e1;
        }

        .actions-cell {
          display: flex;
          gap: 0.625rem;
          align-items: center;
          justify-content: flex-start;
        }

        .action-btn {
          padding: 0.5625rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.813rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
        }

        .btn-edit {
          background: linear-gradient(135deg, #004E89 0%, #003366 100%);
          color: white;
        }

        .btn-edit:hover {
          background: linear-gradient(135deg, #003d6b 0%, #002952 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 78, 137, 0.25);
        }

        .btn-delete {
          background: white;
          color: #dc2626;
          border: 2px solid #fecaca;
        }

        .btn-delete:hover {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border-color: #dc2626;
          color: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(220, 38, 38, 0.2);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 3.5rem;
          margin-bottom: 1.25rem;
          opacity: 0.4;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #334155;
          margin: 0 0 0.625rem 0;
        }

        .empty-state p {
          font-size: 0.9375rem;
          color: #64748b;
          margin: 0;
        }

        .mobile-card-view {
          display: none;
        }

        .customer-card {
          background: white;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .customer-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .card-title-section {
          flex: 1;
        }

        .card-customer-name {
          font-weight: 700;
          font-size: 1.125rem;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .card-customer-id {
          font-family: 'JetBrains Mono', monospace;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-body {
          display: grid;
          gap: 0.875rem;
        }

        .card-info-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .card-info-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          min-width: 90px;
          flex-shrink: 0;
        }

        .card-info-value {
          font-size: 0.875rem;
          color: #334155;
          font-weight: 500;
          flex: 1;
          word-break: break-word;
        }

        .card-footer {
          display: flex;
          gap: 0.625rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        .card-footer .action-btn {
          flex: 1;
          justify-content: center;
        }

        @media (max-width: 1200px) {
          .customers-container {
            max-width: 100%;
          }

          .filters-grid {
            grid-template-columns: 1fr 1fr;
          }

          .search-box {
            grid-column: 1 / -1;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .customers-container {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .create-customer-btn {
            width: 100%;
            justify-content: center;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .search-box {
            grid-column: 1;
          }

          .table-wrapper {
            display: none;
          }

          .mobile-card-view {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .stats-row {
            grid-template-columns: 1fr;
          }

          .stat-chip {
            padding: 1rem;
          }

          .customer-card {
            padding: 1rem;
          }

          .card-info-row {
            flex-direction: column;
            gap: 0.25rem;
          }

          .card-info-label {
            min-width: unset;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .create-customer-btn:hover,
          .stat-chip:hover,
          .action-btn:hover,
          .customer-card:hover {
            transform: none;
          }

          .create-customer-btn:active {
            transform: scale(0.97);
          }

          .action-btn:active {
            transform: scale(0.95);
          }
        }
      `}</style>

      <div className="customers-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Customer Management</h1>
            <p>Manage customer registrations and information</p>
          </div>
          <button
            className="create-customer-btn"
            onClick={() => navigate("/admin/create-customer")}
          >
            <span>➕</span>
            <span>Register Customer</span>
          </button>
        </div>

        <div className="stats-row">
          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(0, 78, 137, 0.12)", color: "#004E89" }}
            >
              👥
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Customers</div>
              <div className="stat-count">{customerStats.total}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}
            >
              ✅
            </div>
            <div className="stat-info">
              <div className="stat-label">Active</div>
              <div className="stat-count">{customerStats.active}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(100, 116, 139, 0.12)", color: "#64748b" }}
            >
              ⏸️
            </div>
            <div className="stat-info">
              <div className="stat-label">Inactive</div>
              <div className="stat-count">{customerStats.inactive}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}
            >
              📅
            </div>
            <div className="stat-info">
              <div className="stat-label">This Month</div>
              <div className="stat-count">{customerStats.thisMonth}</div>
            </div>
          </div>
        </div>

        <div className="filters-card">
          <div className="filters-grid">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, email, contact, or district..."
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

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Districts</option>
              {uniqueDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>District</th>
                <th>PIN Code</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <h3>No customers found</h3>
                      <p>Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <span className="customer-id">{customer.id}</span>
                    </td>
                    <td>
                      <span className="customer-name">{customer.name || "N/A"}</span>
                    </td>
                    <td>{customer.email || "N/A"}</td>
                    <td>{customer.contact || "N/A"}</td>
                    <td>{customer.district || "N/A"}</td>
                    <td>{customer.pin || "N/A"}</td>
                    <td>
                      <span
                        className={`status-badge status-${(
                          customer.login_status || "active"
                        ).toLowerCase()}`}
                      >
                        <span>●</span>
                        <span>{customer.login_status || "Active"}</span>
                      </span>
                    </td>
                    <td>{customer.date_of_registration || "N/A"}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="action-btn btn-edit"
                          onClick={() =>
                            navigate(`/admin/edit-customer/${customer.id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn btn-delete"
                          onClick={() => deleteCustomer(customer.id)}
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

        <div className="mobile-card-view">
          {filteredCustomers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No customers found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="customer-card">
                <div className="card-header">
                  <div className="card-title-section">
                    <div className="card-customer-name">{customer.name || "N/A"}</div>
                    <div className="card-customer-id">ID: {customer.id}</div>
                  </div>
                  <span
                    className={`status-badge status-${(
                      customer.login_status || "active"
                    ).toLowerCase()}`}
                  >
                    <span>●</span>
                    <span>{customer.login_status || "Active"}</span>
                  </span>
                </div>

                <div className="card-body">
                  <div className="card-info-row">
                    <div className="card-info-label">Email</div>
                    <div className="card-info-value">{customer.email || "N/A"}</div>
                  </div>

                  <div className="card-info-row">
                    <div className="card-info-label">Contact</div>
                    <div className="card-info-value">{customer.contact || "N/A"}</div>
                  </div>

                  <div className="card-info-row">
                    <div className="card-info-label">District</div>
                    <div className="card-info-value">{customer.district || "N/A"}</div>
                  </div>

                  <div className="card-info-row">
                    <div className="card-info-label">PIN Code</div>
                    <div className="card-info-value">{customer.pin || "N/A"}</div>
                  </div>

                  <div className="card-info-row">
                    <div className="card-info-label">Registered</div>
                    <div className="card-info-value">{customer.date_of_registration || "N/A"}</div>
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    className="action-btn btn-edit"
                    onClick={() => navigate(`/admin/edit-customer/${customer.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn btn-delete"
                    onClick={() => deleteCustomer(customer.id)}
                  >
                    Delete
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

export default Customers;
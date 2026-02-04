import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Users = () => {
  const navigate = useNavigate();

  /* ---------------- DEFAULT USERS DATA ---------------- */
  const defaultUsers = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@dsacrm.com",
      contact_number: "+91 9876543210",
      username: "admin",
      password: "admin123",
      login_role: "ADMIN",
      status: "Active",
      date_of_registration: "2025-01-01",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      email: "rajesh@dsacrm.com",
      contact_number: "+91 9876543211",
      username: "rajesh_marketing",
      password: "rajesh123",
      login_role: "MARKETING_EXECUTIVE",
      status: "Active",
      date_of_registration: "2025-01-05",
    },
    {
      id: 3,
      name: "Priya Sharma",
      email: "priya@dsacrm.com",
      contact_number: "+91 9876543212",
      username: "priya_data",
      password: "priya123",
      login_role: "DATA_OPERATOR",
      status: "Active",
      date_of_registration: "2025-01-10",
    },
    {
      id: 4,
      name: "Amit Patel",
      email: "amit@dsacrm.com",
      contact_number: "+91 9876543213",
      username: "amit_bank",
      password: "amit123",
      login_role: "BANK_EXECUTIVE",
      status: "Active",
      date_of_registration: "2025-01-15",
    },
  ];

  /* ---------------- INIT STORAGE (ONLY IF EMPTY) ---------------- */
  useEffect(() => {
    const existingUsers = localStorage.getItem("users");
    if (!existingUsers) {
      console.log("Initializing default users...");
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    } else {
      console.log("Users already exist in localStorage");
    }
  }, []);

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const loadUsers = () => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      setAllUsers(users);
    };
    
    loadUsers();
    
    window.addEventListener('storage', loadUsers);
    return () => window.removeEventListener('storage', loadUsers);
  }, []);

  /* ---------------- STATE ---------------- */
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ---------------- FILTER USERS ---------------- */
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "All" || user.login_role === roleFilter;
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  /* ---------------- DELETE USER ---------------- */
  const deleteUser = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.filter((u) => u.id !== userId);

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
  };

  /* ---------------- TOGGLE STATUS ---------------- */
  const toggleStatus = (userId) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.id === userId
        ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
        : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
  };

  /* ---------------- ROLE STATS ---------------- */
  const roleStats = {
    total: allUsers.length,
    admin: allUsers.filter((u) => u.login_role === "ADMIN").length,
    dataOperator: allUsers.filter((u) => u.login_role === "DATA_OPERATOR").length,
    marketingExec: allUsers.filter((u) => u.login_role === "MARKETING_EXECUTIVE").length,
    bankExec: allUsers.filter((u) => u.login_role === "BANK_EXECUTIVE").length,
    active: allUsers.filter((u) => u.status === "Active").length,
    inactive: allUsers.filter((u) => u.status === "Inactive").length,
  };

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

        .users-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          animation: fadeIn 0.6s ease-out;
          width: 100%;
          max-width: 100%;
          overflow-x: visible;
          overflow-y: visible;
          position: relative;
          padding: 0 1rem;
        }

        .users-container > * {
          max-width: 100%;
        }

        @media (max-width: 768px) {
          body {
            overflow-x: auto !important;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.75rem;
          animation: slideDown 0.7s ease-out;
          gap: 1rem;
          flex-wrap: wrap;
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
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.375rem 0;
          letter-spacing: -0.02em;
        }

        .header-content p {
          color: #64748b;
          font-size: 0.9375rem;
          margin: 0;
          font-weight: 500;
        }

        .create-user-btn {
          padding: 0.875rem 1.75rem;
          background: linear-gradient(135deg, #004E89 0%, #003366 100%);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.9375rem;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(0, 78, 137, 0.25);
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
        }

        .create-user-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 78, 137, 0.35);
          background: linear-gradient(135deg, #003d6b 0%, #002952 100%);
        }

        .create-user-btn:active {
          transform: translateY(0);
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(155px, 1fr));
          gap: 1rem;
          margin-bottom: 1.75rem;
        }

        .stat-chip {
          background: white;
          padding: 1.125rem 1.25rem;
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
          width: 38px;
          height: 38px;
          border-radius: 10px;
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
          font-size: 0.6875rem;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.25rem;
        }

        .stat-count {
          font-size: 1.625rem;
          font-weight: 800;
          color: #1e293b;
          font-family: 'JetBrains Mono', monospace;
          line-height: 1;
        }

        /* Filters */
        .filters-card {
          background: white;
          padding: 1.25rem;
          border-radius: 14px;
          margin-bottom: 1.5rem;
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
          font-size: 0.875rem;
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
          font-size: 0.875rem;
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

        /* Table Container with Scroll */
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
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .data-table th:nth-child(1) { width: 70px; }
        .data-table th:nth-child(2) { width: 140px; }
        .data-table th:nth-child(3) { width: 180px; }
        .data-table th:nth-child(4) { width: 130px; }
        .data-table th:nth-child(5) { width: 120px; }
        .data-table th:nth-child(6) { width: 140px; }
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

        .user-name {
          font-weight: 700;
          color: #1e293b;
          display: block;
          margin-bottom: 0.125rem;
        }

        .user-id {
          font-family: 'JetBrains Mono', monospace;
          color: #64748b;
          font-size: 0.813rem;
          font-weight: 600;
        }

        .user-username {
          font-family: 'JetBrains Mono', monospace;
          color: #475569;
          font-size: 0.813rem;
          font-weight: 600;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.4375rem 0.875rem;
          border-radius: 7px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        .role-admin {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .role-data-operator {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1e40af;
          border: 1px solid #93c5fd;
        }

        .role-marketing-executive {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          border: 1px solid #fcd34d;
        }

        .role-bank-executive {
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          color: #5b21b6;
          border: 1px solid #c4b5fd;
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

        .btn-edit:active {
          transform: translateY(0);
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

        .btn-delete:active {
          transform: translateY(0);
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

        /* Mobile Responsive Styles */
        @media (max-width: 1200px) {
          .filters-grid {
            grid-template-columns: 1fr 1fr;
          }

          .search-box {
            grid-column: 1 / -1;
          }

          .stats-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .users-container {
            padding: 0 0.5rem;
            overflow-x: visible;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
            margin-bottom: 1.25rem;
          }

          .header-content h1 {
            font-size: 1.625rem;
          }

          .header-content p {
            font-size: 0.875rem;
          }

          .create-user-btn {
            width: 100%;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            margin-bottom: 1.25rem;
          }

          .stat-chip {
            padding: 0.875rem 1rem;
            gap: 0.625rem;
          }

          .stat-icon {
            width: 32px;
            height: 32px;
            font-size: 1rem;
          }

          .stat-label {
            font-size: 0.625rem;
          }

          .stat-count {
            font-size: 1.375rem;
          }

          .filters-card {
            padding: 1rem;
            margin-bottom: 1.25rem;
          }

          .filters-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .search-box {
            grid-column: 1;
          }

          .search-input,
          .filter-select {
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            font-size: 0.813rem;
          }

          .filter-select {
            padding: 0.75rem 1rem;
          }

          .table-wrapper {
            border-radius: 10px;
            margin-left: -0.5rem;
            margin-right: -0.5rem;
            width: calc(100% + 1rem);
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .data-table th,
          .data-table td {
            padding: 0.875rem 0.75rem;
            font-size: 0.813rem;
          }

          .data-table th {
            font-size: 0.688rem;
          }

          .action-btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
          }

          .actions-cell {
            gap: 0.5rem;
          }

          .empty-state {
            padding: 3rem 1.5rem;
          }

          .empty-icon {
            font-size: 2.5rem;
          }

          .empty-state h3 {
            font-size: 1.125rem;
          }

          .empty-state p {
            font-size: 0.875rem;
          }
        }

        @media (max-width: 480px) {
          .users-container {
            padding: 0 0.25rem;
          }

          .page-header {
            margin-bottom: 1rem;
          }

          .header-content h1 {
            font-size: 1.375rem;
          }

          .header-content p {
            font-size: 0.813rem;
          }

          .create-user-btn {
            padding: 0.625rem 1.25rem;
            font-size: 0.813rem;
          }

          .stats-row {
            grid-template-columns: 1fr;
            gap: 0.625rem;
            margin-bottom: 1rem;
          }

          .stat-chip {
            padding: 0.75rem 0.875rem;
          }

          .filters-card {
            padding: 0.875rem;
            margin-bottom: 1rem;
          }

          .search-input {
            padding: 0.625rem 0.875rem 0.625rem 2.25rem;
          }

          .filter-select {
            padding: 0.625rem 0.875rem;
          }

          .table-wrapper {
            margin-left: -0.25rem;
            margin-right: -0.25rem;
            width: calc(100% + 0.5rem);
          }

          .data-table th,
          .data-table td {
            padding: 0.75rem 0.625rem;
            font-size: 0.75rem;
          }

          .data-table th {
            font-size: 0.625rem;
          }

          .user-name {
            font-size: 0.813rem;
          }

          .user-id,
          .user-username {
            font-size: 0.75rem;
          }

          .role-badge,
          .status-badge {
            padding: 0.375rem 0.625rem;
            font-size: 0.625rem;
          }

          .action-btn {
            padding: 0.4375rem 0.625rem;
            font-size: 0.688rem;
          }

          .empty-state {
            padding: 2.5rem 1rem;
          }

          .empty-icon {
            font-size: 2rem;
          }

          .empty-state h3 {
            font-size: 1rem;
          }

          .empty-state p {
            font-size: 0.813rem;
          }
        }

        /* Landscape mobile optimization */
        @media (max-width: 768px) and (orientation: landscape) {
          .stats-row {
            grid-template-columns: repeat(4, 1fr);
          }
          
          .page-header {
            flex-direction: row;
            align-items: center;
          }

          .create-user-btn {
            width: auto;
          }
        }

        /* Touch optimization */
        @media (hover: none) and (pointer: coarse) {
          .action-btn,
          .create-user-btn,
          .filter-select,
          .search-input {
            min-height: 44px;
          }

          .stat-chip {
            cursor: default;
          }

          .stat-chip:active {
            transform: scale(0.98);
          }

          .action-btn:active,
          .create-user-btn:active {
            transform: scale(0.96);
          }
        }
      `}</style>

      <div className="users-container">
        <div className="page-header">
          <div className="header-content">
            <h1>User Management</h1>
            <p>Manage system users and assign roles</p>
          </div>
          <button
            className="create-user-btn"
            onClick={() => navigate("/admin/create-user")}
          >
            <span>➕</span>
            <span>Create New User</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(0, 78, 137, 0.12)", color: "#004E89" }}
            >
              👥
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Users</div>
              <div className="stat-count">{roleStats.total}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(220, 38, 38, 0.12)", color: "#DC2626" }}
            >
              🔑
            </div>
            <div className="stat-info">
              <div className="stat-label">Admins</div>
              <div className="stat-count">{roleStats.admin}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(30, 64, 175, 0.12)", color: "#1e40af" }}
            >
              📝
            </div>
            <div className="stat-info">
              <div className="stat-label">Data Operators</div>
              <div className="stat-count">{roleStats.dataOperator}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}
            >
              🎯
            </div>
            <div className="stat-info">
              <div className="stat-label">Marketing</div>
              <div className="stat-count">{roleStats.marketingExec}</div>
            </div>
          </div>

          <div className="stat-chip">
            <div
              className="stat-icon"
              style={{ background: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6" }}
            >
              🏦
            </div>
            <div className="stat-info">
              <div className="stat-label">Bank Execs</div>
              <div className="stat-count">{roleStats.bankExec}</div>
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
              <div className="stat-count">{roleStats.active}</div>
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
              <div className="stat-count">{roleStats.inactive}</div>
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
                placeholder="Search by name, email, or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="DATA_OPERATOR">Data Operator</option>
              <option value="MARKETING_EXECUTIVE">Marketing Executive</option>
              <option value="BANK_EXECUTIVE">Bank Executive</option>
            </select>

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

        {/* Table with Horizontal Scroll */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <h3>No users found</h3>
                      <p>Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <span className="user-id">{user.id}</span>
                    </td>
                    <td>
                      <span className="user-name">{user.name || "N/A"}</span>
                    </td>
                    <td>{user.email || "N/A"}</td>
                    <td>{user.contact_number || "N/A"}</td>
                    <td>
                      <span className="user-username">{user.username || "N/A"}</span>
                    </td>
                    <td>
                      <span
                        className={`role-badge role-${(user.login_role || "")
                          .toLowerCase()
                          .replace(/_/g, "-")}`}
                      >
                        {(user.login_role || "N/A").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${(user.status || "active").toLowerCase()}`}
                      >
                        <span>●</span>
                        <span>{user.status || "Active"}</span>
                      </span>
                    </td>
                    <td>{user.date_of_registration || "N/A"}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="action-btn btn-edit"
                          onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn btn-delete"
                          onClick={() => deleteUser(user.id)}
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
    </>
  );
};

export default Users;
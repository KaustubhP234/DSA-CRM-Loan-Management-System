import { useState } from "react";

const StatusHistory = () => {
  const [selectedFile, setSelectedFile] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [filterStatus, setFilterStatus] = useState("");

  const files = [
    { id: 1, customerName: "Kaustubh Raut", loanType: "Home Loan" },
    { id: 2, customerName: "Priya Sharma", loanType: "Vehicle Loan" },
    { id: 3, customerName: "Amit Desai", loanType: "Education Loan" },
  ];

  const [statusHistory] = useState([
    {
      id: 1,
      fileId: 1,
      customerName: "Kaustubh Raut",
      customerId: 101,
      statusType: "In-Process",
      description: "Initial verification of documents completed",
      remark: "All documents received",
      dateOfProcess: "2025-01-15",
      updatedBy: "Admin User",
      timestamp: "2025-01-15 10:30 AM",
    },
    {
      id: 2,
      fileId: 1,
      customerName: "Kaustubh Raut",
      customerId: 101,
      statusType: "Is-Login",
      description: "Loan application logged successfully",
      remark: "Reference: REF2025001",
      dateOfProcess: "2025-01-16",
      updatedBy: "Bank Executive",
      timestamp: "2025-01-16 02:15 PM",
    },
    {
      id: 3,
      fileId: 1,
      customerName: "Kaustubh Raut",
      customerId: 101,
      statusType: "Is-Active",
      description: "Application active and under processing",
      remark: "Awaiting bank approval",
      dateOfProcess: "2025-01-18",
      updatedBy: "Marketing Executive",
      timestamp: "2025-01-18 11:00 AM",
    },
    {
      id: 4,
      fileId: 2,
      customerName: "Priya Sharma",
      customerId: 102,
      statusType: "In-Process",
      description: "Document verification in progress",
      remark: "Income proof pending",
      dateOfProcess: "2025-01-14",
      updatedBy: "Data Operator",
      timestamp: "2025-01-14 09:00 AM",
    },
    {
      id: 5,
      fileId: 2,
      customerName: "Priya Sharma",
      customerId: 102,
      statusType: "Is-Query",
      description: "Bank raised query on income documents",
      remark: "Additional ITR required",
      dateOfProcess: "2025-01-17",
      updatedBy: "Bank Executive",
      timestamp: "2025-01-17 03:30 PM",
    },
    {
      id: 6,
      fileId: 3,
      customerName: "Amit Desai",
      customerId: 103,
      statusType: "Is-Sanctioned",
      description: "Loan sanctioned successfully",
      remark: "Amount: ₹5,00,000",
      dateOfProcess: "2025-01-01",
      updatedBy: "Admin",
      timestamp: "2025-01-01 04:00 PM",
    },
  ]);

  const statusConfig = {
    "In-Process": { label: "In-Process", color: "#3b82f6", icon: "⏳", bg: "#eff6ff" },
    "Is-Login": { label: "Is-Login", color: "#8b5cf6", icon: "🔐", bg: "#f5f3ff" },
    "Is-Query": { label: "Is-Query", color: "#f59e0b", icon: "❓", bg: "#fffbeb" },
    "Is-Active": { label: "Is-Active", color: "#10b981", icon: "✅", bg: "#f0fdf4" },
    "Is-Sanctioned": { label: "Is-Sanctioned", color: "#06b6d4", icon: "💰", bg: "#ecfeff" },
    "Is-Disbursement": { label: "Is-Disbursement", color: "#22c55e", icon: "💸", bg: "#f0fdf4" },
    "Is-Reject": { label: "Is-Reject", color: "#ef4444", icon: "❌", bg: "#fef2f2" },
  };

  const filteredHistory = statusHistory.filter((item) => {
    const matchesFile = !selectedFile || item.fileId === parseInt(selectedFile);
    const matchesStatus = !filterStatus || item.statusType === filterStatus;
    const matchesDateFrom = !dateRange.from || item.dateOfProcess >= dateRange.from;
    const matchesDateTo = !dateRange.to || item.dateOfProcess <= dateRange.to;
    return matchesFile && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const groupedByFile = filteredHistory.reduce((acc, item) => {
    if (!acc[item.fileId]) acc[item.fileId] = [];
    acc[item.fileId].push(item);
    return acc;
  }, {});

  const handleReset = () => {
    setSelectedFile("");
    setDateRange({ from: "", to: "" });
    setFilterStatus("");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => (window.location.href = "/admin/status")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          <span>←</span>
          Back
        </button>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>
          Status History
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
          Track all status changes and updates for loan files
        </p>
      </div>

      {/* Filters */}
      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "16px" }}>Filters</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#6b7280", marginBottom: "6px" }}>
              Select File
            </label>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                background: "white",
                outline: "none",
              }}
            >
              <option value="">All Files</option>
              {files.map((file) => (
                <option key={file.id} value={file.id}>
                  File #{file.id} - {file.customerName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#6b7280", marginBottom: "6px" }}>
              Status Type
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                background: "white",
                outline: "none",
              }}
            >
              <option value="">All Status</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#6b7280", marginBottom: "6px" }}>
              From Date
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#6b7280", marginBottom: "6px" }}>
              To Date
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleReset}
            style={{
              padding: "8px 16px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "white",
              color: "#374151",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: "20px", padding: "12px 16px", background: "#3b82f6", color: "white", borderRadius: "10px", fontSize: "14px", fontWeight: "600" }}>
        📊 Showing {filteredHistory.length} update(s) across {Object.keys(groupedByFile).length} file(s)
      </div>

      {/* Timeline */}
      {Object.keys(groupedByFile).length === 0 ? (
        <div style={{ background: "white", padding: "60px", borderRadius: "12px", textAlign: "center", border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "4px" }}>No History Found</h3>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Try adjusting your filters</p>
        </div>
      ) : (
        Object.entries(groupedByFile).map(([fileId, items]) => {
          const fileInfo = items[0];
          return (
            <div key={fileId} style={{ background: "white", padding: "24px", borderRadius: "12px", marginBottom: "20px", border: "1px solid #e5e7eb" }}>
              {/* File Header */}
              <div style={{ marginBottom: "24px", padding: "16px", background: "#f9fafb", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "4px" }}>
                      📁 File #{fileId} - {fileInfo.customerName}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>Customer ID: {fileInfo.customerId}</p>
                  </div>
                  <div style={{ padding: "6px 12px", background: "#3b82f6", color: "white", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>
                    {items.length} Updates
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div style={{ position: "relative", paddingLeft: "32px" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "0",
                    bottom: "0",
                    width: "2px",
                    background: "#e5e7eb",
                  }}
                />

                {items
                  .sort((a, b) => new Date(b.dateOfProcess) - new Date(a.dateOfProcess))
                  .map((item, index) => {
                    const config = statusConfig[item.statusType];
                    return (
                      <div key={item.id} style={{ marginBottom: index < items.length - 1 ? "20px" : "0", position: "relative" }}>
                        <div
                          style={{
                            position: "absolute",
                            left: "-26px",
                            top: "4px",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: config.color,
                            border: "2px solid white",
                            boxShadow: "0 0 0 2px #e5e7eb",
                          }}
                        />

                        <div
                          style={{
                            padding: "16px",
                            background: config.bg,
                            border: `1px solid ${config.color}40`,
                            borderRadius: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "4px 10px",
                              background: config.color,
                              color: "white",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              marginBottom: "10px",
                            }}
                          >
                            <span>{config.icon}</span>
                            <span>{config.label}</span>
                          </div>

                          <p style={{ fontSize: "14px", color: "#111827", fontWeight: "500", marginBottom: "6px", margin: 0 }}>
                            {item.description}
                          </p>

                          {item.remark && (
                            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px", fontStyle: "italic" }}>
                              💬 {item.remark}
                            </p>
                          )}

                          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "12px", color: "#6b7280", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb" }}>
                            <div>
                              📅 {new Date(item.dateOfProcess).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </div>
                            <div>⏰ {item.timestamp}</div>
                            <div>👤 {item.updatedBy}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default StatusHistory;
import { useState } from "react";

const CustomerReports = () => {
  const [customers] = useState(JSON.parse(localStorage.getItem("customers")) || []);
  const [loanFiles] = useState(JSON.parse(localStorage.getItem("loanFiles")) || []);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Get unique districts
  const uniqueDistricts = [...new Set(customers.map((c) => c.district).filter(Boolean))];

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      (customer.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (customer.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (customer.contact || "").toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = districtFilter === "All" || customer.district === districtFilter;
    const regDate = customer.registrationDate || customer.registration_date || "";
    const matchesFrom = !dateRange.from || regDate >= dateRange.from;
    const matchesTo = !dateRange.to || regDate <= dateRange.to;
    return matchesSearch && matchesDistrict && matchesFrom && matchesTo;
  });

  // Calculate customer stats
  const customerStats = filteredCustomers.map((customer) => {
    const customerFiles = loanFiles.filter(
      (f) => f.customerId === customer.id || (f.customerName || f.customer_name) === customer.name
    );
    const totalLoanAmount = customerFiles.reduce((sum, f) => sum + parseFloat(f.amount || f.loanAmount || 0), 0);
    const approvedFiles = customerFiles.filter((f) => (f.fileStatus || f.file_status) === "Approved").length;

    return {
      ...customer,
      totalFiles: customerFiles.length,
      totalLoanAmount,
      approvedFiles,
      pendingFiles: customerFiles.length - approvedFiles,
    };
  });

  // Overall stats
  const overallStats = {
    totalCustomers: filteredCustomers.length,
    activeCustomers: customerStats.filter((c) => c.totalFiles > 0).length,
    totalLoans: customerStats.reduce((sum, c) => sum + c.totalFiles, 0),
    totalAmount: customerStats.reduce((sum, c) => sum + c.totalLoanAmount, 0),
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const exportCSV = () => {
    const headers = ["Customer Name", "Email", "Contact", "District", "Total Files", "Total Amount", "Approved", "Pending"];
    const rows = customerStats.map((c) => [
      c.name,
      c.email,
      c.contact,
      c.district,
      c.totalFiles,
      c.totalLoanAmount,
      c.approvedFiles,
      c.pendingFiles,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer-reports-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => (window.location.href = "/admin/reports")}
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
          Back to Reports
        </button>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>
          Customer Reports
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
          Analyze customer activity and loan patterns
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Customers", value: overallStats.totalCustomers, icon: "👥", color: "#8b5cf6" },
          { label: "Active Customers", value: overallStats.activeCustomers, icon: "✅", color: "#10b981" },
          { label: "Total Loans", value: overallStats.totalLoans, icon: "📋", color: "#3b82f6" },
          { label: "Total Amount", value: formatCurrency(overallStats.totalAmount), icon: "💰", color: "#f59e0b" },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "12px" }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
              {stat.label}
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#111827" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#6b7280", marginBottom: "6px" }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, email, contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              District
            </label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                background: "white",
              }}
            >
              <option value="All">All Districts</option>
              {uniqueDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
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

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={exportCSV}
            style={{
              padding: "10px 20px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            📥 Export CSV
          </button>
          <button
            onClick={() => window.print()}
            style={{
              padding: "10px 20px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🖨️ Print Report
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Customer Name", "Email", "Contact", "District", "Total Files", "Total Amount", "Approved", "Pending"].map((header) => (
                <th key={header} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customerStats.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: "60px", textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>👥</div>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "4px" }}>No customers found</div>
                  <div style={{ fontSize: "14px", color: "#6b7280" }}>Try adjusting your filters</div>
                </td>
              </tr>
            ) : (
              customerStats
                .sort((a, b) => b.totalLoanAmount - a.totalLoanAmount)
                .map((customer) => (
                  <tr key={customer.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{customer.name}</td>
                    <td style={{ padding: "16px", fontSize: "13px", color: "#6b7280" }}>{customer.email}</td>
                    <td style={{ padding: "16px", fontSize: "13px", color: "#374151", fontFamily: "monospace" }}>{customer.contact}</td>
                    <td style={{ padding: "16px", fontSize: "13px", color: "#374151" }}>{customer.district}</td>
                    <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{customer.totalFiles}</td>
                    <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "#10b981", fontFamily: "monospace" }}>
                      {formatCurrency(customer.totalLoanAmount)}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ display: "inline-block", padding: "4px 10px", background: "#d1fae5", color: "#065f46", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>
                        {customer.approvedFiles}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ display: "inline-block", padding: "4px 10px", background: "#fef3c7", color: "#92400e", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>
                        {customer.pendingFiles}
                      </span>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          table, table * {
            visibility: visible;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerReports;
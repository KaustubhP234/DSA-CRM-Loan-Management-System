import { useState, useEffect } from "react";

const AddCommission = () => {
  const [formData, setFormData] = useState({
    file_id: "",
    commission_percentage: "",
    payment_status: "Pending",
    payment_mode: "",
    remarks: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loanFiles, setLoanFiles] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [calculatedCommission, setCalculatedCommission] = useState(0);

  useEffect(() => {
    const storedLoans = JSON.parse(localStorage.getItem("loanFiles")) || [];
    setLoanFiles(storedLoans);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "file_id") {
      const loan = loanFiles.find((l) => String(l.id) === String(value));
      setSelectedLoan(loan);
      if (formData.commission_percentage && loan) {
        const loanAmount = parseFloat(loan.amount || loan.loanAmount || 0);
        const percentage = parseFloat(formData.commission_percentage);
        setCalculatedCommission((loanAmount * percentage) / 100);
      }
    }

    if (name === "commission_percentage" && value) {
      if (selectedLoan) {
        const loanAmount = parseFloat(selectedLoan.amount || selectedLoan.loanAmount || 0);
        const percentage = parseFloat(value);
        setCalculatedCommission((loanAmount * percentage) / 100);
      }
    }

    if (name === "commission_percentage" && !value) {
      setCalculatedCommission(0);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.file_id) newErrors.file_id = "Please select a loan file";
    if (!formData.commission_percentage) {
      newErrors.commission_percentage = "Commission percentage is required";
    } else if (parseFloat(formData.commission_percentage) < 0 || parseFloat(formData.commission_percentage) > 10) {
      newErrors.commission_percentage = "Percentage must be between 0 and 10";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const commissions = JSON.parse(localStorage.getItem("commissions")) || [];
    const newCommission = {
      id: commissions.length > 0 ? Math.max(...commissions.map((c) => c.id)) + 1 : 1,
      commission_id: `COM${String(commissions.length + 1).padStart(3, "0")}`,
      file_id: formData.file_id,
      customer_name: selectedLoan?.customerName || selectedLoan?.customer_name || "Unknown",
      bank_name: selectedLoan?.bankName || selectedLoan?.bank_name || "Unknown",
      loan_type: selectedLoan?.loanType || selectedLoan?.loan_type || "Unknown",
      loan_amount: parseFloat(selectedLoan?.amount || selectedLoan?.loanAmount || 0),
      commission_percentage: parseFloat(formData.commission_percentage),
      commission_amount: calculatedCommission,
      payment_status: formData.payment_status,
      payment_date: formData.payment_status === "Paid" ? new Date().toISOString().split("T")[0] : null,
      payment_mode: formData.payment_mode || null,
      assigned_to: "Admin User",
      disbursement_date: selectedLoan?.disbursementDate || selectedLoan?.disbursement_date || new Date().toISOString().split("T")[0],
      remarks: formData.remarks.trim() || "Commission entry created",
    };

    commissions.push(newCommission);
    localStorage.setItem("commissions", JSON.stringify(commissions));
    alert("✅ Commission added successfully!");
    setTimeout(() => {
      setIsSubmitting(false);
      window.location.href = "/admin/commission";
    }, 500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => (window.location.href = "/admin/commission")}
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
          Add Commission
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
          Create a new commission entry for loan disbursement
        </p>
      </div>

      {/* Info Alert */}
      <div style={{ background: "#ecfdf5", border: "1px solid #10b981", borderRadius: "10px", padding: "14px 16px", marginBottom: "24px", display: "flex", gap: "12px" }}>
        <span style={{ fontSize: "20px" }}>💡</span>
        <div style={{ fontSize: "13px", color: "#065f46", lineHeight: "1.6" }}>
          <strong>Commission Guidelines:</strong> Commission is auto-calculated based on loan amount. Typical rates range from 0.5% to 4%. Enter the percentage to see the calculated amount instantly.
        </div>
      </div>

      {/* Form */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px" }}>
        {/* Loan Selection */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
            Select Loan File <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <select
            name="file_id"
            value={formData.file_id}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              border: errors.file_id ? "1px solid #dc2626" : "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              background: "white",
            }}
          >
            <option value="">Choose a loan file...</option>
            {loanFiles.map((loan) => (
              <option key={loan.id} value={loan.id}>
                {loan.customerName || loan.customer_name} - {loan.loanType || loan.loan_type} - {formatCurrency(loan.amount || loan.loanAmount || 0)}
              </option>
            ))}
          </select>
          {errors.file_id && <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "6px" }}>{errors.file_id}</div>}
          {loanFiles.length === 0 && (
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
              No loan files available. Please create loan files first.
            </div>
          )}
        </div>

        {/* Loan Details Card */}
        {selectedLoan && (
          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "20px", marginBottom: "24px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>
              Loan Details
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#6b7280", marginBottom: "4px" }}>Customer</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                  {selectedLoan.customerName || selectedLoan.customer_name}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#6b7280", marginBottom: "4px" }}>Bank</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                  {selectedLoan.bankName || selectedLoan.bank_name}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#6b7280", marginBottom: "4px" }}>Loan Type</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                  {selectedLoan.loanType || selectedLoan.loan_type}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#6b7280", marginBottom: "4px" }}>Loan Amount</div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#10b981", fontFamily: "monospace" }}>
                  {formatCurrency(selectedLoan.amount || selectedLoan.loanAmount || 0)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Commission Details */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
              Commission (%) <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="number"
              name="commission_percentage"
              value={formData.commission_percentage}
              onChange={handleChange}
              placeholder="e.g., 2.5"
              step="0.1"
              min="0"
              max="10"
              style={{
                width: "100%",
                padding: "12px",
                border: errors.commission_percentage ? "1px solid #dc2626" : "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            {errors.commission_percentage && (
              <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "6px" }}>{errors.commission_percentage}</div>
            )}
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>Between 0 and 10</div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
              Payment Status <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                background: "white",
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          {formData.payment_status === "Paid" && (
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Payment Mode
              </label>
              <select
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  background: "white",
                }}
              >
                <option value="">Select mode...</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          )}
        </div>

        {/* Commission Calculator */}
        {selectedLoan && formData.commission_percentage && (
          <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: "12px", padding: "24px", marginBottom: "24px", color: "white" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px", opacity: 0.9 }}>
              <span style={{ fontSize: "20px" }}>🧮</span>
              Calculated Commission
            </div>
            <div style={{ fontSize: "36px", fontWeight: "800", fontFamily: "monospace", marginBottom: "8px" }}>
              {formatCurrency(calculatedCommission)}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.9, fontFamily: "monospace" }}>
              {formatCurrency(selectedLoan.amount || selectedLoan.loanAmount || 0)} × {formData.commission_percentage}%
            </div>
          </div>
        )}

        {/* Remarks */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
            Remarks (Optional)
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Add any additional notes..."
            rows="3"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Discard changes?")) window.location.href = "/admin/commission";
            }}
            style={{
              padding: "12px 24px",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedLoan || !formData.commission_percentage}
            style={{
              padding: "12px 24px",
              background: isSubmitting || !selectedLoan || !formData.commission_percentage ? "#9ca3af" : "#10b981",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              color: "white",
              cursor: isSubmitting || !selectedLoan || !formData.commission_percentage ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Adding..." : "Add Commission"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCommission;
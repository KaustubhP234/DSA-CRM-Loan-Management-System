import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const UploadDocumentFixed = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    documentType: "",
    documentName: "",
    documentNumber: "",
    fileId: "",
    customerId: "",
    description: "",
    remark: "",
  });

  const [loanFiles, setLoanFiles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Document types
  const documentTypes = [
    "Aadhaar Card",
    "PAN Card",
    "Bank Statement",
    "Salary Slip",
    "Property Documents",
    "Income Proof",
    "Address Proof",
    "ITR",
    "Form 16",
    "Business Documents",
    "Passport",
    "Driving License",
    "Voter ID",
    "Other",
  ];

  useEffect(() => {
    // Load loan files
    const files = JSON.parse(localStorage.getItem("loanFiles")) || [];
    setLoanFiles(files);

    // Load customers
    const custs = JSON.parse(localStorage.getItem("customers")) || [];
    setCustomers(custs);
  }, []);

  // When file is selected, auto-fill customer
  useEffect(() => {
    if (formData.fileId) {
      const file = loanFiles.find((f) => String(f.id) === String(formData.fileId));
      if (file) {
        setSelectedFile(file);
        setFormData((prev) => ({
          ...prev,
          customerId: file.customerId || file.customer_id || "",
        }));
      }
    }
  }, [formData.fileId, loanFiles]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fileId) {
      alert("❌ Please select a loan file!");
      return;
    }

    if (!formData.documentType) {
      alert("❌ Please select document type!");
      return;
    }

    if (!formData.documentName) {
      alert("❌ Please enter document name!");
      return;
    }

    // Get existing documents
    const existingDocs = JSON.parse(localStorage.getItem("documents")) || [];

    // Find customer info
    const file = loanFiles.find((f) => String(f.id) === String(formData.fileId));
    const customerName = file ? file.customerName || file.customer_name : "";

    // Generate new document ID
    const newDocId = existingDocs.length + 1;

    // Create new document with REAL file_id
    const newDocument = {
      id: Date.now(),
      doc_id: `DOC${String(newDocId).padStart(3, "0")}`,
      type: formData.documentType,
      document_type: formData.documentType,
      name: formData.documentName,
      document_name: formData.documentName,
      date_of_submission: new Date().toISOString().split("T")[0],
      submission_date: new Date().toISOString().split("T")[0],
      date: new Date().toISOString().split("T")[0],
      doc_number: formData.documentNumber || "N/A",
      customer_id: formData.customerId || file?.customerId || file?.customer_id,
      customer_name: customerName,
      file_id: String(formData.fileId), // ← CRITICAL: Real loan file ID
      fileId: String(formData.fileId), // Alternative field
      loan_file_id: String(formData.fileId), // Another alternative
      description: formData.description || "",
      remark: formData.remark || "Pending verification",
      status: "Pending",
      verification_status: "Pending",
    };

    // Save to localStorage
    const updatedDocs = [...existingDocs, newDocument];
    localStorage.setItem("documents", JSON.stringify(updatedDocs));

    alert("✅ Document uploaded successfully!");
    navigate("/admin/documents");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .upload-document-container {
          font-family: 'Inter', sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          background: linear-gradient(135deg, #004E89 0%, #003366 100%);
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          color: white;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .page-description {
          font-size: 0.9375rem;
          margin: 0;
          opacity: 0.9;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .form-grid {
          display: grid;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
        }

        .required {
          color: #ef4444;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9375rem;
          transition: all 0.2s;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #004E89;
          box-shadow: 0 0 0 3px rgba(0, 78, 137, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .file-info-card {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          margin-top: 1rem;
        }

        .file-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .file-info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .file-info-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }

        .file-info-value {
          font-size: 0.9375rem;
          color: #0f172a;
          font-weight: 600;
        }

        .form-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #004E89, #003366);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 78, 137, 0.3);
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #475569;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
        }

        .alert {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .alert-info {
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #93c5fd;
        }

        .alert-warning {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        }

        @media (max-width: 768px) {
          .upload-document-container {
            padding: 1rem;
          }

          .file-info-grid {
            grid-template-columns: 1fr;
          }

          .form-buttons {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="upload-document-container">
        <div className="page-header">
          <h1 className="page-title">📄 Upload Document</h1>
          <p className="page-description">
            Upload documents for loan file verification
          </p>
        </div>

        {loanFiles.length === 0 && (
          <div className="alert alert-warning">
            ⚠️ <strong>No loan files found!</strong> Please create a loan file first before uploading documents.
          </div>
        )}

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Loan File Selection */}
              <div className="form-group">
                <label className="form-label">
                  Select Loan File <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.fileId}
                  onChange={(e) =>
                    setFormData({ ...formData, fileId: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select Loan File --</option>
                  {loanFiles.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.id} - {file.customerName || file.customer_name} -{" "}
                      {file.loanType || file.loan_type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show file info when selected */}
              {selectedFile && (
                <div className="file-info-card">
                  <div className="file-info-grid">
                    <div className="file-info-item">
                      <span className="file-info-label">File ID</span>
                      <span className="file-info-value">{selectedFile.id}</span>
                    </div>
                    <div className="file-info-item">
                      <span className="file-info-label">Customer</span>
                      <span className="file-info-value">
                        {selectedFile.customerName || selectedFile.customer_name}
                      </span>
                    </div>
                    <div className="file-info-item">
                      <span className="file-info-label">Loan Type</span>
                      <span className="file-info-value">
                        {selectedFile.loanType || selectedFile.loan_type}
                      </span>
                    </div>
                    <div className="file-info-item">
                      <span className="file-info-label">Bank</span>
                      <span className="file-info-value">
                        {selectedFile.bankName || selectedFile.bank_name}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Type */}
              <div className="form-group">
                <label className="form-label">
                  Document Type <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.documentType}
                  onChange={(e) =>
                    setFormData({ ...formData, documentType: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select Document Type --</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Name */}
              <div className="form-group">
                <label className="form-label">
                  Document Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Aadhaar Card Front"
                  value={formData.documentName}
                  onChange={(e) =>
                    setFormData({ ...formData, documentName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Document Number */}
              <div className="form-group">
                <label className="form-label">Document Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 1234-5678-9012"
                  value={formData.documentNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, documentNumber: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Add any additional details about the document..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Remark */}
              <div className="form-group">
                <label className="form-label">Remark</label>
                <textarea
                  className="form-textarea"
                  placeholder="Add any remarks..."
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData({ ...formData, remark: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="form-buttons">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin/documents")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                📤 Upload Document
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadDocumentFixed;
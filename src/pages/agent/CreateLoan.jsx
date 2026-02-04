import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateLoan = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    loanType: "Home Loan",
    amount: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingLoans =
      JSON.parse(localStorage.getItem("loanFiles")) || [];

const newLoan = {
  id: Date.now(),
  name: form.name,
  loanType: form.loanType,
  amount: form.amount,
  status: "In-Process",
  createdBy: "AGENT",
};
    localStorage.setItem(
      "loanFiles",
      JSON.stringify([...existingLoans, newLoan])
    );

    alert("Loan File Created Successfully");
    navigate("/admin/loan-files");
  };

  return (
    <div style={styles.container}>
      <h1>Create Loan File</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          required
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="loanType"
          onChange={handleChange}
          style={styles.input}
        >
          <option>Home Loan</option>
          <option>Vehicle Loan</option>
          <option>Personal Loan</option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Loan Amount"
          required
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Create Loan
        </button>
      </form>
    </div>
  );
};

export default CreateLoan;

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    maxWidth: "500px",
  },
  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

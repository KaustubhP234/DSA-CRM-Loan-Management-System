import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
  e.preventDefault();

  if (!role || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  const user = {
    email: email,
    name: email.split("@")[0],
    role: role === "admin" ? "Admin" : 
          role === "operator" ? "Data Operator" :
          role === "marketing" ? "Marketing Executive" :
          role === "bank" ? "Bank Executive" : "User"
  };

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  localStorage.setItem("role", role);
  localStorage.setItem("loggedUser", email);

  // Route based on role
  if (role === "admin") {
    navigate("/admin/dashboard");
  } else if (role === "operator") {
    navigate("/data-operator");
  } else if (role === "bank") {
    navigate("/bank-executive");
} else if (role === "marketing") {
  navigate("/marketing");  // Changed from /marketing/dashboard
  } else {
    navigate("/");
  }
};


  return (
    <div className="login-wrapper">
      {/* LEFT BRAND SECTION */}
      <div className="login-brand">
        <h1>DSA CRM</h1>
        <p>
          Secure fintech platform to manage loan applications, DSAs,
          bank partners, commissions, and real-time tracking.
        </p>

        <ul>
          <li>✔ Role-based access</li>
          <li>✔ Secure loan processing</li>
          <li>✔ Real-time dashboards</li>
        </ul>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue</p>

        <form onSubmit={handleLogin}>
          <label>Select Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Choose Role</option>
            <option value="admin">Admin</option>
            <option value="operator">Data Operator</option>
            <option value="marketing">Marketing Executive</option>
            <option value="bank">Bank Executive</option>
          </select>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="example@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <div className="login-footer">
          <span>© 2025 DSA CRM System</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./charts"; // 🔥 required for charts

import "./styles/theme.css";
import "./styles/animations.css";

// CoreUI CSS
import "@coreui/coreui/dist/css/coreui.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

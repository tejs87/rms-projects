import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import api from "./api/axios";

const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

createRoot(document.getElementById("root")).render(<App />);

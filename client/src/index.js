import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import { AuthContexProvider } from "./context/authContext";
// import hljs from 'highlight.js';

axios.defaults.baseURL = `${process.env.REACT_APP_API_URI}`
axios.defaults.withCredentials = true

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContexProvider>
        <App />
    </AuthContexProvider>
  </React.StrictMode>
);

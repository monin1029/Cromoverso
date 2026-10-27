import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./styles/tokens.css"
import "./styles/global.css"
import App from "./App.jsx"
import React from "react";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
)
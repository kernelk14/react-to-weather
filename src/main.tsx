import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./pico-main/css/pico.min.css";
import "./pico-main/css/pico.colors.min.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

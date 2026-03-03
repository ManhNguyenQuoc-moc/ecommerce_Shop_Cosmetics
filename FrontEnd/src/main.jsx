import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AntThemeProvider from "./providers/AntThemeProvider";
import { App as AntdApp } from "antd";
import App from './App.jsx'
import "./assets/styles/index.css";
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AntThemeProvider>
            <AntdApp>
                <App />
            </AntdApp>
        </AntThemeProvider>
    </StrictMode>
);

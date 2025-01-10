import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { HelmetProvider } from "react-helmet-async";
import { UserProvider } from "./Context/UserContext";
import { GlobalProvider } from "./Context/GlobalContextOne";
import { TestProvider } from "./Context/TestContext";
import { InitialProvider } from "./Context/InitialContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

if (process.env.NODE_ENV === "development") {
  const originalWarn = console.warn;
  console.warn = function (...args) {
    if (
      typeof args[0] === "string" &&
      args[0].includes("third-party cookie will be blocked")
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

root.render(
  // <React.StrictMode>
  <HelmetProvider>
    <InitialProvider>
      <UserProvider>
        <GlobalProvider>
          <TestProvider>
            <App />
          </TestProvider>
        </GlobalProvider>
      </UserProvider>
    </InitialProvider>
  </HelmetProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

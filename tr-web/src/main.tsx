import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("root element not found");
}

document.addEventListener("touchmove", function(event: any) {
  // In some contexts (iOS + FB Messanger in-app browser) dragging down can result in the whole tab/window being pulled down,
  // as if to minimize the app. This prevents that.
  if (event.target?.tagName === "CANVAS") {
    event.preventDefault();
  } 
}, { passive: false });

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

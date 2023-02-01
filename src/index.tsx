import React from "react";
import ReactDom from "react-dom/client";
// @ts-ignore
import App from "./App.tsx";

const root = ReactDom.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<App />);

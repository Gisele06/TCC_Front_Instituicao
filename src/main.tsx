import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/alice/400.css";
import "./index.css";
import Aplicativo from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Aplicativo />
  </StrictMode>,
);

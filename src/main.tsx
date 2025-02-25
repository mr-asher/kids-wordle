import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Wordling from "./Wordling";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Wordling />
  </StrictMode>,
);

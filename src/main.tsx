import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-simple-keyboard/build/css/index.css";
import Wordling from "./Wordling";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Wordling />
    <Analytics />
  </StrictMode>,
);

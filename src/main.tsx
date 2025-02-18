import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import SchedulePage from "@/pages/SchedulePage";
import "./index.css";
import Layout from "@/components/Layout/Layout";
import SpeakerPage from "./pages/SpeakerPage";
import SponsorsPage from "./pages/SponsorsPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<Layout />}>
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/speakers/:year/:name" element={<SpeakerPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

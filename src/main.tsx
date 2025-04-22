import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import SchedulePage from "@/pages/SchedulePage";
import "./index.css";
import Layout from "@/components/Layout/Layout";
import SpeakerPage from "./pages/SpeakerPage";
import SponsorsPage from "./pages/SponsorsPage";
import AboutPage from "./pages/AboutPage";
import VenuePage from "./pages/VenuePage";
import SpeakersPage from "./pages/SpeakersPage";

console.log(import.meta.env.BASE_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<Layout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/venue" element={<VenuePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/speakers/:year/:name" element={<SpeakerPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

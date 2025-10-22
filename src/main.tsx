import Layout from "@/components/Layout/Layout";
import HomePage from "@/pages/HomePage";
import SchedulePage from "@/pages/SchedulePage";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext.Provider";
import "./index.css";
import AboutPage from "./pages/AboutPage";
import SpeakerPage from "./pages/SpeakerPage";
import SpeakersPage from "./pages/SpeakersPage";
import SponsorsPage from "./pages/SponsorsPage";
import TransparencyPage from "./pages/TransparencyPage";
import VenuePage from "./pages/VenuePage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<Layout />}>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/venue" element={<VenuePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/speakers/:year" element={<SpeakersPage />} />
            <Route path="/speaker/:name" element={<SpeakerPage />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/transparency" element={<TransparencyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
);

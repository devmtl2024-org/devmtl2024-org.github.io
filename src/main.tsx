import Layout from "@/components/Layout/Layout";
import HomePage from "@/pages/HomePage";
import SchedulePage from "@/pages/SchedulePage";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext.Provider";
import "./index.css";
import AboutPage from "./pages/AboutPage";
import ConductPage from "./pages/ConductPage";
import SpeakerPage from "./pages/SpeakerPage";
import SpeakersPage from "./pages/SpeakersPage";
import SponsorsPage from "./pages/SponsorsPage";
import SponsorshipPage from "./pages/SponsorshipPage";
import TransparencyPage from "./pages/TransparencyPage";
import VideosPage from "./pages/VideosPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<Layout />}>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/speakers/:year" element={<SpeakersPage />} />
            <Route path="/speaker/:name" element={<SpeakerPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/sponsorship" element={<SponsorshipPage />} />
            <Route path="/transparency" element={<TransparencyPage />} />
            <Route path="/conduct" element={<ConductPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
);

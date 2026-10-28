import Layout from "@/components/Layout/Layout";
import HomePage from "@/pages/HomePage";
import SchedulePage from "@/pages/SchedulePage";
import { StrictMode, Suspense, lazy } from "react";
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

// Only sponsors use it, and the QR decoder is heavy
const ScanPage = lazy(() => import("./pages/ScanPage"));
// Only rendered to images for the venue's TVs, see signage/render.mjs
const SignagePage = lazy(() => import("./pages/SignagePage"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/scan"
            element={
              <Suspense>
                <ScanPage />
              </Suspense>
            }
          />
          <Route
            path="/signage"
            element={
              <Suspense>
                <SignagePage />
              </Suspense>
            }
          />
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

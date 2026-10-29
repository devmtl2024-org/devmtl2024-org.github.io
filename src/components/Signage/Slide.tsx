import Logo from "@/assets/logo.svg?react";
import { ReactNode } from "react";

export type Reel = "infos" | "promo";

// Without a reel, a slide is only rendered to its .jpg
type SlideProps = {
  id: string;
  children: ReactNode;
} & ({ reel: Reel; seconds: number } | { reel?: never; seconds?: never });

// Fixed TV size: signage/render.mjs screenshots each slide as is
export function Slide({ id, reel, seconds, children }: SlideProps) {
  return (
    <section
      data-slide={id}
      data-reel={reel}
      data-seconds={seconds}
      className="relative flex h-[1080px] w-[1920px] shrink-0 flex-col overflow-hidden bg-primary-dark font-['Archivo'] text-white"
    >
      {children}
    </section>
  );
}

type SlideHeaderProps = {
  fr: string;
  en: string;
};

export function SlideHeader({ fr, en }: SlideHeaderProps) {
  return (
    <header className="flex items-end justify-between px-16 pb-6 pt-10">
      <div>
        <h2 className="text-6xl font-extrabold uppercase tracking-tight">
          {fr}
        </h2>
        <p className="mt-2 text-4xl font-semibold uppercase text-secondary">
          {en}
        </p>
      </div>
      <div className="flex flex-col items-end gap-3">
        <Logo fill="white" stroke="white" className="h-14 w-auto" />
        <p className="font-['JetBrains_Mono'] text-2xl tracking-widest text-secondary-light">
          27.11.2026
        </p>
      </div>
    </header>
  );
}

import Logo from "@/assets/logo.svg?react";
import { Slide } from "./Slide";

export function WelcomeSlide() {
  return (
    <Slide id="bienvenue" reel="promo" seconds={10}>
      <div className="flex flex-1 flex-col items-center justify-center gap-14">
        <Logo fill="white" stroke="white" className="h-48 w-auto" />
        <div className="text-center">
          <p className="text-[160px] font-black uppercase leading-none tracking-tight">
            Bienvenue
          </p>
          <p className="text-8xl font-extrabold uppercase text-secondary">
            Welcome
          </p>
        </div>
        <p className="text-center text-3xl font-semibold uppercase tracking-widest text-secondary-light">
          La conférence des communautés tech de Montréal
          <br />
          Montreal&apos;s community-driven tech conference
        </p>
      </div>
      <p className="absolute inset-x-0 bottom-12 text-center font-['JetBrains_Mono'] text-2xl tracking-widest text-secondary-light">
        27.11.2026 · UNIVERSITÉ CONCORDIA · DEV-MTL.CA
      </p>
    </Slide>
  );
}

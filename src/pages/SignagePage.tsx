import { pauses } from "@/assets/pauses";
import { FloorPlanSlide } from "@/components/Signage/FloorPlanSlide";
import { QrSlide } from "@/components/Signage/QrSlide";
import { ScheduleSlide } from "@/components/Signage/ScheduleSlide";
import { splitAtLunch } from "@/components/Signage/splitAtLunch";
import {
  SponsorSlide,
  SponsorsSlide,
} from "@/components/Signage/SponsorSlides";
import { WelcomeSlide } from "@/components/Signage/WelcomeSlide";
import { useSponsors } from "@/hooks/useSponsors";
import { ScheduleSession } from "@/type/schedule";
import { Speaker } from "@/type/speakers";
import { groupSpeakersByTime } from "@/utils/groupSpeakers";
import { loadSpeakers } from "@/utils/loadData";
import { useCallback, useEffect, useState } from "react";

// Default export: React.lazy only loads default exports
export default function SignagePage() {
  const [schedule, setSchedule] = useState<ScheduleSession[]>([]);
  const [isQrReady, setIsQrReady] = useState(false);
  const onQrReady = useCallback(() => setIsQrReady(true), []);
  const sponsors = useSponsors();
  const { morning, afternoon } = splitAtLunch(schedule);
  const allTiers = [
    sponsors.orSponsors,
    sponsors.argentSponsors,
    sponsors.bronzeSponsors,
  ];
  const isReady =
    schedule.length > 0 && sponsors.allSponsors.length > 0 && isQrReady;

  useEffect(() => {
    loadSpeakers<Speaker>(2026).then((speakers) =>
      setSchedule(groupSpeakersByTime(speakers, pauses)),
    );
  }, []);

  return (
    <div
      data-signage-ready={isReady || undefined}
      className="flex flex-col items-start gap-10 bg-gray-300 p-10"
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo:wght@100..900&family=JetBrains+Mono:wght@100..800&display=block"
      />
      <h1 className="text-3xl font-bold">Vidéo infos</h1>
      <ScheduleSlide
        id="programme-matin"
        title={{ fr: "Programme · Matin", en: "Schedule · Morning" }}
        sessions={morning}
      />
      <ScheduleSlide
        id="programme-apres-midi"
        title={{ fr: "Programme · Après-midi", en: "Schedule · Afternoon" }}
        sessions={afternoon}
      />
      <SponsorsSlide id="merci-infos" reel="infos" tiers={allTiers} />
      <FloorPlanSlide />
      <QrSlide onReady={onQrReady} />

      <h1 className="text-3xl font-bold">Vidéo promo</h1>
      <WelcomeSlide />
      {[...sponsors.orSponsors, ...sponsors.argentSponsors].map((sponsor) => (
        <SponsorSlide key={sponsor.name} sponsor={sponsor} />
      ))}
      <SponsorsSlide id="merci-promo" reel="promo" tiers={allTiers} />
    </div>
  );
}

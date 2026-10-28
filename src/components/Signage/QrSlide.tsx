import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Slide, SlideHeader } from "./Slide";

const SCHEDULE_URL = "https://dev-mtl.ca/schedule";

export function QrSlide({ onReady }: { onReady: () => void }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    QRCode.toString(SCHEDULE_URL, {
      type: "svg",
      margin: 0,
      errorCorrectionLevel: "M",
      color: { dark: "#01055E", light: "#ffffff" },
    }).then((svg) => {
      setSvg(svg);
      onReady();
    });
  }, [onReady]);

  return (
    <Slide id="qr-code" reel="infos" seconds={10}>
      <SlideHeader fr="Tout le programme" en="The full schedule" />
      <div className="flex flex-1 items-center justify-center gap-28 pb-16">
        <div className="max-w-[760px]">
          <p className="text-6xl font-extrabold leading-tight">
            Dans votre poche
          </p>
          <p className="mt-2 text-5xl font-bold leading-tight text-secondary">
            In your pocket
          </p>
          <p className="mt-14 text-3xl text-secondary-light">
            Talks, horaires, conférencier(e)s
            <br />
            Talks, times, speakers
          </p>
          <p className="mt-14 font-['JetBrains_Mono'] text-4xl font-bold">
            dev-mtl.ca/schedule
          </p>
        </div>
        <div
          className="size-[600px] rounded-3xl bg-white p-12 [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </Slide>
  );
}

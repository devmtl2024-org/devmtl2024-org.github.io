import { useTranslation } from "@/hooks/useTranslation";
import { CameraIcon } from "@heroicons/react/24/outline";
import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";

type CameraState =
  | { status: "off" }
  | { status: "starting" }
  | { status: "on" }
  | { status: "failed"; reason: CameraFailure };

type CameraFailure = "denied" | "no-camera" | "insecure" | "unknown";

// Decoding every frame drains phone batteries for no faster scan
const DECODE_INTERVAL_MS = 150;
const MAX_FRAME_WIDTH = 640;

export function QrScanner({ onDecode }: { onDecode: (text: string) => void }) {
  const { t } = useTranslation();
  const [camera, setCamera] = useState<CameraState>({ status: "off" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const onDecodeRef = useRef(onDecode);
  onDecodeRef.current = onDecode;

  useEffect(() => stopStream, []);

  useEffect(() => {
    const video = videoRef.current;
    if (camera.status !== "on" || !video) {
      return;
    }
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const timer = setInterval(() => {
      if (!context || video.readyState < video.HAVE_ENOUGH_DATA) {
        return;
      }
      const scale = Math.min(1, MAX_FRAME_WIDTH / video.videoWidth);
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(frame.data, frame.width, frame.height, {
        inversionAttempts: "dontInvert",
      });
      if (code?.data) {
        onDecodeRef.current(code.data);
      }
    }, DECODE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [camera.status]);

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera({ status: "failed", reason: "insecure" });
      return;
    }
    setCamera({ status: "starting" });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamera({ status: "on" });
    } catch (error) {
      stopStream();
      setCamera({ status: "failed", reason: failureOf(error) });
    }
  }

  function stop() {
    stopStream();
    setCamera({ status: "off" });
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  const failureMessages: Record<CameraFailure, string> = {
    denied: t({
      fr: "L'accès à la caméra a été refusé. Autorisez-le dans les réglages du navigateur pour ce site, puis réessayez.",
      en: "Camera access was denied. Allow it for this site in your browser settings, then try again.",
    }),
    "no-camera": t({
      fr: "Aucune caméra trouvée sur cet appareil.",
      en: "No camera found on this device.",
    }),
    insecure: t({
      fr: "Ce navigateur ne donne pas accès à la caméra ici. Ouvrez la page en HTTPS dans Safari ou Chrome.",
      en: "This browser doesn't give access to the camera here. Open the page over HTTPS in Safari or Chrome.",
    }),
    unknown: t({
      fr: "Impossible de démarrer la caméra. Fermez les autres applications qui l'utilisent, puis réessayez.",
      en: "Couldn't start the camera. Close other apps using it, then try again.",
    }),
  };

  const isOn = camera.status === "on";

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-primary-dark">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${isOn ? "" : "hidden"}`}
          playsInline
          muted
        />
        {isOn && (
          <div className="pointer-events-none absolute inset-[15%] rounded-xl border-4 border-secondary" />
        )}
        {!isOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
            {camera.status === "failed" && (
              <p role="alert">{failureMessages[camera.reason]}</p>
            )}
            <button
              onClick={start}
              disabled={camera.status === "starting"}
              className="flex items-center gap-2 rounded-full bg-secondary px-6 py-3 font-bold text-primary disabled:opacity-60"
            >
              <CameraIcon className="h-6 w-6" />
              {camera.status === "failed"
                ? t({ fr: "Réessayer", en: "Try again" })
                : t({ fr: "Démarrer la caméra", en: "Start camera" })}
            </button>
          </div>
        )}
      </div>
      {isOn && (
        <button
          onClick={stop}
          className="mt-2 w-full text-sm text-primary underline"
        >
          {t({ fr: "Arrêter la caméra", en: "Stop camera" })}
        </button>
      )}
    </div>
  );
}

function failureOf(error: unknown): CameraFailure {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "denied";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "no-camera";
  }
  return "unknown";
}

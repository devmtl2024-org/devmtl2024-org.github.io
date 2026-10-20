import Logo from "@/assets/logo.svg?react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher/LanguageSwitcher";
import { LeadList } from "@/components/Scan/LeadList";
import { QrScanner } from "@/components/Scan/QrScanner";
import { toCsv } from "@/components/Scan/exportLeads";
import {
  Lead,
  addLead,
  loadLeads,
  removeLead,
  saveLeads,
  updateNote,
} from "@/components/Scan/leads";
import { parseVCard } from "@/components/Scan/vcard";
import { useTranslation } from "@/hooks/useTranslation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Feedback =
  | { kind: "added"; name: string }
  | { kind: "duplicate"; name: string }
  | { kind: "invalid" };

// The camera sees the same badge for several frames in a row
const SAME_CODE_COOLDOWN_MS = 3000;
const FEEDBACK_DURATION_MS = 2500;

// Default export: React.lazy only loads default exports
export default function ScanPage() {
  const { t } = useTranslation();
  const [leads, setLeads] = useState(loadLeads);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isStorageBroken, setIsStorageBroken] = useState(false);
  const lastCode = useRef({ text: "", at: 0 });

  useEffect(() => {
    try {
      saveLeads(leads);
      setIsStorageBroken(false);
    } catch {
      setIsStorageBroken(true);
    }
  }, [leads]);

  useEffect(() => {
    if (!feedback) {
      return;
    }
    const timer = setTimeout(() => setFeedback(null), FEEDBACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [feedback]);

  function handleCode(text: string) {
    const now = Date.now();
    const isSameCode =
      text === lastCode.current.text &&
      now - lastCode.current.at < SAME_CODE_COOLDOWN_MS;
    lastCode.current = { text, at: now };
    if (isSameCode) {
      return;
    }

    const contact = parseVCard(text);
    if (!contact) {
      setFeedback({ kind: "invalid" });
      return;
    }
    const result = addLead(leads, contact, localTimestamp(new Date()));
    setLeads(result.leads);
    setFeedback({ kind: result.outcome, name: contact.fullName });
    if (result.outcome === "added") {
      navigator.vibrate?.(100);
    }
  }

  // Stable callbacks so typing a note doesn't re-render every card
  const handleNoteChange = useCallback(
    (id: string, note: string) =>
      setLeads((current) => updateNote(current, id, note)),
    [],
  );
  const handleRemove = useCallback(
    (id: string) => setLeads((current) => removeLead(current, id)),
    [],
  );

  function handleClearAll() {
    const confirmed = window.confirm(
      t({
        fr: "Effacer tous les contacts de cet appareil? Exportez-les d'abord si vous voulez les garder.",
        en: "Erase all contacts from this device? Export them first if you want to keep them.",
      }),
    );
    if (confirmed) {
      setLeads([]);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between bg-primary px-4 py-3 text-white">
        <Link to="/" aria-label="/dev/mtl">
          <Logo fill="white" stroke="white" className="h-8 w-auto" />
        </Link>
        <LanguageSwitcher />
      </header>

      <main
        className={`mx-auto flex max-w-md flex-col gap-6 px-4 py-6 ${leads.length > 0 ? "pb-28" : ""}`}
      >
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {t({ fr: "Scan de contacts", en: "Lead scanning" })}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {t({
              fr: "Scannez le QR code sur le badge des participants. Les contacts sont gardés sur cet appareil, même si vous fermez la page.",
              en: "Scan the QR code on attendees' badges. Contacts are kept on this device, even if you close the page.",
            })}
          </p>
        </div>

        <QrScanner onDecode={handleCode} />

        <div aria-live="polite" className="min-h-[3.5rem]">
          {feedback && <FeedbackBanner feedback={feedback} />}
        </div>

        {isStorageBroken && (
          <p role="alert" className="rounded-xl bg-red-100 p-3 text-red-800">
            {t({
              fr: "Impossible d'enregistrer sur cet appareil (navigation privée?). Exportez vos contacts avant de fermer la page.",
              en: "Can't save on this device (private browsing?). Export your contacts before closing the page.",
            })}
          </p>
        )}

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-primary">
            {t({ fr: "Contacts", en: "Contacts" })} ({leads.length})
          </h2>
          <LeadList
            leads={leads}
            onNoteChange={handleNoteChange}
            onRemove={handleRemove}
          />
          {leads.length > 0 && (
            <button
              onClick={handleClearAll}
              className="mt-4 text-sm text-red-700 underline"
            >
              {t({ fr: "Tout effacer", en: "Erase everything" })}
            </button>
          )}
        </section>
      </main>

      {leads.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white px-4 py-3">
          <button
            onClick={() => shareCsv(leads)}
            className="mx-auto block w-full max-w-md rounded-full bg-primary px-6 py-3 font-bold text-white"
          >
            {t({
              fr: `Envoyer le CSV (${leads.length})`,
              en: `Send the CSV (${leads.length})`,
            })}
          </button>
        </div>
      )}
    </div>
  );
}

function FeedbackBanner({ feedback }: { feedback: Feedback }) {
  const { t } = useTranslation();

  switch (feedback.kind) {
    case "added":
      return (
        <p className="rounded-xl bg-green-100 p-4 font-bold text-green-900">
          ✓ {t({ fr: "Contact ajouté :", en: "Contact added:" })}{" "}
          {feedback.name}
        </p>
      );
    case "duplicate":
      return (
        <p className="rounded-xl bg-gray-100 p-4 text-gray-800">
          {feedback.name}{" "}
          {t({ fr: "est déjà dans la liste", en: "is already in the list" })}
        </p>
      );
    case "invalid":
      return (
        <p className="rounded-xl bg-red-100 p-4 text-red-800">
          {t({
            fr: "Ce QR code n'est pas une carte de contact.",
            en: "This QR code isn't a contact card.",
          })}
        </p>
      );
  }
}

async function shareCsv(leads: Lead[]) {
  const file = new File([toCsv(leads)], "contacts-devmtl-2026.csv", {
    type: "text/csv",
  });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  // Safari cancels the download if the URL is revoked right away
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function localTimestamp(date: Date) {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 19);
}

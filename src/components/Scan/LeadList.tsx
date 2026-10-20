import { useTranslation } from "@/hooks/useTranslation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { memo } from "react";
import { Lead } from "./leads";

type Callbacks = {
  onNoteChange: (id: string, note: string) => void;
  onRemove: (id: string) => void;
};

export function LeadList({
  leads,
  onNoteChange,
  onRemove,
}: { leads: Lead[] } & Callbacks) {
  const { t } = useTranslation();

  if (leads.length === 0) {
    return (
      <p className="rounded-xl bg-gray-100 p-4 text-center text-gray-600">
        {t({
          fr: "Aucun contact pour l'instant. Scannez le QR code d'un badge pour commencer.",
          en: "No contacts yet. Scan the QR code on a badge to get started.",
        })}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {leads.map((lead) => (
        <LeadItem
          key={lead.id}
          lead={lead}
          onNoteChange={onNoteChange}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}

const LeadItem = memo(function LeadItem({
  lead,
  onNoteChange,
  onRemove,
}: { lead: Lead } & Callbacks) {
  const { t } = useTranslation();

  function confirmRemove() {
    const confirmed = window.confirm(
      t({
        fr: `Supprimer ${lead.fullName} de la liste?`,
        en: `Remove ${lead.fullName} from the list?`,
      }),
    );
    if (confirmed) {
      onRemove(lead.id);
    }
  }

  return (
    <li className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-bold text-primary">{lead.fullName}</p>
          {(lead.title || lead.organization) && (
            <p className="text-sm text-gray-700">
              {[lead.title, lead.organization].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <time dateTime={lead.scannedAt} className="text-xs text-gray-500">
            {lead.scannedAt.slice(11, 16)}
          </time>
          <button
            onClick={confirmRemove}
            className="p-1 text-gray-500 hover:text-red-600"
            aria-label={t({
              fr: `Supprimer ${lead.fullName}`,
              en: `Remove ${lead.fullName}`,
            })}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-1 flex flex-col text-sm">
        {lead.email && (
          <a href={`mailto:${lead.email}`} className="truncate underline">
            {lead.email}
          </a>
        )}
        {lead.phone && <a href={`tel:${lead.phone}`}>{lead.phone}</a>}
        {/* Badge fields are typed by participants: never link a javascript: URL */}
        {lead.url && /^https?:\/\//i.test(lead.url) && (
          <a
            href={lead.url}
            target="_blank"
            rel="noreferrer"
            className="truncate underline"
          >
            {lead.url.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        )}
      </div>
      <textarea
        value={lead.note}
        onChange={(event) => onNoteChange(lead.id, event.target.value)}
        placeholder={t({
          fr: "Note (optionnelle)",
          en: "Note (optional)",
        })}
        aria-label={t({
          fr: `Note sur ${lead.fullName}`,
          en: `Note about ${lead.fullName}`,
        })}
        rows={2}
        className="mt-2 w-full rounded-lg border border-gray-300 p-2 text-base"
      />
    </li>
  );
});

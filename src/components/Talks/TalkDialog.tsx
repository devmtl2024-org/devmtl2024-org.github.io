import { trackNames } from "@/constants/tracks";
import { useTranslation } from "@/hooks/useTranslation";
import { Speaker } from "@/type/speakers";
import { toSpeakerSlug } from "@/utils/speakerSlug";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

// Opened by its parent with `showModal()`. Closing is left to the browser, which
// already handles the Escape key, the backdrop and the focus trap.
export const TalkDialog = forwardRef<
  HTMLDialogElement,
  { speakers: Speaker[] }
>(function TalkDialog({ speakers }, ref) {
  const { t } = useTranslation();
  const [talk] = speakers;
  const presenters = speakers.filter((speaker) => speaker.name !== "");

  return (
    <dialog
      ref={ref}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          close(event);
        }
      }}
      className="w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg p-0 backdrop:bg-primary/60"
    >
      <div className="p-6 md:p-8 text-left">
        <div className="flex items-start justify-between gap-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-secondary-dark">
            {t(trackNames[talk.track - 1])}
            {talk.community && ` · ${talk.community}`}
          </div>

          <button
            onClick={close}
            aria-label={t({ fr: "Fermer", en: "Close" })}
            className="-m-1 p-1 rounded text-2xl leading-none text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <h3 className="text-2xl font-semibold mt-2">
          {talk.title || t({ fr: "Titre à venir", en: "Title coming soon" })}
        </h3>

        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
          {presenters.length === 0 ? (
            <p className="text-gray-600">
              {t({ fr: "À venir", en: "Coming soon" })}
            </p>
          ) : (
            presenters.map((speaker, index) => (
              <Link
                key={index}
                to={`/speaker/${toSpeakerSlug(speaker.name)}`}
                onClick={(event) => {
                  close(event);
                  window.scrollTo({ top: 0 });
                }}
                className="flex items-center gap-3 group"
              >
                <img
                  src={`${import.meta.env.BASE_URL}${speaker.image}`}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="flex flex-col">
                  <span className="font-medium group-hover:text-primary">
                    {speaker.name}
                  </span>
                  {speaker.position && (
                    <span className="text-xs text-gray-500">
                      {speaker.position}
                    </span>
                  )}
                </span>
              </Link>
            ))
          )}
        </div>

        <p className="mt-6 text-gray-600 whitespace-pre-line">
          {talk.description}
        </p>
      </div>
    </dialog>
  );
});

function close({ currentTarget }: { currentTarget: Element }) {
  currentTarget.closest("dialog")?.close();
}

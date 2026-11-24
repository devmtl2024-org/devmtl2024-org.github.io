import { useTranslation } from "@/hooks/useTranslation";
import { FormEvent, useState } from "react";

export const NEWSLETTER_ANCHOR = "infolettre";

const KIT_FORM_ACTION = "https://app.kit.com/forms/9003744/subscriptions";
const KIT_LANDING_PAGE = "https://dev-mtl.kit.com/fa955b0c2d";

type SignupResult =
  | { status: "subscribed" }
  | { status: "needsVerification"; verificationUrl: string }
  | { status: "failed" };

type SignupState = { status: "idle" } | { status: "submitting" } | SignupResult;

export function NewsletterSignup() {
  const { t } = useTranslation();
  const [state, setState] = useState<SignupState>({ status: "idle" });

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });
    setState(await postToKit(new FormData(event.currentTarget)));
  }

  if (state.status === "subscribed") {
    return (
      <p role="status" className="text-lg font-semibold">
        {t({
          fr: "Merci! Vérifiez vos courriels pour confirmer votre inscription.",
          en: "Thanks! Check your inbox to confirm your subscription.",
        })}
      </p>
    );
  }

  // Kit's bot protection holds some signups until the visitor passes a check on its own page
  if (state.status === "needsVerification") {
    return (
      <p role="status" className="text-lg">
        {t({
          fr: "Presque fini! ",
          en: "Almost done! ",
        })}
        <a
          href={state.verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold"
        >
          {t({
            fr: "Confirmez que vous n'êtes pas un robot",
            en: "Confirm you're not a robot",
          })}
        </a>
        {t({
          fr: ", puis vérifiez vos courriels.",
          en: ", then check your inbox.",
        })}
      </p>
    );
  }

  return (
    <form
      onSubmit={subscribe}
      className="flex flex-col sm:flex-row sm:flex-wrap gap-3 max-w-xl mx-auto"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        {t({ fr: "Courriel", en: "Email" })}
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email_address"
        required
        autoComplete="email"
        placeholder={t({ fr: "Votre courriel", en: "Your email" })}
        className="flex-1 px-4 py-4 rounded-md text-primary placeholder-gray-500"
      />
      <button
        type="submit"
        disabled={state.status === "submitting"}
        className="px-8 py-4 bg-secondary text-white font-medium rounded-md shadow-md hover:bg-secondary-dark uppercase disabled:opacity-80"
      >
        {t({ fr: "Me tenir au courant", en: "Keep me posted" })}
      </button>
      {state.status === "failed" && (
        <p role="alert" className="sm:basis-full text-sm">
          {t({
            fr: "Oups, l'inscription n'a pas fonctionné. Réessayez, ou ",
            en: "Oops, that didn't work. Try again, or ",
          })}
          <a
            href={KIT_LANDING_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t({
              fr: "inscrivez-vous sur cette page",
              en: "sign up on this page",
            })}
          </a>
          .
        </p>
      )}
    </form>
  );
}

async function postToKit(formData: FormData): Promise<SignupResult> {
  try {
    const response = await fetch(KIT_FORM_ACTION, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      return { status: "failed" };
    }
    return parseKitResponse(await response.json());
  } catch {
    return { status: "failed" };
  }
}

function parseKitResponse(body: unknown): SignupResult {
  if (typeof body !== "object" || body === null || !("status" in body)) {
    return { status: "failed" };
  }
  if (body.status === "success") {
    return { status: "subscribed" };
  }
  if (
    body.status === "quarantined" &&
    "url" in body &&
    typeof body.url === "string"
  ) {
    return { status: "needsVerification", verificationUrl: body.url };
  }
  return { status: "failed" };
}

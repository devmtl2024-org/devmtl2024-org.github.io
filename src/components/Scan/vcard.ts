export type Contact = {
  firstName: string;
  lastName: string;
  fullName: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  url?: string;
};

export function parseVCard(text: string): Contact | null {
  const lines = unfold(text.trim()).split(/\r?\n/);
  const isVCard =
    lines[0].toUpperCase() === "BEGIN:VCARD" &&
    lines[lines.length - 1].toUpperCase() === "END:VCARD";
  if (!isVCard) {
    return null;
  }

  const properties = parseProperties(lines);
  const [lastName = "", firstName = ""] = splitComponents(
    properties.get("N") ?? "",
  );
  const fullName =
    unescapeText(properties.get("FN") ?? "") ||
    `${firstName} ${lastName}`.trim();
  if (!fullName) {
    return null;
  }

  const optionalFields = {
    organization: splitComponents(properties.get("ORG") ?? "")
      .filter(Boolean)
      .join(", "),
    title: unescapeText(properties.get("TITLE") ?? ""),
    phone: unescapeText(properties.get("TEL") ?? ""),
    email: unescapeText(properties.get("EMAIL") ?? ""),
    url: unescapeText(properties.get("URL") ?? ""),
  };
  const contact: Contact = {
    firstName,
    lastName,
    fullName,
    ...Object.fromEntries(
      Object.entries(optionalFields).filter(([, value]) => value),
    ),
  };
  return contact;
}

function unfold(text: string) {
  return text.replace(/\r?\n[ \t]/g, "");
}

// Keeps the first occurrence: a card with two emails exports the first one
function parseProperties(lines: string[]) {
  return lines.reduce((properties, line) => {
    const separator = line.indexOf(":");
    if (separator === -1) {
      return properties;
    }
    const name = line.slice(0, separator).split(";")[0].toUpperCase();
    return properties.has(name)
      ? properties
      : properties.set(name, line.slice(separator + 1));
  }, new Map<string, string>());
}

function splitComponents(value: string) {
  const tokens = value.match(/\\.?|;|[^\\;]+/g) ?? [];
  return tokens
    .reduce(
      (components, token) =>
        token === ";"
          ? [...components, ""]
          : [
              ...components.slice(0, -1),
              components[components.length - 1] + token,
            ],
      [""],
    )
    .map(unescapeText);
}

function unescapeText(value: string) {
  return value.replace(/\\(.?)/g, (_, char: string) =>
    char.toLowerCase() === "n" ? "\n" : char,
  );
}

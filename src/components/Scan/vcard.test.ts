import { describe, expect, it } from "vitest";
import { parseVCard } from "./vcard";

describe("parseVCard", () => {
  it("reads a badge vCard", () => {
    const badge = vcard(
      "N:Tremblay;Camille;;;",
      "FN:Camille Tremblay",
      "ORG:Studio Boréal",
      "TITLE:Développeuse full-stack",
      "TEL;TYPE=CELL:+1 438-555-0142",
      "EMAIL:camille@studioboreal.example",
      "URL:https://www.linkedin.com/in/camille-tremblay",
    );

    expect(parseVCard(badge)).toEqual({
      firstName: "Camille",
      lastName: "Tremblay",
      fullName: "Camille Tremblay",
      organization: "Studio Boréal",
      title: "Développeuse full-stack",
      phone: "+1 438-555-0142",
      email: "camille@studioboreal.example",
      url: "https://www.linkedin.com/in/camille-tremblay",
    });
  });

  it("only needs a name", () => {
    const badge = vcard("N:Nguyen;Maïka;;;", "FN:Maïka Nguyen");

    expect(parseVCard(badge)).toEqual({
      firstName: "Maïka",
      lastName: "Nguyen",
      fullName: "Maïka Nguyen",
    });
  });

  it("builds the full name from N when FN is missing", () => {
    const badge = vcard("N:Nguyen;Maïka;;;");

    expect(parseVCard(badge)).toMatchObject({ fullName: "Maïka Nguyen" });
  });

  it("unescapes commas, semicolons, backslashes and newlines", () => {
    const badge = vcard(
      "FN:Camille Tremblay",
      "ORG:Studio Boréal\\, inc.",
      "TITLE:Dev\\; ops\\nback\\\\front",
    );

    expect(parseVCard(badge)).toMatchObject({
      organization: "Studio Boréal, inc.",
      title: "Dev; ops\nback\\front",
    });
  });

  // build.py does not escape values yet
  it("keeps an unescaped comma as is", () => {
    const badge = vcard("FN:Camille Tremblay", "ORG:Studio Boréal, inc.");

    expect(parseVCard(badge)).toMatchObject({
      organization: "Studio Boréal, inc.",
    });
  });

  it("unfolds long lines", () => {
    const badge = vcard(
      "FN:Jean-Christophe Beauregard-Lévesque",
      "EMAIL:jean-christophe.beauregard-levesque@petit",
      " soctets.example",
      "URL:https://www.linkedin.com/in/jean-christophe-",
      "\tbeauregard-levesque",
    );

    expect(parseVCard(badge)).toMatchObject({
      email: "jean-christophe.beauregard-levesque@petitsoctets.example",
      url: "https://www.linkedin.com/in/jean-christophe-beauregard-levesque",
    });
  });

  it("accepts LF line endings and lowercase property names", () => {
    const badge = [
      "begin:vcard",
      "version:3.0",
      "fn:Camille Tremblay",
      "email;type=INTERNET:camille@studioboreal.example",
      "end:vcard",
    ].join("\n");

    expect(parseVCard(badge)).toMatchObject({
      fullName: "Camille Tremblay",
      email: "camille@studioboreal.example",
    });
  });

  it.each([
    ["a URL", "https://dev-mtl.ca"],
    ["plain text", "Bonjour"],
    ["an empty string", ""],
    ["a vCard without a name", vcard("EMAIL:camille@studioboreal.example")],
    ["an unterminated vCard", "BEGIN:VCARD\r\nFN:Camille Tremblay"],
  ])("rejects %s", (_, text) => {
    expect(parseVCard(text)).toBeNull();
  });
});

function vcard(...properties: string[]) {
  return ["BEGIN:VCARD", "VERSION:3.0", ...properties, "END:VCARD"].join(
    "\r\n",
  );
}

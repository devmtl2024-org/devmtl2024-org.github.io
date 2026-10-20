// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import { addLead, loadLeads, removeLead, saveLeads, updateNote } from "./leads";
import { Contact } from "./vcard";

const camille: Contact = {
  firstName: "Camille",
  lastName: "Tremblay",
  fullName: "Camille Tremblay",
  organization: "Studio Boréal",
  email: "camille@studioboreal.example",
};

const maika: Contact = {
  firstName: "Maïka",
  lastName: "Nguyen",
  fullName: "Maïka Nguyen",
};

describe("addLead", () => {
  it("puts the newest scan first, with its time and an empty note", () => {
    const first = addLead([], camille, "2026-11-27T10:00:00.000Z");
    const second = addLead(first.leads, maika, "2026-11-27T10:05:00.000Z");

    expect(second).toEqual({
      outcome: "added",
      leads: [
        {
          ...maika,
          id: expect.any(String),
          scannedAt: "2026-11-27T10:05:00.000Z",
          note: "",
        },
        {
          ...camille,
          id: expect.any(String),
          scannedAt: "2026-11-27T10:00:00.000Z",
          note: "",
        },
      ],
    });
  });

  it("keeps the first scan when the same person is scanned again", () => {
    const first = addLead([], camille, "2026-11-27T10:00:00.000Z");
    const rescan = addLead(
      first.leads,
      { ...camille, email: "Camille@StudioBoreal.example" },
      "2026-11-27T11:00:00.000Z",
    );

    expect(rescan).toEqual({ outcome: "duplicate", leads: first.leads });
  });

  it("recognizes someone without an email by name and organization", () => {
    const first = addLead([], maika, "2026-11-27T10:00:00.000Z");
    const rescan = addLead(first.leads, maika, "2026-11-27T11:00:00.000Z");

    expect(rescan.outcome).toBe("duplicate");
  });

  it("tells apart namesakes from different organizations", () => {
    const first = addLead([], maika, "2026-11-27T10:00:00.000Z");
    const namesake = addLead(
      first.leads,
      { ...maika, organization: "Coopérative Les Petits Octets" },
      "2026-11-27T11:00:00.000Z",
    );

    expect(namesake.outcome).toBe("added");
  });
});

describe("removeLead", () => {
  it("removes only that lead", () => {
    const { leads } = addLead(
      addLead([], camille, "2026-11-27T10:00:00.000Z").leads,
      maika,
      "2026-11-27T10:05:00.000Z",
    );

    expect(removeLead(leads, leads[0].id)).toEqual([leads[1]]);
  });
});

describe("updateNote", () => {
  it("changes the note of that lead only", () => {
    const { leads } = addLead(
      addLead([], camille, "2026-11-27T10:00:00.000Z").leads,
      maika,
      "2026-11-27T10:05:00.000Z",
    );

    expect(updateNote(leads, leads[1].id, "Wants a demo")).toEqual([
      leads[0],
      { ...leads[1], note: "Wants a demo" },
    ]);
  });
});

describe("saved leads", () => {
  beforeEach(() => localStorage.clear());

  it("come back after a reload", () => {
    const { leads } = addLead([], camille, "2026-11-27T10:00:00.000Z");

    saveLeads(leads);

    expect(loadLeads()).toEqual(leads);
  });

  it("start empty on a new device", () => {
    expect(loadLeads()).toEqual([]);
  });

  it("start empty rather than crash when storage is corrupted", () => {
    localStorage.setItem("devmtl-scan-leads", "{not json");

    expect(loadLeads()).toEqual([]);
  });
});

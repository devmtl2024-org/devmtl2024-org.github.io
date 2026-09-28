import { Sponsor } from "@/type/sponsors";
import { aSponsor } from "@/type/sponsors.builder";
import { describe, expect, it } from "vitest";
import { sortByArrival } from "./sortByArrival";

describe("sortByArrival", () => {
  it("puts the sponsors who joined first at the top", () => {
    const sponsors = [
      aSponsor({ name: "Newcomer", joinedAt: "2026-09-28" }),
      aSponsor({ name: "Loyal", joinedAt: "2025-09-09" }),
    ];

    expect(names(sortByArrival(sponsors))).toEqual(["Loyal", "Newcomer"]);
  });

  it("keeps the loading order for sponsors who joined the same day", () => {
    const sponsors = [
      aSponsor({ name: "Coveo", joinedAt: "2026-06-01" }),
      aSponsor({ name: "Vasco", joinedAt: "2026-06-01" }),
    ];

    expect(names(sortByArrival(sponsors))).toEqual(["Coveo", "Vasco"]);
  });

  // JSON files aren't type-checked, so a sponsor may be missing its date
  it("puts a sponsor missing its date last", () => {
    const undated = { ...aSponsor({ name: "Undated" }), joinedAt: undefined };
    const sponsors = [
      aSponsor({ name: "Loyal", joinedAt: "2025-09-09" }),
      undated as unknown as Sponsor,
      aSponsor({ name: "Newcomer", joinedAt: "2026-09-28" }),
    ];

    expect(names(sortByArrival(sponsors))).toEqual([
      "Loyal",
      "Newcomer",
      "Undated",
    ]);
  });
});

function names(sponsors: Sponsor[]) {
  return sponsors.map((sponsor) => sponsor.name);
}

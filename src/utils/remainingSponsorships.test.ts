import { describe, expect, it } from "vitest";
import { remainingSponsorships } from "./remainingSponsorships";

describe("remainingSponsorships", () => {
  it("returns the full count when none are taken", () => {
    expect(remainingSponsorships(5, 0)).toBe(5);
  });

  it("subtracts the taken slots", () => {
    expect(remainingSponsorships(3, 1)).toBe(2);
  });

  it("returns zero when all slots are taken", () => {
    expect(remainingSponsorships(3, 3)).toBe(0);
  });

  it("never goes negative when more sponsors are enabled than slots offered", () => {
    expect(remainingSponsorships(3, 4)).toBe(0);
  });
});

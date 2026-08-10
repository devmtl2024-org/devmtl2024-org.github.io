import { describe, expect, it } from "vitest";
import { pickRandom } from "./pickRandom";

describe("pickRandom", () => {
  const talks = ["a", "b", "c", "d", "e"];

  it("returns as many items as asked", () => {
    expect(pickRandom(talks, 3)).toHaveLength(3);
  });

  it("only returns items from the source", () => {
    expect(talks).toEqual(expect.arrayContaining(pickRandom(talks, 3)));
  });

  it("returns everything when asked for more than available", () => {
    expect(pickRandom(talks, 10).sort()).toEqual(talks);
  });

  it("leaves the source untouched", () => {
    pickRandom(talks, 3);

    expect(talks).toEqual(["a", "b", "c", "d", "e"]);
  });
});

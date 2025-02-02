import { describe, it, expect } from "bun:test";
import { unixEpoch } from "./index";

describe("unixEpoch", () => {
  it("should return the Unix epoch time in seconds for a given date", () => {
    const date = new Date("2025-02-03T14:46:58+00:00");
    const result = unixEpoch(date);
    expect(result).toBe(1738594018);
  });

  it("should handle dates before the Unix epoch", () => {
    const date = new Date("2020-02-03T14:46:58+00:00");
    const result = unixEpoch(date);
    expect(result).toBe(1580741218);
  });
});
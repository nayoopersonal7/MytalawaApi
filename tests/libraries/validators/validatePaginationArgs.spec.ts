import { describe, expect, it } from "vitest";
import { validatePaginationArgs } from "../../../api/libraries/validators/validatePaginationArgs";
import { MAXIMUM_FETCH_LIMIT } from "../../../api/constants";
import type { CursorPaginationInput } from "../../../api/types/generatedGraphQLTypes";

describe("validators -> validatePaginationArgs", () => {
  it("returns MaximumValueError if the limit exceeds the maximum fetch limit", () => {
    const args: CursorPaginationInput = {
      direction: "FORWARD",
      limit: MAXIMUM_FETCH_LIMIT + 1,
    };

    const payload = validatePaginationArgs(args);

    expect(payload.length).toBe(1);
    expect(payload[0]).toMatchObject({
      __typename: "MaximumValueError",
      limit: MAXIMUM_FETCH_LIMIT,
      path: ["input", "limit"],
    });
  });

  it("returns empty error list if the args are valid", () => {
    const args: CursorPaginationInput = {
      direction: "FORWARD",
      limit: MAXIMUM_FETCH_LIMIT,
    };

    const payload = validatePaginationArgs(args);

    expect(payload.length).toBe(0);
  });
});

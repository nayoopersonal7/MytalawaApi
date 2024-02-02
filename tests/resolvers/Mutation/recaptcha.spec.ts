import type { MutationRecaptchaArgs } from "../../../api/types/generatedGraphQLTypes";
import { recaptcha as recaptchaResolver } from "../../../api/resolvers/Mutation/recaptcha";
import { describe, it, expect } from "vitest";

describe("resolvers -> Mutation -> recaptcha", () => {
  it("", async () => {
    const args: MutationRecaptchaArgs = {
      data: {
        recaptchaToken: "dummyToken",
      },
    };

    const recaptchaPayload = await recaptchaResolver?.({}, args, {});

    expect(recaptchaPayload).toBeFalsy();
  });
});

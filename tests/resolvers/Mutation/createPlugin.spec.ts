import type { MutationCreatePluginArgs } from "../../../api/types/generatedGraphQLTypes";

import { pubsub } from "../../../api/index";
import { describe, it, expect } from "vitest";
import { createPlugin as createPluginResolver } from "../../../api/resolvers/Mutation/createPlugin";
import { nanoid } from "nanoid";

describe("resolvers -> Mutation -> createPlugin", () => {
  it(`Creates a Plugin and returns it`, async () => {
    const data: MutationCreatePluginArgs = {
      pluginCreatedBy: nanoid(),
      pluginDesc: nanoid(),
      pluginName: nanoid(),
    };
    const args: MutationCreatePluginArgs = {
      ...data,
    };

    const context = {
      pubsub,
    };

    const createPluginPayload = await createPluginResolver?.({}, args, context);

    expect(createPluginPayload).toEqual(
      expect.objectContaining({
        ...data,
      })
    );
  });
});

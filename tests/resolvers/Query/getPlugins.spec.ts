import "dotenv/config";
import { getPlugins as getPluginsResolver } from "../../../api/resolvers/Query/getPlugins";
import { connect, disconnect } from "../../helpers/db";
import type mongoose from "mongoose";
import { Plugin } from "../../../api/models";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { createTestPlugin } from "../../helpers/plugins";

let MONGOOSE_INSTANCE: typeof mongoose;

beforeAll(async () => {
  MONGOOSE_INSTANCE = await connect();
  await createTestPlugin();
});

afterAll(async () => {
  await disconnect(MONGOOSE_INSTANCE);
});

describe("resolvers -> Query -> getPlugins", () => {
  it(`returns list of all existing plugins`, async () => {
    const getPluginsPayload = await getPluginsResolver?.({}, {}, {});

    const plugins = await Plugin.find().lean();

    expect(getPluginsPayload).toEqual(plugins);
  });
});

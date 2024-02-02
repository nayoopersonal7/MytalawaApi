import type mongoose from "mongoose";
import { Types } from "mongoose";
import { nanoid } from "nanoid";
import {
  beforeAll,
  afterAll,
  afterEach,
  describe,
  it,
  expect,
  vi,
} from "vitest";

import { PLUGIN_NOT_FOUND } from "../../../api/constants";
import { pubsub } from "../../../api/index";
import { createTestUserAndOrganization } from "../../helpers/userAndOrg";
import type { TestOrganizationType } from "../../helpers/userAndOrg";
import { connect, disconnect } from "../../helpers/db";
import type { MutationUpdatePluginStatusArgs } from "../../../api/types/generatedGraphQLTypes";
import { updatePluginStatus } from "../../../api/resolvers/Mutation/updatePluginStatus";
import { Plugin } from "../../../api/models";
import type { InterfacePlugin } from "../../../api/models";

let MONGOOSE_INSTANCE: typeof mongoose;
let testOrganization: TestOrganizationType;

beforeAll(async () => {
  MONGOOSE_INSTANCE = await connect();
  const temp = await createTestUserAndOrganization();
  testOrganization = temp[1];
});

afterAll(async () => {
  await disconnect(MONGOOSE_INSTANCE);
});

afterEach(() => {
  vi.doUnmock("../../../api/constants");
  vi.resetModules();
});

afterEach(() => {
  vi.doUnmock("../../../api/constants");
  vi.resetModules();
});

describe("resolvers -> Mutation -> updatePluginStatus", () => {
  it(`throws NotFoundError if no plugin exists with _id === args.id`, async () => {
    const { requestContext } = await import("../../../api/libraries");

    const spy = vi
      .spyOn(requestContext, "translate")
      .mockImplementation((message) => `Translated ${message}`);

    try {
      const args: MutationUpdatePluginStatusArgs = {
        id: Types.ObjectId().toString(),
        orgId: Types.ObjectId().toString(),
      };

      const context = async () => {
        pubsub;
      };

      const { updatePluginStatus: updatePluginStatusResolver } = await import(
        "../../../api/resolvers/Mutation/updatePluginStatus"
      );

      await updatePluginStatusResolver?.({}, args, context);
    } catch (error: any) {
      expect(spy).toHaveBeenCalledWith(PLUGIN_NOT_FOUND.MESSAGE);
      expect(error.message).toEqual(`Translated ${PLUGIN_NOT_FOUND.MESSAGE}`);
    }
  });

  it(`updates the plugin with _id === args.id and returns the updated plugin when orgId does no exists in uninstalled orgs`, async () => {
    const testPlugin: InterfacePlugin = await Plugin.create({
      pluginName: `${nanoid()}`,
      pluginCreatedBy: `${nanoid()}`,
      pluginDesc: `${nanoid()}`,
      uninstalledOrgs: [],
    });
    const args: MutationUpdatePluginStatusArgs = {
      id: testPlugin._id.toString(),
      orgId: testOrganization?._id.toString(),
    };

    const context = {
      pubsub,
    };

    const updatePluginStatusPayload = await updatePluginStatus?.(
      {},
      args,
      context
    );

    const testUpdatePluginStatusPayload = await Plugin.findOne({
      _id: testPlugin._id,
    }).lean();

    expect(updatePluginStatusPayload).toEqual(testUpdatePluginStatusPayload);
  });

  it(`updates the plugin with _id === args.id and returns the updated plugin when orgId exists in uninstalled orgs`, async () => {
    const testPlugin: InterfacePlugin = await Plugin.create({
      pluginName: `${nanoid()}`,
      pluginCreatedBy: `${nanoid()}`,
      pluginDesc: `${nanoid()}`,
      uninstalledOrgs: [testOrganization?._id],
    });
    const args: MutationUpdatePluginStatusArgs = {
      id: testPlugin._id.toString(),
      orgId: testOrganization?._id.toString(),
    };

    const context = {
      pubsub,
    };

    const updatePluginStatusPayload = await updatePluginStatus?.(
      {},
      args,
      context
    );

    const testUpdatePluginStatusPayload = await Plugin.findOne({
      _id: testPlugin._id,
    }).lean();

    expect(updatePluginStatusPayload).toEqual(testUpdatePluginStatusPayload);
  });
});

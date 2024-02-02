import "dotenv/config";
import { creator as creatorResolver } from "../../../api/resolvers/DirectChat/creator";
import { connect, disconnect } from "../../helpers/db";
import type mongoose from "mongoose";
import { User } from "../../../api/models";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { TestDirectChatType } from "../../helpers/directChat";
import { createTestDirectChat } from "../../helpers/directChat";

let testDirectChat: TestDirectChatType;
let MONGOOSE_INSTANCE: typeof mongoose;

beforeAll(async () => {
  MONGOOSE_INSTANCE = await connect();
  const userOrgChat = await createTestDirectChat();
  testDirectChat = userOrgChat[2];
});

afterAll(async () => {
  await disconnect(MONGOOSE_INSTANCE);
});

describe("resolvers -> DirectChat -> creator", () => {
  it(`returns user object for parent.creator`, async () => {
    const parent = testDirectChat!.toObject();

    const creatorPayload = await creatorResolver?.(parent, {}, {});

    const creator = await User.findOne({
      _id: testDirectChat!.creatorId,
    }).lean();

    expect(creatorPayload).toEqual(creator);
  });
});

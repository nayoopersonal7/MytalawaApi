import "dotenv/config";
import { event as eventResolver } from "../../../api/resolvers/Query/event";
import { connect, disconnect } from "../../helpers/db";
import type mongoose from "mongoose";
import { Types } from "mongoose";
import { EVENT_NOT_FOUND_ERROR } from "../../../api/constants";
import { Event } from "../../../api/models";

import type { QueryEventArgs } from "../../../api/types/generatedGraphQLTypes";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import type { TestUserType } from "../../helpers/userAndOrg";
import type { TestEventType } from "../../helpers/events";
import { createTestEvent } from "../../helpers/events";

let MONGOOSE_INSTANCE: typeof mongoose;
let testEvent: TestEventType;
let testUser: TestUserType;

beforeAll(async () => {
  MONGOOSE_INSTANCE = await connect();
  const resultArray = await createTestEvent();
  testUser = resultArray[0];
  testEvent = resultArray[2];
});

afterAll(async () => {
  await disconnect(MONGOOSE_INSTANCE);
});

describe("resolvers -> Query -> event", () => {
  it(`throws NotFoundError if no event exists with _id === args.id and event.status === 'ACTIVE'`, async () => {
    try {
      const args: QueryEventArgs = {
        id: Types.ObjectId().toString(),
      };

      await eventResolver?.({}, args, {});
    } catch (error: any) {
      expect(error.message).toEqual(EVENT_NOT_FOUND_ERROR.DESC);
    }
  });

  it(`returns event object with populated fields creator and admins`, async () => {
    const args: QueryEventArgs = {
      id: testEvent?._id,
    };

    const eventPayload = await eventResolver?.({}, args, {});

    const event = await Event.findOne({
      _id: testEvent?._id,
    })
      .populate("creator", "-password")
      .populate("admins", "-password")
      .lean();

    expect(eventPayload).toEqual(event);
  });
});

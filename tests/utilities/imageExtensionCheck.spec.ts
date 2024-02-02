import { afterEach, describe, expect, it, vi } from "vitest";
import { imageExtensionCheck } from "../../api/utilities/imageExtensionCheck";
import * as deleteImage from "../../api/utilities/deleteImage";
import { requestContext } from "../../api/libraries";
import { INVALID_FILE_TYPE } from "../../api/constants";
import { ApplicationError } from "../../api/libraries/errors";

const testFilename = "test.anyOtherExtension";

const testErrors = [
  {
    message: INVALID_FILE_TYPE.MESSAGE,
    code: INVALID_FILE_TYPE.CODE,
    param: INVALID_FILE_TYPE.PARAM,
  },
];

const testMessage = "invalid.fileType";

describe("utilities -> imageExtensionCheck", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws Validation Error and calls deleteImage", async () => {
    const mockedDeleteImage = vi
      .spyOn(deleteImage, "deleteImage")
      .mockImplementation(() => {
        return Promise.resolve();
      });

    const mockedRequestTranslate = vi
      .spyOn(requestContext, "translate")
      .mockImplementation((message) => {
        return message;
      });

    try {
      await imageExtensionCheck(testFilename);
    } catch (error: unknown) {
      if (!(error instanceof ApplicationError)) return;
      expect(error.message).toEqual(testMessage);
      expect(error.errors).toEqual(testErrors);
    }

    expect(mockedDeleteImage).toHaveBeenCalledOnce();
    expect(mockedRequestTranslate).toBeCalledTimes(2);
    expect(mockedRequestTranslate).toBeCalledWith("invalid.fileType");
  });
});

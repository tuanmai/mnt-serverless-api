import AWS from "aws-sdk-mock";
import { addToCard } from "../order";

describe("it works", () => {
  beforeAll(() => {
    AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(null, "successfully put item in database");
    });
  });

  afterAll(() => {
    AWS.restore("DynamoDB.DocumentClient");
  });

  test("Replies back with a JSON for a signed upload on success", async () => {
    const event = {
      body: JSON.stringify({ userId: "123" })
    };
    const result = await addToCard(event);
    expect(result).toMatchSnapshot();
  });
});

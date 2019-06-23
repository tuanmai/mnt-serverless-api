import AWS from "aws-sdk-mock";

import { addToCard } from "../order";
import Order from "../db/order";

describe("Add to card", () => {
  it("returns 200", async () => {
    const event = {
      body: JSON.stringify({ userId: "123" })
    };
    const result = await addToCard(event);
    expect(result.statusCode).toEqual(200);
  });
  describe("user does not have pending order", () => {
    it("creates order", async () => {
      const userId = "123";
      const beforeCount = await Order.query(userId);
      console.log(beforeCount);
      expect(beforeCount.data.Count).toEqual(0);
    });
  });
  beforeAll(() => {
    // AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
    //   callback(null, "successfully put item in database");
    // });
    // AWS.mock("DynamoDB.DocumentClient", "query", (params, callback) => {
    //   callback(null, "successfully put item in database");
    // });
  });

  afterAll(() => {
    AWS.restore("DynamoDB.DocumentClient");
  });
});

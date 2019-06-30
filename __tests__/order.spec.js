import { map } from "lodash/fp";
import AWS from "aws-sdk-mock";

import { addToCard } from "../order";
import Order from "../db/order";

jest.mock("../db/order");

describe("Add to card", () => {
  describe("There is no pending order", () => {
    it("creates new order", async () => {
      const queryMock = { success: true, data: { Count: 0, Items: [] } };
      const createMock = {
        success: true,
        data: { id: "order_1", orderStatus: "pending" }
      };
      const event = {
        body: JSON.stringify({ userId: "123" })
      };
      Order.query.mockReturnValue(Promise.resolve(queryMock));
      Order.put.mockReturnValue(Promise.resolve(createMock));
      const result = await addToCard(event);
      const bodyData = JSON.parse(result.body);
      expect(bodyData.orderStatus).toEqual("pending");
      expect(bodyData.id).toEqual("order_1");
      expect(result.statusCode).toEqual(200);
    });
  });

  describe("There is a pending order", () => {
    it("creates new order", async () => {
      const queryMock = {
        success: true,
        data: { Count: 1, Items: [{ id: "order_1" }] }
      };
      const createMock = {
        success: true,
        data: { id: "order_2", orderStatus: "pending" }
      };
      const event = {
        body: JSON.stringify({ userId: "123" })
      };
      Order.query.mockReturnValue(Promise.resolve(queryMock));
      Order.put.mockReturnValue(Promise.resolve(createMock));
      const result = await addToCard(event);
      const bodyData = JSON.parse(result.body);
      expect(bodyData.id).toEqual("order_1");
    });
  });
});

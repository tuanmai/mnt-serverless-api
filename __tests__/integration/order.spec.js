import { map } from "lodash/fp";

import { addToCard, checkout } from "../../order";
import Order from "../../db/order";

let orders = [];

describe("Add to card", () => {
  beforeEach(async () => {
    orders = (await Order.getAll()).data.Items;
  });

  beforeEach(async () => {
    map(async item => await Order.destroy(item), orders);
  });

  it("returns 200", async () => {
    const event = {
      body: JSON.stringify({
        userId: "123",
        itemCode: "combo",
        itemPrice: 90000
      })
    };
    const result = await addToCard(event);
    const bodyData = JSON.parse(result.body);
    expect(bodyData.orderStatus).toEqual("pending");
    expect(result.statusCode).toEqual(200);
  });
});

describe("Checkout", () => {
  beforeEach(async () => {
    orders = (await Order.getAll()).data.Items;
  });

  beforeEach(async () => {
    map(async item => await Order.destroy(item), orders);
  });

  describe("there is no pending order", () => {
    it("returns error order not found", async () => {
      const event = {
        body: JSON.stringify({
          userId: "123"
        })
      };
      const result = await checkout(event);
      const bodyData = JSON.parse(result.body);
      expect(bodyData.error).toEqual("Order not found");
      expect(result.statusCode).toEqual(400);
    });
  });

  describe("there is a pending order", () => {
    it("returns error order not found", async () => {
      const createEvent = {
        body: JSON.stringify({
          userId: "123",
          itemCode: "combo",
          itemPrice: 90000
        })
      };
      await addToCard(createEvent);
      const event = {
        body: JSON.stringify({
          userId: "123"
        })
      };
      const result = await checkout(event);
      const bodyData = JSON.parse(result.body);
      expect(result.statusCode).toEqual(200);
    });
  });
});

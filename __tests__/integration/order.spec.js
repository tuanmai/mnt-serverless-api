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
          userId: "123",
          district: "binh thanh"
        })
      };
      const result = await checkout(event);
      const bodyData = JSON.parse(result.body);
      expect(bodyData["messages"][0]["text"]).toContain("Order not found");
      expect(result.statusCode).toEqual(200);
    });
  });

  describe("there is a pending order", () => {
    it("returns order details", async () => {
      const createEvent = {
        body: JSON.stringify({
          userId: "123",
          itemCode: "combo",
          district: "binh thanh",
          itemPrice: 90000
        })
      };
      await addToCard(createEvent);
      const event = {
        body: JSON.stringify({
          userId: "123",
          district: "binh thanh"
        })
      };
      const result = await checkout(event);
      const bodyData = JSON.parse(result.body);
      expect(result.statusCode).toEqual(200);
    });
  });
});

import { addItemsToOrder, addToCard, checkout } from "../order";
import Order from "../db/order";

jest.mock("../db/order");

describe("Add to card", () => {
  describe("There is no pending order", () => {
    it("creates new order", async () => {
      const queryMock = { success: true, data: { Count: 0, Items: [] } };
      const createMock = {
        success: true,
        data: { id: "order_1", orderStatus: "pending", items: [] }
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
    it("returns old order", async () => {
      const queryMock = {
        success: true,
        data: { Count: 1, Items: [{ id: "order_1", items: [] }] }
      };
      const createMock = {
        success: true,
        data: { id: "order_2", orderStatus: "pending" }
      };
      const event = {
        body: JSON.stringify({ userId: "123" })
      };
      Order.query.mockReturnValue(Promise.resolve(queryMock));
      const result = await addToCard(event);
      expect(Order.put.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          id: "order_1"
        })
      );
    });
  });

  describe("add item", () => {
    describe("there is no pending order", () => {
      it("adds new item to order", async () => {
        const event = {
          body: JSON.stringify({
            userId: "123",
            itemCode: "combo",
            itemPrice: 90000
          })
        };

        const queryMock = { success: true, data: { Count: 0, Items: [] } };
        Order.query.mockReturnValue(Promise.resolve(queryMock));
        const result = await addToCard(event);
        expect(Order.put.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            userId: "123",
            orderStatus: "pending",
            items: [{ itemCode: "combo", count: 1, total: 90000 }],
            total: 90000
          })
        );
      });
    });
    describe("there is a pending order", () => {
      it("adds new item to pending order", async () => {
        const event = {
          body: JSON.stringify({
            userId: "123",
            itemCode: "combo",
            itemPrice: 90000
          })
        };

        const pendingOrder = {
          orderId: 123,
          userId: "123",
          orderStatus: "pending",
          items: [{ itemCode: "combo", count: 1, total: 10000 }]
        };

        const queryMock = {
          success: true,
          data: { Count: 1, Items: [pendingOrder] }
        };
        Order.query.mockReturnValue(Promise.resolve(queryMock));
        const result = await addToCard(event);
        expect(Order.put.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            userId: "123",
            orderId: 123,
            orderStatus: "pending",
            items: [{ itemCode: "combo", count: 2, total: 100000 }],
            total: 100000
          })
        );
      });
    });
  });
});

describe("checkout", () => {
  describe("order not found", () => {
    it("returns error", async () => {
      const queryMock = { success: true, data: { Count: 0, Items: [] } };
      const event = {
        body: JSON.stringify({ userId: "123" })
      };
      Order.query.mockReturnValue(Promise.resolve(queryMock));
      const result = await checkout(event);
      const bodyData = JSON.parse(result.body);
      expect(bodyData).toEqual("Order not found");
      expect(result.statusCode).toEqual(400);
    });
  });

  describe("order has found", () => {
    it("change order status to checkouted", async () => {
      const order = { id: 123, orderStatus: "pending" };
      const queryMock = { success: true, data: { Count: 1, Items: [order] } };
      const event = {
        body: JSON.stringify({ userId: "123", district: "BT" })
      };
      Order.query.mockReturnValue(Promise.resolve(queryMock));
      const result = await checkout(event);
      const bodyData = JSON.parse(result.body);
      expect(Order.put.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          id: 123,
          orderStatus: "checkouted",
          shippingCost: 0
        })
      );
    });
  });
});

describe("addItemsToOrder", () => {
  describe("items is null", () => {
    it("does not raise error", () => {
      const items = null;
      const order = { id: 123 };
      const newOrder = addItemsToOrder(order, items);
      expect(newOrder).toEqual(
        expect.objectContaining({
          id: 123,
          items: [],
          total: 0
        })
      );
    });
  });

  describe("haven't add item to order", () => {
    it("add items to order", () => {
      const items = [{ itemCode: "combo", itemPrice: 90000 }];
      const order = { id: 123 };
      const newOrder = addItemsToOrder(order, items);
      expect(newOrder).toEqual(
        expect.objectContaining({
          id: 123,
          items: [{ itemCode: "combo", count: 1, total: 90000 }],
          total: 90000
        })
      );
    });
  });

  describe("order alread have that item", () => {
    it("increase count and total of that item", () => {
      const items = [{ itemCode: "combo", itemPrice: 90000 }];
      const order = {
        id: 123,
        items: [
          { itemCode: "combo", count: 1, total: 100000 },
          { itemCode: "bacha", count: 1, total: 90000 }
        ]
      };
      const newOrder = addItemsToOrder(order, items);
      expect(newOrder).toEqual(
        expect.objectContaining({
          id: 123,
          items: [
            { itemCode: "combo", count: 2, total: 190000 },
            { itemCode: "bacha", count: 1, total: 90000 }
          ]
        })
      );
    });

    it("recalculate total price", () => {
      const items = [{ itemCode: "combo", itemPrice: 90000 }];
      const order = {
        id: 123,
        items: [
          { itemCode: "combo", count: 1, total: 100000 },
          { itemCode: "bacha", count: 1, total: 90000 }
        ]
      };
      const newOrder = addItemsToOrder(order, items);
      expect(newOrder).toEqual(
        expect.objectContaining({
          id: 123,
          total: 280000
        })
      );
    });
  });
});

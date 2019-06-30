import { map } from "lodash/fp";
import AWS from "aws-sdk-mock";

import { addToCard } from "../../order";
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
      body: JSON.stringify({ userId: "123" })
    };
    const result = await addToCard(event);
    const bodyData = JSON.parse(result.body);
    expect(bodyData.orderStatus).toEqual("pending");
    expect(result.statusCode).toEqual(200);
  });
});

import AWS from "aws-sdk";
import uuid from "uuid";

import { failure, success } from "./response";
import Order from "./db/order";

const addToCard = async event => {
  const data = JSON.parse(event.body);
  const item = {
    userId: data.userId,
    orderId: uuid.v1(),
    orderStatus: "pending",
    createdAt: Date.now()
  };

  const pendingOrders = await Order.query(data.userId);
  if (pendingOrders.data.Count > 0) {
    return success(pendingOrders.Items[0]);
  }
  const result = await Order.put(item);
  if (result.success) {
    return success(result.data);
  }
  return failure(result.error);
};

// eslint-disable-next-line
export { addToCard };

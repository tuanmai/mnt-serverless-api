import uuid from "uuid";
import { map, find, reduce } from "lodash/fp";

import { failure, success } from "./response";
import Order from "./db/order";

const addToCard = async event => {
  const data = JSON.parse(event.body);

  const pendingOrders = await Order.query(data.userId);
  if (pendingOrders.data.Count > 0) {
    return success(pendingOrders.data.Items[0]);
  }

  const order = {
    userId: data.userId,
    orderId: uuid.v1(),
    orderStatus: "pending",
    createdAt: Date.now()
  };

  const result = await Order.put(order);
  if (result.success) {
    return success(result.data);
  }
  return failure(result.error);
};

const addItemsToOrder = (order, items) => {
  const newOrder = {
    ...order,
    items: [],
    total: 0
  };
  map(item => {
    const orderItem = find(
      orderItem => orderItem.itemCode === item.itemCode,
      order.items
    );
    if (orderItem) {
      newOrder.items.push({
        itemCode: orderItem.itemCode,
        count: orderItem.count + 1,
        total: orderItem.total + item.itemPrice
      });
    } else {
      newOrder.items.push({
        itemCode: item.itemCode,
        count: 1,
        total: item.itemPrice
      });
    }
  }, items);

  map(item => {
    const orderItem = find(
      orderItem => orderItem.itemCode === item.itemCode,
      newOrder.items
    );
    if (!orderItem) {
      newOrder.items.push(item);
    }
  }, order.items);
  const newTotal = reduce(
    (total, item) => total + item.total,
    0,
    newOrder.items
  );
  newOrder.total = newTotal;
  return newOrder;
};

// eslint-disable-next-line
export { addToCard, addItemsToOrder };

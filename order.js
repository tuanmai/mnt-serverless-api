import uuid from "uuid";

import { map, find, reduce } from "lodash/fp";

import { failure, sendReceipt, success } from "./response";
import Order from "./db/order";

const addToCard = async event => {
  const data = JSON.parse(event.body);
  let pendingOrder = null;

  const pendingOrders = await Order.query(data.userId);
  if (pendingOrders.data.Count > 0) {
    pendingOrder = pendingOrders.data.Items[0];
  } else {
    pendingOrder = {
      userId: data.userId,
      orderId: uuid.v1(),
      orderStatus: "pending",
      createdAt: Date.now()
    };
  }

  const newItem = { itemCode: data.itemCode, itemPrice: data.itemPrice };
  const newOrder = addItemsToOrder(pendingOrder, [newItem]);

  const result = await Order.put(newOrder);
  if (result.success) {
    return success(result.data);
  }
  return failure(result.error);
};

const getOrder = async event => {
  let pendingOrder = null;

  const pendingOrders = await Order.query(event.pathParameters.userId);
  console.log(pendingOrders);
  if (pendingOrders.data.Count > 0) {
    pendingOrder = pendingOrders.data.Items[0];
  } else {
    pendingOrder = {};
  }

  return success(pendingOrder);
};

const checkout = async event => {
  const data = JSON.parse(event.body);

  const pendingOrders = await Order.query(data.userId);
  if (pendingOrders.data.Count == 0) {
    return failure("Order not found");
  }
  const pendingOrder = pendingOrders.data.Items[0];
  const newOrder = {
    ...pendingOrder,
    orderStatus: "checkouted",
    shippingCost: 0
  };

  const result = await Order.put(newOrder);
  if (result.success) {
    console.log(result);
    return sendReceipt(result.data);
  }
  return failure(result.error);
};

const cancelOrder = async event => {
  const data = JSON.parse(event.body);

  const pendingOrders = await Order.query(data.userId);
  if (pendingOrders.data.Count == 0) {
    return failure("Order not found");
  }
  const pendingOrder = pendingOrders.data.Items[0];
  const newOrder = {
    ...pendingOrder,
    orderStatus: "canceled"
  };

  const result = await Order.put(newOrder);
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
export { addToCard, checkout, cancelOrder, getOrder, addItemsToOrder };

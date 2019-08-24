import uuid from "uuid";

import { map, find, reduce, includes } from "lodash/fp";

import { failure, sendReceiptMessage, success } from "./response";
import Order from "./db/order";

const addToCard = async event => {
  try {
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
  } catch (e) {
    console.log(e);
    return failure(e);
  }
};

const getOrder = async event => {
  let pendingOrder = null;

  const pendingOrders = await Order.query(event.pathParameters.userId);
  console.log(pendingOrders);
  if (pendingOrders.data.Count > 0) {
    pendingOrder = pendingOrders.data.Items[0];
    return sendOrderDetailsMessage(pendingOrder);
  } else {
    return sendMessage("Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng.");
  }
};

const checkout = async event => {
  try {
    const data = JSON.parse(event.body);

    const pendingOrders = await Order.query(data.userId);
    if (pendingOrders.data.Count == 0) {
      return failure("Order not found");
    }
    const pendingOrder = pendingOrders.data.Items[0];
    const newOrder = {
      ...data,
      ...pendingOrder,
      orderStatus: "checkouted",
      shippingCost: calculateShippingCost(data.district)
    };

    const result = await Order.put(newOrder);

    if (result.success) {
      return sendReceiptMessage(result.data);
    }
    return failure(result.error);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
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

const calculateShippingCost = district => {
  let newDistrict = remove_unicode(district);
  newDistrict = newDistrict.replace(/quan/g, "");
  newDistrict = newDistrict.trim();
  const freeship = ["bt", "1", "3", "binh thanh", "b.thanh", "b.t", "b thanh"];
  const ship10k = ["pn", "phu nhuan", "p.n"];
  const ship20k = [
    "2",
    "9",
    "12",
    "btan",
    "b.tan",
    "binh tan",
    "binhtan",
    "td",
    "thu duc",
    "tduc",
    "tphu",
    "tan phu",
    "t.phu",
    "tp"
  ];
  if (includes(newDistrict, freeship)) {
    return 0;
  }
  if (includes(newDistrict, ship10k)) {
    return 10000;
  }
  if (includes(newDistrict, ship20k)) {
    return 20000;
  }
  return 15000;
};

const remove_unicode = str => {
  str = str.toLowerCase();
  str = str.trim();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
    ""
  );

  str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
  str = str.replace(/^\-+|\-+$/g, "");

  return str;
};
// eslint-disable-next-line
export {
  addToCard,
  checkout,
  cancelOrder,
  getOrder,
  addItemsToOrder,
  calculateShippingCost
};

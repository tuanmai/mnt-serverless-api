import { map } from "lodash/fp";
const buildResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  },
  body: JSON.stringify(body)
});

const sendMessage = message => {
  const formatedMessaged = {
    messages: [
      {
        text: message
      }
    ]
  };
  return buildResponse(200, formatedMessaged);
};

const sendReceipt = order => {
  const addressMessage = {
    street_1: order.address,
    street_2: `${order.ward}, ${order.district}`
  };
  const summaryMessage = {
    subtotal: order.total,
    shipping_cost: order.shippingCost,
    total_cost: order.total + order.shippingCost
  };
  const elementsMessage = map(
    item => ({
      title: item.itemCode,
      quantity: item.count,
      price: item.total / item.count,
      currency: "VND"
    }),
    order.items
  );

  const formatedMessaged = {
    messages: [
      {
        attachment: {
          type: "template",
          payload: {
            template_type: "receipt",
            recipient_name: order.userName,
            order_number: order.orderId,
            currency: "VND",
            payment_method: "COD",
            address: addressMessage,
            summary: summaryMessage,
            elements: elementsMessage
          }
        }
      }
    ]
  };

  return buildResponse(200, formatedMessaged);
};

const success = body => buildResponse(200, body);

const failure = body =>
  sendMessage(
    "Hix, hệ thống thiện tại đang bị lỗi 😢. Bạn vui lòng liên hệ trực tiếp tư vấn viên để được hỗ trợ"
  );

export { success, failure, sendMessage, sendReceipt };

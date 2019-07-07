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

const sendMessages = messages => {
  const formatedMessaged = {
    messages: [map(message => ({ text: message }), messages)]
  };
  return buildResponse(200, formatedMessaged);
};

const sendReceiptMessage = order => {
  const elementsMessage = map(
    item => `${item.count} ${item.itemCode} giá ${item.total}`,
    order.items
  ).join(", ");
  const addressMessage = `${order.addressMessage}, Phường ${order.ward}, Quận ${
    order.district
  }`;
  const message1 = `Mình chốt order cho bạn nha: Của bạn là ${elementsMessage}.
  Phí ship: ${order.shippingCost}.
  Địa chỉ: ${addressMessage}.
  SĐT: ${order.phone}
  `;
  const message2 = `Bạn lưu ý giúp mình chính sách ship như mọi khi bạn nhé. có gì thay đổi nhớ báo mình trước t7 bạn nha ❤ , à bên mình ship thứ 2,3 tuần sau bạn nhớ giữ liên lạc giúp mình nhen.`;

  return sendMessages([message1, message2]);
};

const sendReceipt = order => {
  const addressMessage = {
    street_1: order.address || "",
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
            recipient_name: order.userName || "Khách hàng",
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

export { success, failure, sendMessage, sendReceipt, sendReceiptMessage };

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
    messages: [message]
  };
  return buildResponse(200, formatedMessaged);
};

const success = body => buildResponse(200, body);

const failure = body =>
  sendMessage(
    "Hix, hệ thống thiện tại đang bị lỗi 😢. Bạn vui lòng liên hệ trực tiếp tư vấn viên để được hỗ trợ"
  );

export { success, failure, sendMessage };

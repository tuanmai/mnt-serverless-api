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
  return buildResponse(formatedMessaged);
};

const success = body => buildResponse(200, body);

const failure = body => buildResponse(400, { error: body });

export { success, failure, message };

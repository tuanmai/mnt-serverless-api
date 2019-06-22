import uuid from 'uuid';
import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const addToCard = async (event, context, callback) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'orders',
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: data.userId,
      orderId: uuid.v1(),
      createdAt: Date.now(),
    },
  };

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  try {
    await dynamoDb.put(params);
  } catch (err) {
    const response = {
      statusCode: 500,
      headers,
      body: JSON.stringify({ status: false }),
    };
    callback(null, response);
  }

  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify(params.Item),
  };
  callback(null, response);
};

// eslint-disable-next-line
export { addToCard };

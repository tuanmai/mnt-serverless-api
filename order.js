import AWS from 'aws-sdk';
import uuid from 'uuid';

import { failure, success } from './response';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const addToCard = async (event) => {
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

  try {
    await dynamoDb.put(params);
  } catch (err) {
    return failure({ status: false });
  }
  return success(params.Item);
};

// eslint-disable-next-line
export { addToCard };

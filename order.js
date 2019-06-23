import AWS from 'aws-sdk';
import uuid from 'uuid';

import { failure, success } from './response';
import Order from './db/order';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const addToCard = async (event) => {
  const data = JSON.parse(event.body);
  const item = {
    userId: data.userId,
    orderId: uuid.v1(),
    orderStatus: 'pending',
    createdAt: Date.now(),
  };

  const pendingOrders = await Order.query(dynamoDb, data.userId);
  if (pendingOrders.count > 0) {
    return success(pendingOrders.Items[0]);
  }
  const result = await Order.put(dynamoDb, item);
  if (result.success) {
    return success(result.data);
  }
  return failure(result.error);
};

// eslint-disable-next-line
export { addToCard };

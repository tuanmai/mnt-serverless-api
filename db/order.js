import { failureResult, successResult } from './serviceResult';

const query = (db, userId) => {
  const params = {
    TableName: 'orders',
    FilterExpression: 'userId = :userId and orderStatus = :orderStatus',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':orderStatus': 'pending',
    },
  };

  return new Promise((resolve) => {
    db.scan(params, (error, result) => {
      if (error) {
        resolve(failureResult(error));
      }
      resolve(successResult(result));
    });
  });
};

const put = (db, data) => {
  const params = {
    TableName: 'orders',
    Item: data,
  };

  return new Promise((resolve) => {
    db.put(params, (error) => {
      if (error) {
        resolve(failureResult(error));
      }
      resolve(successResult(data));
    });
  });
};

export default { query, put };

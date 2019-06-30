import { failureResult, successResult } from "./serviceResult";
import AWS from "aws-sdk";

let tableName = "orders";
if (process.env.ENV == "test") {
  AWS.config.update({ region: "us-east-1" });
  tableName = "orders-dev";
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getAll = () => {
  const params = {
    TableName: tableName
  };

  return new Promise(resolve => {
    dynamoDb.scan(params, (error, result) => {
      if (error) {
        resolve(failureResult(error));
      }
      resolve(successResult(result));
    });
  });
};

const query = userId => {
  const params = {
    TableName: tableName,
    FilterExpression: "userId = :userId and orderStatus = :orderStatus",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":orderStatus": "pending"
    }
  };

  return new Promise(resolve => {
    dynamoDb.scan(params, (error, result) => {
      if (error) {
        resolve(failureResult(error));
      }
      resolve(successResult(result));
    });
  });
};

const put = data => {
  const params = {
    TableName: tableName,
    Item: data
  };

  return new Promise(resolve => {
    dynamoDb.put(params, error => {
      if (error) {
        resolve(failureResult(error));
      }
      resolve(successResult(data));
    });
  });
};

const destroy = data => {
  const params = {
    TableName: tableName,
    Key: {
      orderId: data.orderId,
      userId: data.userId
    }
  };

  return new Promise(resolve => {
    dynamoDb.delete(params, error => {
      if (error) {
        resolve(failureResult(error));
      }
      resolve(successResult(data));
    });
  });
};

export default { query, put, destroy, getAll };

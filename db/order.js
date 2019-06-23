import { failureResult, successResult } from "./serviceResult";
import AWS from "aws-sdk";

if (process.env.ENV == "test") {
  AWS.config.update({ region: "us-east-1" });
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const query = userId => {
  const params = {
    TableName: "orders",
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
    TableName: "orders",
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

export default { query, put };

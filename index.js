'use strict';
const AWS = require('aws-sdk');
const serverless = require('serverless-http');

const app = require('./app');

const handler = serverless(app);

const CALCULATIONS_TABLE = process.env.CALCULATIONS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  return await handler(event, context);
};

module.exports.store = async (event) => {
  const calcId = JSON.parse(event.Records[0].Sns.Message);

  const params = {
    TableName: CALCULATIONS_TABLE,
    Item: {
      calcId: calcId,
      result: Math.pow(2, calcId),
    },
  };

  let putItem = new Promise((response, reject) => {
    dynamoDb.put(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        console.log("Success", data);
        response("Hi, insert data completed");
      }
    });
  });

  return await putItem;
}

'use strict';

const serverless = require('serverless-http');
const server = require('./app');

const handler = serverless(server);

module.exports.handler = async (event, context) => {
  return await handler(event, context);
};

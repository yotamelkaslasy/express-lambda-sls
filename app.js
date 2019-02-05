const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const apiRouter = require('./api');
const helpers = require('./helpers');

class Server {
  constructor() {
    this.server = express();

    this.initialize();
  }

  setMiddlewares() {
    this.server.use(cors());
    this.server.use(morgan('dev'));
    this.server.use(express.urlencoded({extended: true, strict: false}))
    this.server.use(express.json());
  }

  setRoutes() {
    this.server.get('/', (req, res) => {
      res.send('Express API Powered by AWS Lambda!');
    });

    this.server.use('/v1/api', apiRouter);
  }

  catchErrors() {
    this.server.use(helpers.errorHandler.notFound);
    this.server.use(helpers.errorHandler.internalServerError);
  }

  initialize() {
    this.setMiddlewares();
    this.setRoutes();
    this.catchErrors();
  }
}

module.exports = new Server().server;

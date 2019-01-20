const express = require('express');
const AWS = require('aws-sdk');

const CALCULATIONS_TABLE = process.env.CALCULATIONS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const app = express();

app.use(express.urlencoded({extended: true, strict: false}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Create publish function
function publishSnsTopic(data) {
  const params = {
    Message: JSON.stringify(data),
    TopicArn: `arn:aws:sns:eu-central-1:066549572091:yotam-store-sns`
  };

  return sns.publish(params).promise();
}

// Create Calculation endpoint
app.post('/calculations', async (req, res) => {
  const { calcId } = req.body;
  await publishSnsTopic(calcId);
  res.json({calcId});
});

// Get Calculation endpoint
app.get('/calculations/:calcId', (req, res) => {
  if (req.params.calcId < 10) {
    res.json({ calcId: req.params.calcId, result: Math.pow(2, req.params.calcId) });
  }

  const params = {
    TableName: CALCULATIONS_TABLE,
    Key: {
        calcId: req.params.calcId,
    },
  }

  dynamoDb.get(params, (error, data) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get calculation.' });
    }
    if (data.Item) {
      const {calcId, result } = data.Item;
      res.json({ calcId, result });
    } else {
      res.status(404).json({ error: "Calculation not found" });
    }
  });
});

// 404 Not Found
app.use(function (req, res, next) {
  console.log('404 Not Found');
  res.status(404).send('404 Not Found!');
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});

module.exports = app;

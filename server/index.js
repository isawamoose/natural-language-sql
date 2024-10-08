const express = require('express');
const Database = require('./database');
const GPT = require('./gpt');
const config = require('./config');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const db = new Database(config);
const gpt = new GPT(config);

app.post('/query', async (req, res) => {
  const query = req.body.query;
  const querySQL = await gpt.generateSQL(query);
  const result = await db.query(querySQL);
  const interpretedResult = await gpt.interpretResult(query, result);
  res.json({ querySQL, interpretedResult });
});

app.use('*', (req, res) => {
  res.status(404).json({
    message: `unknown endpoint ${req.originalUrl}`,
  });
});

app.listen(3000, () => {
  console.log(`Server started on port 3000`);
});

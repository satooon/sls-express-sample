'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.get('/hoge', (req, res) => {
  res.json({ message: 'Hello Hoge!' });
});

export const main = serverless(app);
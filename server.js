// Server

const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;

const connection = mongoose.connect(MONGODB_URI);
const db = mongoose.connection;

console.log(db.collection("sample_airbnb"));

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

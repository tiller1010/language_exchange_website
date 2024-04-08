require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';

let db;

async function connectToDB(){
  const client = new MongoClient(mongoURL, { usewNewUrlParser: true });
  await client.connect();
  db = client.db('videoapp');
}

function getDB(){
  return db;
}

module.exports = { connectToDB, getDB };

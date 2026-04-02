const { MongoClient } = require('mongodb');

let db;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'bus_tracker';

  if (!uri) {
    throw new Error('MONGODB_URI is missing');
  }

  const client = new MongoClient(uri);
  await client.connect();

  db = client.db(dbName);
  console.log('MongoDB connected');
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

module.exports = {
  connectDB,
  getDB,
};
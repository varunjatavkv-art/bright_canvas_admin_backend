import  mongoose from 'mongoose';
// Load environment variables from .env (if present)
// require('dotenv').config();
import 'dotenv/config.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://varunjatavkv_db_user:ykFUNNRdhhwUm3yu@photography.yjkmswc.mongodb.net/';

async function connectWithRetry(retries = 0) {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(MONGO_URI, options);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error', err && err.message ? err.message : err);
    const delay = Math.min(30000, 2000 * (retries + 1));
    console.log(`Retrying MongoDB connection in ${delay / 1000}s...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return connectWithRetry(retries + 1);
  }
}

export const db  = { connectWithRetry, mongoose };

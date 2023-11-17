// routes/logs.js
import express from "express";
import Log from "../models/logs.js";
import axios from "axios";
const router = express.Router();
import redis from "redis";

// Redis client setup
const redisClient = redis.createClient({
    host: "localhost",
    port: 6379,
});
// In-memory cache for processed logs
const logCache = [];

router.get("/", (req, res) => {
    res.send("Hello1");
});

router.post('/ingest', async (req, res) => {
    try {
      const logs = req.body;
  
      // Ensure logs is an array
      if (!Array.isArray(logs)) {
        return res.status(400).json({ message: 'Logs must be provided as an array' });
      }
  
      // Insert all logs in the array
      const insertedLogs = await Log.insertMany(logs);
  
      // Cache the inserted logs in Redis
      redisClient.rpush('logsCache', JSON.stringify(insertedLogs));
  
      // Trigger asynchronous processing with AWS Lambda
      await triggerLambdaProcessing(logs);
  
      res.status(201).json({ message: 'Logs ingested successfully', logs: insertedLogs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Function to trigger AWS Lambda asynchronously
  async function triggerLambdaProcessing(logs) {
    try {
      const lambdaEndpoint = 'https://your-lambda-endpoint.amazonaws.com';
      await axios.post(lambdaEndpoint, logs);
    } catch (error) {
      console.error('Error triggering AWS Lambda:', error.message);
    }
  }
  
  router.get('/logs', async (req, res) => {
    try {
      // Check if logs are available in the Redis cache
      redisClient.lrange('logsCache', 0, -1, (err, cachedLogs) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        // If cache is not empty, return cached logs
        if (cachedLogs && cachedLogs.length > 0) {
          const parsedLogs = cachedLogs.map((log) => JSON.parse(log));
          return res.json({ logs: parsedLogs });
        }
  
        // If cache is empty, fetch logs from the database
        Log.find({}, (err, fetchedLogs) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
          }
  
          // Cache the fetched logs in Redis
          fetchedLogs.forEach((log) => {
            redisClient.rpush('logsCache', JSON.stringify(log));
          });
  
          res.json({ logs: fetchedLogs });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default router;

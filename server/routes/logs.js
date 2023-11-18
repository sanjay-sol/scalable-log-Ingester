// routes/logs.js
import express from "express";
import Log from "../models/logs.js";
import axios from "axios";
const router = express.Router();
import redis from "redis";


const redisClient = redis.createClient({});
const logCache = [];

router.get("/", (req, res) => {
    res.send("Hello1");
});

router.post('/ingest', async (req, res) => {
    try {
      const logs = req.body;
      if (!Array.isArray(logs)) {
        return res.status(400).json({ message: 'Logs must be provided as an array' });
      }

      const insertedLogs = await Log.insertMany(logs);

      redisClient.rpush('logsCache', JSON.stringify(insertedLogs));
      await triggerLambdaProcessing(logs);
  
      res.status(201).json({ message: 'Logs ingested successfully', logs: insertedLogs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  async function triggerLambdaProcessing(logs) {
    try {
      const lambdaEndpoint = 'https://lambda-endpoint.amazonaws.com';
      await axios.post(lambdaEndpoint, logs);
    } catch (error) {
      console.error('Error triggering AWS Lambda:', error.message);
    }
  }
  
  router.get('/logs', async (req, res) => {
    try {
      redisClient.lrange('logsCache', 0, -1, (err, cachedLogs) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (cachedLogs && cachedLogs.length > 0) {
          const parsedLogs = cachedLogs.map((log) => JSON.parse(log));
          return res.json({ logs: parsedLogs });
        }
  
        Log.find({}, (err, fetchedLogs) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
          }
  
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

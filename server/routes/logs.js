// routes/logs.js
import express from "express";
import Log from "../models/logs.js";
import axios from "axios";
const router = express.Router();

// In-memory cache for processed logs
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

    // Insert all logs in the array
    const insertedLogs = await Log.insertMany(logs);

    // Cache the inserted logs
    logCache.push(...insertedLogs);

    // Trigger asynchronous processing with AWS Lambda
    await triggerLambdaProcessing(logs);

    res.status(201).json({ message: 'Logs ingested successfully', logs: insertedLogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

async function triggerLambdaProcessing(logs) {
  try {
    // Replace 'lambdaEndpoint' with your actual Lambda function endpoint
    const lambdaEndpoint = 'https://your-lambda-endpoint.amazonaws.com';
    await axios.post(lambdaEndpoint, logs);
  } catch (error) {
    console.error('Error triggering AWS Lambda:', error.message);
  }
}
router.get('/logs', async (req, res) => {
    try {
      if (logCache.length > 0) {
        return res.json({ logs: logCache });
      }
  
      const fetchedLogs = await Log.find({});
      
      logCache.push(...fetchedLogs);
  
      res.json({ logs: fetchedLogs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default router;

// import redis from "redis";

// const redisClient = redis.createClient({
//     host: "localhost",
//     port: 6379,
// });

// async function getLogs() {
//      const result = await redisClient.get('name:1');
//     console.log("result");
// }

// getLogs();
// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import sendLogs from './sendLogs.js';
const app = express();
const PORT = 3000;
app.use(bodyParser.json());


app.post('/logs', (req, res) => {
  const logEntry = req.body;

  console.log('log :', logEntry);

  res.status(200).send('Log received sucessfully');
});



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

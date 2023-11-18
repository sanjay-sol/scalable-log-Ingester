import express from 'express';
import bodyParser from 'body-parser';
import { Client } from '@elastic/elasticsearch';

const app = express();
const port = 3000;

const esClient = new Client({ node: 'http://localhost:9200' });

app.use(bodyParser.json());

let requestNumber = 0;

app.post('/logs', async (req, res) => {
  const currentRequestNumber = ++requestNumber;
  console.log(`Processing Request #${currentRequestNumber}`);

  try {
    const logData = req.body;

    await esClient.index({
      index: 'logs',
      body: logData,
    });

    console.log(`Request #${currentRequestNumber} processed successfully`);
    res.status(200).json({ message: 'Log ingested successfully' });
  } catch (error) {
    console.error(`Error processing Request #${currentRequestNumber}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

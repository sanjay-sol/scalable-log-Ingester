require('array.prototype.flatmap').shim();
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const port = 3000;
dotenv.config();
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
        username: 'elastic',
        password: process.env.ELASTIC_PASSWORD,
    }
});
app.use(express.json());
async function run () {
  await client.indices.create({
    index: 'tweets',
    operations: {
      mappings: {
        properties: {
         level : { type: 'keyword' },
            message : { type: 'text' },
            resourceId : { type: 'keyword' },
            timestamp : { type: 'date' },
            traceId : { type: 'keyword' },
            spanId : { type: 'keyword' },
            commit : { type: 'keyword' },
            parentResourceId : { type: 'keyword' },

        }
      }
    }
  }, { ignore: [400] })

  const dataset = [
    { "level": "error1", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error1", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error1", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error1", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error1", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error1", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error2", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error2", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error2", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error2", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error2", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error2", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error2", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error3", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error3", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error3", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error3", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error3", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error4", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error4", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error4", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error4", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error45", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error5", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error5", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "erro5", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"},
    { "level": "error", "message": "Failed to connect to DB","resourceId": "server-1234","timestamp": "2023-09-15T08:00:00Z","traceId": "abc-xyz-123", "spanId": "span-456","commit": "5e5342f","parentResourceId": "server-0987"}
]

app.post('/logs', async (req,res) => {
    try {
        if (!req.body || !Array.isArray(req.body)) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const result = await bulkIndex(req.body);
        res.status(200).json({ message: 'Logs ingested successfully.', result : result });
    } catch (err) {
        console.error("Error while ingesting:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}) 

app.listen(port , (req,res) => {
    console.log(`Server is running on port ${port}`)
});
async function bulkIndex(logs) {

  const operations = logs.flatMap(doc => [{ index: { _index: 'tweets' } }, doc])

  const bulkResponse = await client.bulk({ refresh: true, operations })

  if (bulkResponse.errors) {
    const erroredDocuments = []
    //! The items array has the same order of the dataset we just indexed.
    //! The presence of the `error` key indicates that the operation
    //! that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0]
      if (action[operation].error) {
        erroredDocuments.push({
          //! If the status is 429 it means that you can retry the document,
          //! otherwise it's very likely a mapping error, and you should
          //! fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: operations[i * 2],
          document: operations[i * 2 + 1]
        })
      }
    })
    console.log(erroredDocuments)
  }

  const count = await client.count({ index: 'tweets' })
  console.log(count)
}
}

run().catch(console.log)
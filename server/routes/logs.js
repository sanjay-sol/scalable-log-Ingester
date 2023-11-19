import express from 'express';
import client from '../client.js';
import dotenv from 'dotenv';
import redis from 'redis';
import util from 'util';

const router = express.Router();
dotenv.config();

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
});

redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

const redisGetAsync = util.promisify(redisClient.get).bind(redisClient);

const app = express();
app.use(express.json());

router.post('/logs', async (req, res) => {
    try {
        if (!req.body || !Array.isArray(req.body)) {
            return res.status(400).json({ error: 'Data should be in JSON format.' });
        }

        const result = await bulkIndex(req.body);
        res.status(200).json({ message: 'Logs ingested successfully.', result });
    } catch (err) {
        console.error("Error while ingesting:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/searchtext/:text/:size', async (req, res) => {
    try {
        const { text, size } = req.params;

        if (!text) {
            return res.status(400).json({ error: 'At least one out of query or level parameters is required.' });
        }

        const result = await searchQuery(size, text);
        res.status(200).json({ message: 'Search completed successfully.', result });
    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/searchfields/:field/:text/:size/', async (req, res) => {
    try {
        const { field, text, size } = req.params;

        if (!text && !field) {
            return res.status(400).json({ error: 'Both parameters are required.' });
        }

        const result = await searchQuerybyField(field, text, size);
        res.status(200).json({ message: 'Search completed successfully.', result });
    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function bulkIndex(dataSet) {
    const result = await client.helpers.bulk({
        datasource: dataSet,
        concurrency: 12,
        onDocument(doc) {
            return {
                index: {
                    _index: 'final',
                    _id: doc._id,
                },
            };
        },
        onDrop(doc) {
            console.error("Can't find index ", doc.error);
        },
        refreshOnCompletion: 'final',
    });

    // Store the dataSet in Redis
    redisClient.set('dataSet', JSON.stringify(dataSet));

    console.log(result);
    return result;
}

async function searchQuery(size, text) {
    const sizeInt = parseInt(size) || 10;
    const redisData = await redisGetAsync('dataSet');

    if (redisData) {
        console.log('Data retrieved from Redis:', JSON.parse(redisData));
        return JSON.parse(redisData);
    }

    const result = await client.search({
        index: 'final',
        body: {
            query: {
                query_string: {
                    query: `*${text}*`,
                },
            },
        },
        size: sizeInt,
    });

    console.log(result?.hits?.hits?.map((hit) => hit._source));
    return result;
}

async function searchQuerybyField(field, value, size) {
    const sizeInt = parseInt(size) || 10;
    const redisData = await redisGetAsync('dataSet');

    if (redisData) {
        console.log('Data retrieved from Redis:', JSON.parse(redisData));
        return JSON.parse(redisData);
    }

    // If not in Redis, query Elasticsearch
    const result = await client.search({
        index: 'final',
        body: {
            query: {
                match: {
                    [field]: value,
                },
            },
        },
        size: sizeInt,
    });

    console.log(result?.hits?.hits?.map((hit) => hit._source));
    return result;
}

export default router;

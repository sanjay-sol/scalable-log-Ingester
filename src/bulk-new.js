import express from 'express';
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

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

app.post('/bulk-index', async (req, res) => {
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

app.post('/search/:query1', async (req, res) => {
    try {
        const { query1 } = req.params;

        if (!query1) {
            return res.status(400).json({ error: 'Both query and level parameters are required.' });
        }

        const result = await searchQuery(query1);
        res.status(200).json({ message: 'Search completed successfully.', result });
    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function bulkIndex(dataSet) {
    const result = await client.helpers.bulk({
        datasource: dataSet,
        onDocument(doc) {
            const { _id, ...dataWithoutId } = doc;
            return {
                index: {
                    _index: 'new',
                    _id: _id,
                }
            };
        },
        onDrop(doc) {
            console.error("Can't find index ", doc.error);
        },
        refreshOnCompletion: 'new',
    });

    console.log(result);
    return result;
}

async function searchQuery(query1) {
    const result = await client.search({
        index: 'new',
        body: {
            query: {
                match : {
                    level : query1,
                }
            }
        }
    });

    console.log(result?.hits?.hits);
    return result;
}

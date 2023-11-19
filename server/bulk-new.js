import express from 'express';
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000 || process.env.PORT;

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
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World")
    });
app.post('/logs', async (req, res) => {
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

app.post('/search/:text', async (req, res) => {
    try {
        const { text } = req.params;

        if (!text ) {
            return res.status(400).json({ error: 'atleast one out of query or level parameters are required.' });
        }

        const result = await searchQuery( text);
        res.status(200).json({ message: 'Search completed successfully.', result });
    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
});

async function bulkIndex(dataSet) {
    const result = await client.helpers.bulk({
        datasource: dataSet,
        concurrency: 15, 
        onDocument(doc) {
            // const { _id, ...dataWithoutId } = doc;
            return {
                index: {
                    _index: 'new',
                    _id: doc._id,
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

async function searchQuery( text) {
    const result = await client.search({
        index: 'new',
        body: {
            query: {
                query_string: {
                    query: `*${text}*`,
                    // fields: [field], 
                },
            }
        }
    });

    console.log(result?.hits?.hits?.map(hit => hit._source));
    return result;
}

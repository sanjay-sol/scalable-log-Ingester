import express from 'express';
import  client  from '../client.js';
import dotenv from 'dotenv';
const router = express.Router();
dotenv.config();

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

router.post('/search/:text', async (req, res) => {
    try {
        const { text } = req.params;

        if (!text ) {
            return res.status(400).json({ error: 'atleast one out of query or level parameters are required.' });
        }

        const result = await searchQuery(text);
        res.status(200).json({ message: 'Search completed successfully.', result });
    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


async function bulkIndex(dataSet) {
    const result = await client.helpers.bulk({
        datasource: dataSet,
        concurrency: 15, 
        onDocument(doc) {
            // const { _id, ...dataWithoutId } = doc;
            return {
                index: {
                    _index: 'final',
                    _id: doc._id,
                }
            };
        },
        onDrop(doc) {
            console.error("Can't find index ", doc.error);
        },
        refreshOnCompletion: 'final',
    });

    console.log(result);
    return result;
}

async function searchQuery(text) {
    const result = await client.search({
        index: 'final',
        body: {
            query: {
                query_string: {
                    query: `*${text}*`,
                },
            }
        }
    });

    console.log(result?.hits?.hits?.map(hit => hit._source));
    return result;
}


export default router;

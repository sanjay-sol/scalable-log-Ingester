// import {Client} from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
// import path from 'path';
import split from 'split2';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const client = new Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
        // apiKey: 'essu_ZDIxT2J6UnZjMEpxVTNOUE0yZzVOM2xyYzJRNmNqZFBTbXB0VmkxVVQybFZUVUYxTURWcExVSlJadz09AAAAACtdyeM='
        username : 'elastic',
        password : process.env.ELASTIC_PASSWORD,
    }
});

async function run() {
 const { body : exists} = await client.indices.exists({
        index: 'logs7'
    })
    if(exists) return;
    await client.indices.create({
        index: 'logs7',
        body: {
            mappings: {
                dynamic: 'strict',
                properties: {
                    level: { type: 'text' },
                    message: { type: 'text' },
                    resourceId: { type: 'text' },
                    timestamp: { type: 'text' },
                    traceId: { type: 'text' },
                    spanId: { type: 'text' },
                    commit: { type: 'text' },
                    parentResourceId: { type: 'text' }  
                }
            }
        }
    })
}
async function bulk() {
    const datasetPath =  './constants/logs.json';
    console.log("##################################",datasetPath);
    const dataSource = fs.createReadStream(datasetPath);
    const result = await client.helpers.bulk({
        datasource: dataSource
        .pipe(split(JSON.parse))
        .on('data', function (logObject) {
          // Each logObject here is a parsed JSON object
          console.log(logObject);
        })
        .on('error', function (error) {
          console.error('Error parsing JSON:', error);
        }),
        retries: 10,
        wait: 10000,
        concurrency: 10,

        onDocument(doc) {
            console.log("----------------" , typeof doc);
            return {
                index: {
                    _index: 'logs7',
                    _id: doc._id
                }
            }
        },
        onDrop(doc) {

            console.log("can't index ", doc.document.id , " ", doc.error);
            process.exit(1);
        }   

    })
    console.log(result);
}
try {
    run().then(bulk());
} catch (err) {
    console.error(" in last catch block -----------" , err);
    process.exit(1);
}

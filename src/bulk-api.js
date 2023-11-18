// import {Client} from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();
import { Client } from '@elastic/elasticsearch';
// import {promisify} from 'util';
import logsData from './constants/logs.json' assert { type: "json" };

const client = new Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
        username : 'elastic',
        password : process.env.ELASTIC_PASSWORD,
    }
});

async function * dataSource() {
    const dataSet =  logsData;
    for (const doc of dataSet) {
        yield doc
    }
}
async function bulk() {
    const result = await client.helpers.bulk({
        datasource: dataSource(),
        onDocument(doc) {
            const { _id, ...dataWithoutId } = doc;
            return {
                index: {
                    _index: 'new',
                    _id: _id,
                }
            }
        },
        onDrop(doc) {

            console.log("can't find index ", doc.error);
            process.exit(1);
        },
        refreshOnCompletion: 'new',

    })
    console.log(result);
}
try {
    await bulk();
    console.log("done");
    process.exit(0);
} catch (err) {
    console.error(" in last catch block -----------" , err);
    process.exit(1);
}

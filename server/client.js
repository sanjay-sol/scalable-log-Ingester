import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();


 const client = new Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
        username: 'elastic',
        password: process.env.ELASTIC_PASSWORD,
    }
});

export default client;
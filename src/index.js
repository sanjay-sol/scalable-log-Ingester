// import {Client} from '@elastic/elasticsearch';

import { Client } from '@elastic/elasticsearch';

const client = new Client({
    cloud: {
        id: 'scalable_logs:dXMtZ292LWVhc3QtMS5hd3MuZWxhc3RpYy1jbG91ZC5jb206NDQzJGE0NTRjNDAyNjM4MzRiYmU4MzFmZmRkOTQ1YWFmN2MzJDA4ZDI3NjFjYjEwOTQwNDA4OWNkZjk2MjUzOTM2ZDIy',
    },
    auth: {
        // apiKey: 'essu_ZDIxT2J6UnZjMEpxVTNOUE0yZzVOM2xyYzJRNmNqZFBTbXB0VmkxVVQybFZUVUYxTURWcExVSlJadz09AAAAACtdyeM='
        username : 'elastic',
        password : 'ZS54aj7RcT5m9cn8QJjYvAzU'
    }
});

async function run() {
  const response = await client.index({
    index: 'game-of-thrones',
    id:'1',
    refresh: true,
    body : { foo : 'bar'}
    })
    console.log(response);

    const res = await client.get({
        index:'game-of-thrones',
        id:'1'
    })
    console.log(res);
}
run().catch(err =>{
    console.log(err);
    process.exit(1);
});

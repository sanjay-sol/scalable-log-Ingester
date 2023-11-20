
# Scalable Logs Application

This repository contains code for a Scalable Logs Application that integrates with Elastic Cloud and Redis.

## Setup Elastic Cloud Instances

1. Visit [Elastic Cloud Console](https://console.us-gov-east-1.aws.elastic-cloud.com/login?redirectTo=%2Fhome).
2. Set up Elastic Cloud instances.
3. Configure the following environment variables in your server/.env file

### With REDIS

```bash
--- server/.env

ELASTIC_CLOUD_ID='scalable_logs:dXMtZ292LW.........'
ELASTIC_PASSWORD='ZS54aj7Rc........'
REDIS_HOST='redis-19687.c1.asia-north1-1.........'
REDIS_PORT=19687

1 . client
cd my-app 
npm install
npm run dev
go to http://localhost:3001


2. server

cd server 
npm install
npm run server  

 send logs from POSTAMN

POST http://localhost:3000/logs

note : npm run index --- without redis 


```

### Without REDIS
# 

```bash
--- server/.env

ELASTIC_CLOUD_ID='scalable_logs:dXMtZ292LW.........'
ELASTIC_PASSWORD='ZS54aj7Rc........'


1 . client
cd my-app 
npm install
npm run dev
go to http://localhost:3001


2. server

cd server 
npm install
npm run index 

 send logs from POSTAMN

POST http://localhost:3000/logs

```
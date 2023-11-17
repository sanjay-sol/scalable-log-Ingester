import redis from "redis";

// Redis client setup
const redisClient = redis.createClient({
    host: "localhost",
    port: 6379,
});

async function getLogs() {
     const result = await redisClient.get('user:2');
    console.log("result");
}

getLogs();
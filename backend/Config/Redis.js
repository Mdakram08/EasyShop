import redis from "redis";
import { promisify } from "util";
import dotenv from "dotenv";
dotenv.config();


// Create a Redis client to connect to the Redis server
const redisUrl = process.env.REDIS_URL;

console.log(
    "[Redis] Environment variable:",
    redisUrl ? "LOADED" : "NOT LOADED"
);
console.log("Redis URL exists:", !!process.env.REDIS_URL);
console.log("Redis host:", process.env.REDIS_URL
    ? new URL(process.env.REDIS_URL).hostname
    : "MISSING");

const redisClient = redis.createClient(
    redisUrl || "redis://127.0.0.1:6379"
);

redisClient.on("error", (err) => {
  console.error("[Redis] Error:", err.message);
});

redisClient.on("ready", () => {
  console.log("[Redis] Connected successfully");
});



// Used to retrieve cached product data
export const getData=
  promisify(redisClient.get).bind(redisClient);

export const setData =
  promisify(redisClient.set).bind(redisClient);

export const delData=
  promisify(redisClient.del).bind(redisClient);

// Create a function that waits until Redis is ready
export function connectRedis() {
  return new Promise((resolve, reject) => {
    // If Redis is already ready, finish successfully
    if (redisClient.ready) {
      return resolve();
    }
    // This function runs when Redis becomes ready
    const onReady = () => {
      cleanup();
      resolve();
    };

    // This function runs if Redis encounters an error
    const onError = (err) => {
      cleanup();
      reject(err);
    };

    // Remove the temporary ready and error listeners
    const cleanup = () => {
      redisClient.removeListener("ready", onReady);
      redisClient.removeListener("error", onError);
    };

    // Wait for Redis to become ready
    redisClient.once("ready", onReady);
    // Listen for an error before Redis becomes ready
    redisClient.once("error", onError);
  });
}


// Export the original Redis client for use in other backend files
export default redisClient;
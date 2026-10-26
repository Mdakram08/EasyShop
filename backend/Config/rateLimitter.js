
import redisClient from "./Redis.js";
import { promisify } from "util";

const incrAsync = promisify(redisClient.incr).bind(redisClient);
const expireAsync = promisify(redisClient.expire).bind(redisClient);
const ttlAsync = promisify(redisClient.ttl).bind(redisClient);

export const rateLimitter = async (req, res, next) => {
    try {
        const key = `rate-limiter:${req.ip}`;

        const request = await incrAsync(key);
        const ttl = await ttlAsync(key);

        // Set expiration if this is a new key
        // or an existing key without expiration.
        if (request === 1 || ttl === -1) {
            await expireAsync(key, 60);
        }

        console.log({
            ip: req.ip,
            request,
            ttl: await ttlAsync(key)
        });

        if (request > 5) {
            return res.status(429).json({
                message: "Too many requests. Please try again later."
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

//Cache Redis Client
// used for - Caching ,Sessions, Rate Limiting, otp, temporary data

import { Redis } from "ioredis";
import redisConfig from "./redis.config.js";

export const redis = new Redis(redisConfig);

redis.on("connect", () => {
    console.log("Cache redis connected successfully")
})

redis.on("error", (error) => {
    console.log("Cache redis connection failed", error)
})
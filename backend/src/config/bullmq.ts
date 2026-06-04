import { Redis } from "ioredis";
import redisConfig from "./redis.config.js";

// BullMQ should have its own connection with redis
// bullmq uses queue, worker, jobs 
 const bullmqConnection = new Redis(redisConfig)
 

bullmqConnection.on("connect", () => {
    console.log("BullMQ redis connected successfully")
})

bullmqConnection.on("error", (error) => {
    console.log("BullMQ redis connection failed", error)
})

export default bullmqConnection;
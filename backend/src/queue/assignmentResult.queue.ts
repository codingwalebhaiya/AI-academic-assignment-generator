
import { Queue } from "bullmq";
import redisConfig from "../config/redis.config.js";

export const assignmentQueue = new Queue("assignment-queue",
    {
        connection: redisConfig,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000
            }
        },
    }
)
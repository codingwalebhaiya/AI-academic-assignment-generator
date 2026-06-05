
import { Queue } from "bullmq";
import redisConfig from "../config/redis.config.js";

export const assignmentQueue = new Queue("assignment-queue",
    {
        connection: redisConfig,
        defaultJobOptions: {
            attempts: 1,

            // Delays are ignored by BullMQ when attempts is set to 1.
            // backoff: {
            //     type: "exponential",
            //     delay: 1000,
            // },
        },
    }
)
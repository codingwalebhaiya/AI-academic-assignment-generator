import { QueueEvents } from "bullmq";
import redisConfig from "./redis.config.js";

const queueEvents = new QueueEvents(
    "assignment-queue",
    {
        connection: redisConfig
    }
);

await queueEvents.waitUntilReady();


queueEvents.on("completed", ({ jobId }) => {
   console.log("completed", jobId);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
   console.log("failed", jobId, failedReason);
});
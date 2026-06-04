


// (alias) new Queue<any, any, string, any, any, string>(name: string, opts?: QueueOptions | undefined, Connection?: typeof RedisConnection): Queue<any, any, string, any, any, string>
// import Queue
// Queue

// This class provides methods to add jobs to a queue and some other high-level administration such as pausing or deleting queues.

// @typeParam — DataType - The type of the data that the job will process.

// @typeParam — ResultType - The type of the result of the job.

// @typeParam — NameType - The type of the name of the job.

// @example

// import { Queue } from 'bullmq';

// interface MyDataType {
//  foo: string;
// }

// interface MyResultType {
//   bar: string;
// }

// const queue = new Queue<MyDataType, MyResultType, "blue" | "brown">('myQueue');

import { Queue } from "bullmq";
import redisConfig from "../config/redis.config.js";

export const assignmentQueue = new Queue("assignment-queue",
    {
        connection: redisConfig,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000,
            },
        },
    }
)
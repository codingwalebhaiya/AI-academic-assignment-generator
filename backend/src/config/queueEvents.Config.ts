import { QueueEvents } from "bullmq";
import redisConfig from "./redis.config.js";
import Assignment from "../model/assignment.model.js";
import Result from "../model/result.model.js"
import { getIO } from "./socket.js"


export const queueEvents = new QueueEvents(
    "assignment-queue",
    {
        connection: redisConfig
    }
);

export const initializeQueueEvents = async () => {
    await queueEvents.waitUntilReady();

    console.log("✅ QueueEvents ready");

    /**
     * Progress Updates
     */
    queueEvents.on(
        "progress",
        async ({ jobId, data }) => {
            try {
                const assignment = await Assignment.findOne({
                    jobId: String(jobId),
                });

                if (!assignment) {
                    return;
                }

                getIO()
                    .to(`assignment:${assignment._id}`)
                    .emit("assignment-status", {
                        progress: data.progress,
                        status: data.status,
                        message: data.message,
                    });

                console.log(
                    `📊 Assignment ${assignment._id} Progress: ${data.progress}%`
                );
            } catch (error) {
                console.error(
                    "QueueEvents Progress Error:",
                    error
                );
            }
        }
    );

    /**
     * Completed
     */
    queueEvents.on(
        "completed",
        async ({ jobId }) => {
            try {
                const assignment = await Assignment.findOne({
                    jobId: String(jobId),
                });

                if (!assignment) {
                    return;
                }

                const result = await Result.findOne({
                    assignmentId: assignment._id,
                });

                getIO()
                    .to(`assignment:${assignment._id}`)
                    .emit("assignment-status", {
                        progress: 100,
                        status: "completed",
                        message: "Assignment ready!",
                        resultId: result?._id,
                    });

                console.log(
                    `✅ Assignment ${assignment._id} Completed`
                );
            } catch (error) {
                console.error(
                    "QueueEvents Completed Error:",
                    error
                );
            }
        }
    );

    /**
     * Failed
     */
    queueEvents.on(
        "failed",
        async ({ jobId, failedReason }) => {
            try {
                const assignment = await Assignment.findOne({
                    jobId: String(jobId),
                });

                if (!assignment) {
                    return;
                }

                await Assignment.findByIdAndUpdate(
                    assignment._id,
                    {
                        status: "failed",
                        progress: 0,
                    }
                );

                getIO()
                    .to(`assignment:${assignment._id}`)
                    .emit("assignment-status", {
                        progress: 0,
                        status: "failed",
                        message:
                            failedReason ||
                            "Assignment generation failed",
                    });

                console.log(
                    `❌ Assignment ${assignment._id} Failed`
                );
            } catch (error) {
                console.error(
                    "QueueEvents Failed Error:",
                    error
                );
            }
        }
    );
};

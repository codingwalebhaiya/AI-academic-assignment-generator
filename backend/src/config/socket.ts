import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
import redisConfig from "./redis.config.js";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (server: HttpServer) => {
    const pubClient = new Redis(redisConfig);
    const subClient = pubClient.duplicate();

    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.adapter(createAdapter(pubClient, subClient));

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("join-assignment", (assignmentId: string) => {
            socket.join(`assignment:${assignmentId}`);
            console.log(`Socket ${socket.id} joined assignment room: ${assignmentId}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const SocketService = {
    emitToAssignment: (assignmentId: string, event: string, data: any) => {
        if (io) {
            io.to(`assignment:${assignmentId}`).emit(event, data);
        }
    }
};

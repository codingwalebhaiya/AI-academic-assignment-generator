// server entry point
import "./config/env.js";
import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./config/socket.js";
import { initializeQueueEvents } from "./config/queueEvents.Config.js";


const server = http.createServer(app);
initSocket(server);

await initializeQueueEvents();

connectDB();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


import WebSocket, { WebSocketServer } from "ws";
import { createServer } from "http";
import express from "express";
import authRoutes from "./user/routes/auth.js";

const app = express();
const server = createServer(app);

// Attach WebSocket server to the HTTP server
const wss = new WebSocketServer({ server });

// roomId -> Set<WebSocket>
const rooms = new Map();

app.use("/auth", authRoutes);

wss.on("connection", (ws, req) => {
  // Use the incoming Host header (works in prod & local)
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomId = url.searchParams.get("room");

  if (!roomId) {
    ws.close(1008, "Missing room id");
    return;
  }

  console.log(`Client joined room: ${roomId}`);

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(ws);

  ws.on("message", (data) => {
    let payload;
    try {
      payload = JSON.parse(data.toString());
    } catch {
      return;
    }

    for (const client of rooms.get(roomId)) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload));
      }
    }
  });

  ws.on("close", () => {
    console.log(`Client left room: ${roomId}`);

    const room = rooms.get(roomId);
    if (!room) return;

    room.delete(ws);
    if (room.size === 0) rooms.delete(roomId);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`HTTP + WS server running on port ${PORT}`);
});

import WebSocket, { WebSocketServer } from "ws";
import { createServer } from "http";
import express from "express";

const app = express();
const httpServer = createServer(app);
const HOST = "10.155.242.21";
const wss = new WebSocketServer({ port: 4001, host: HOST });

// roomId -> Set<WebSocket>
const rooms = new Map();

wss.on("connection", (ws, req) => {
  // Parse ?room=xyz
  const url = new URL(req.url, `http://${HOST}:4001`);
  const roomId = url.searchParams.get("room");

  if (!roomId) {
    ws.close(1008, "Missing room id");
    return;
  }

  console.log(`Client joined room: ${roomId}`);

  // Add socket to room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(ws);

  ws.on("message", (data) => {
    let payload;
    try {
      payload = JSON.parse(data);
    } catch {
      return;
    }

    // Send to everyone else in the same room
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

    // Cleanup empty rooms
    if (room.size === 0) {
      rooms.delete(roomId);
    }
  });
});

httpServer.listen(4000, HOST, () => {
  console.log("HTTP server running on port 4000");
});

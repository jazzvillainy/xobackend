import express from "express";
import router from "./user/routes/auth.js";
import passport from "passport";
import "./strategy/localStrategy.js";
import session from "express-session";
import { checkSchema } from "express-validator";
import { validationSchema } from "./utils/validationSchema.js";
import { createServer } from "http";
import { Server } from "socket.io";
import WebSocket, { WebSocketServer } from "ws";
import cors from "cors";
import { log } from "console";

const app = express();
const httpServer = createServer(app); // create HTTP server wrapping Express
const io = new Server(httpServer, {
  cors: {
    origin: "*", // TODO: lock this down later
  },
});
app.use(cors());

const wss = new WebSocketServer({
  port: 4001,
});

wss.on("connection", function connection(ws) {
  // ws.send(
  //   JSON.stringify({
  //     position: [3, 3],
  //     mark: "x",
  //   })
  // );
  console.log("new client connected bishhh");

  ws.on("message", function message(data) {
    console.log(JSON.parse(data));
    const i = JSON.parse(data);
    wss.clients.forEach((cli) => cli.send(JSON.stringify(i)));
  });

  ws.on("close", () => {
    console.log("connection closed");
  });
})

app.use(express.json());
app.use(
  session({
    secret: "31331311",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.cookie("username", "Crescent");
  res.status(200).send("<>Hello</>");
});
app.use("/auth", router);

// Start servers
httpServer.listen(4000, () => {
  console.log("HTTP server running on port 4000");
});

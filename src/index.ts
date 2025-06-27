import http from "http";
import express from "express";
import expressStaticGzip from 'express-static-gzip';
import { Server } from "colyseus";
import dotenv from "dotenv";
import authRoutes from "./auth/auth.routes";
import { LobbyRoom } from "./rooms/LobbyRoom";
import { GameRoom } from "./rooms/GameRoom";
import { monitor } from "@colyseus/monitor";
import { setupMongo } from "./config/mongo";

dotenv.config();
const PORT = Number(process.env.PORT) || 3000;
const app = express();
const server = http.createServer(app);
const gameServer = new Server({ server });

app.use(express.json());

app.use(express.static('public'));
// Optionally, redirect root to index.html
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.use("/auth", authRoutes);
app.use("/colyseus", monitor());

gameServer.define("Lobby", LobbyRoom);
gameServer.define("Game", GameRoom);

setupMongo().then(() => {
  gameServer.listen(PORT);
  console.log(`Server listening on http://localhost:${PORT}`);
});

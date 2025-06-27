import { Room, Client } from "colyseus";
import { verifyJWT } from "../auth/jwt.util";
import { GameState } from "./schemas/GameState";

export class GameRoom extends Room<GameState> {
  onCreate(options: any) {
    this.maxClients = 4;
    this.state = new GameState();
    console.log("[GameRoom] created");
  }

  async onAuth(client: Client, options: any) {
    const token = options.token;
    const user = verifyJWT(token);
    if (!user) throw new Error("Unauthorized");
    client.userData = user;
    return true;
  }

  onJoin(client: Client) {
    const username = client.userData?.username;
    console.log(`[GameRoom] ${username} joined.`);
  }

  onLeave(client: Client) {
    console.log(`[GameRoom] ${client.sessionId} left.`);
  }
}

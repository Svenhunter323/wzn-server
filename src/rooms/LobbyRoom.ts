import { Room, Client } from "colyseus";
import { LobbyState, Player } from "./schemas/LobbyState";
import { verifyJWT } from "../auth/jwt.util";

export class LobbyRoom extends Room<LobbyState> {
  onCreate(options: any) {
    this.setState(new LobbyState());
    console.log("[LobbyRoom] created");
  }

  async onAuth(client: Client, options: any): Promise<any> {
    const token = options.token;
    const user = verifyJWT(token);
    if (!user) throw new Error("Unauthorized");
    client.userData = user;
    return true;
  }

  onJoin(client: Client) {
    const username = client.userData?.username || "Anonymous";
    const player = new Player();
    player.id = client.sessionId;
    player.username = username;
    this.state.players.set(client.sessionId, player);
    console.log(`[LobbyRoom] ${username} joined.`);
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    console.log(`[LobbyRoom] ${client.sessionId} left.`);
  }

  onDispose() {
    console.log("[LobbyRoom] disposed");
  }
}

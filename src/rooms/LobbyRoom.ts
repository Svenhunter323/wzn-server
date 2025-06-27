import { Room, Client, matchMaker } from "colyseus";
import { LobbyState} from "./schemas/LobbyState";
import { verifyJWT } from "../auth/jwt.util";
import { ArraySchema } from "@colyseus/schema";
import { Player } from "./schemas/Player";
import { RoomInfo } from "./schemas/RoomInfo";

export class LobbyRoom extends Room<LobbyState> {
  onCreate() {
    this.setState(new LobbyState());

    // Safely update room list every 3 seconds
    this.clock.setInterval(() => this.updateRoomList(), 3000);

    console.log("[LobbyRoom] created");
  }

  async onAuth(client: Client, options: any) {
    const token = options.token;
    const user = verifyJWT(token);
    if (!user) throw new Error("Unauthorized");
    client.userData = user;
    return true;
  }

  onJoin(client: Client) {
    const username = client.userData?.username || "Guest";
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

  async updateRoomList() {
    try {
      const rooms = await matchMaker.query({});
      const roomInfos: RoomInfo[] = [];

      for (const room of rooms) {
        if (room.name === "Lobby") continue;

        const info = new RoomInfo();
        info.roomId = room.roomId;
        info.name = room.name;
        info.playerCount = room.clients;
        info.isJoinable = !room.locked;

        roomInfos.push(info);
      }

      this.state.rooms = new ArraySchema<RoomInfo>(...roomInfos);

      // console.log(this.state.toJSON());
    } catch (err) {
      console.error("[LobbyRoom] Failed to update room list:", err);
    }
  }
}

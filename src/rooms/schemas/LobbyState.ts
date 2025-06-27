import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player } from "./Player";
import { RoomInfo } from "./RoomInfo";

export class LobbyState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([RoomInfo]) rooms = new ArraySchema<RoomInfo>();
}

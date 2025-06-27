import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") id: string;
  @type("string") username: string;
}

export class LobbyState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}

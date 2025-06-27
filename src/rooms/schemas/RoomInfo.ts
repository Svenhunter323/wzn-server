import { Schema, type } from "@colyseus/schema";

export class RoomInfo extends Schema {
  @type("string") roomId: string;
  @type("string") name: string;
  @type("int32") playerCount: number;
  @type("boolean") isJoinable: boolean;
}
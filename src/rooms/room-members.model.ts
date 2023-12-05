import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Room } from "./rooms.model";

export type RoomMemberType = 'admin' | 'moderator' | 'user';

interface RMCAttrs {
  userId: number,
  roomId: number,
  type: RoomMemberType,
}

@Table({
  tableName: 'room_members'
})
export class RoomMember extends Model<RoomMember, RMCAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  type: RoomMemberType;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Room)
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;
}
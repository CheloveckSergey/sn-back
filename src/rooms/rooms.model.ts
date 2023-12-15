import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { RoomMember } from "./room-members.model";
import { Message } from "src/messages/messages.model";

export type RoomType = 'personal' | 'general'; 

interface RoomCreationAttrs {
  name?: string,
  avatar?: string,
  type: RoomType,
}
@Table({
  tableName: 'rooms',
})
export class Room extends Model<Room, RoomCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: true})
  name: string | undefined;

  @Column({type: DataType.STRING, allowNull: true})
  avatar: string | undefined;

  @Column({type: DataType.STRING, allowNull: false, defaultValue: 'general'})
  type: RoomType;

  @HasMany(() => RoomMember)
  roomMembers: RoomMember[];

  @HasMany(() => Message)
  messages: Message[];
}
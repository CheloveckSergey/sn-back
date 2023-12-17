import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { MReadHistory } from "src/m-read-history/m-read-history.model";
import { Room } from "src/rooms/rooms.model";
import { User } from "src/users/users.model";

export type SentMessage = {
  text: string,
  userId: number,
  roomId: number,
}

interface MessageCreationAttrs {
  userId: number,
  roomId: number,
  text: string,
}
@Table({
  tableName: 'messages'
})
export class Message extends Model<Message, MessageCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: true})
  text: string;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Room)
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;

  @HasMany(() => MReadHistory)
  statuses: MReadHistory;
}
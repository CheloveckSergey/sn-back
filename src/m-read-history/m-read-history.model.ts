import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Message } from "src/messages/messages.model";
import { User } from "src/users/users.model";

interface MRHCreationAttrs {
  userId: number,
  messageId: number,
}
@Table({
  tableName: 'm_read_history',
})
export class MReadHistory extends Model<MReadHistory, MRHCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number;

  
  @ForeignKey(() => Message)
  @Column({type: DataType.INTEGER, allowNull: false})
  messageId: number;

  @BelongsTo(() => Message)
  message: Message;

  @Column({type: DataType.BOOLEAN, defaultValue: false, allowNull: false})
  status: boolean;
}
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";

interface FriendRequestCreationAttrs {
  userId1: number,
  userId2: number,
}

@Table({
  tableName: 'friend_requests',
})
export class FriendRequest extends Model<FriendRequest, FriendRequestCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId1: number;

  @BelongsTo(() => User, 'userId1')
  user1: User;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId2: number;

  @BelongsTo(() => User, 'userId2')
  user2: User;

  @Column({type: DataType.BOOLEAN, defaultValue: false})
  accepted: boolean;

  @Column({type: DataType.BOOLEAN, defaultValue: false})
  rejected: boolean;
}
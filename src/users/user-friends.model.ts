import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./users.model";

interface User_FriendAttrs {
  userId1: number,
  userId2: number,
}

@Table({
  tableName: "users_friends",
})
export class User_Friend extends Model<User_Friend, User_FriendAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.INTEGER, allowNull: false})
  userId1: number;

  @Column({type: DataType.INTEGER, allowNull: false})
  userId2: number;
}
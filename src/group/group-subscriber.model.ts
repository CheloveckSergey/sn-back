import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Group } from "./group.model";
import { User } from "src/users/users.model";

@Table({
  tableName: "group-subscriber",
})
export class GroupSubscriber extends Model<GroupSubscriber> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number;

  @ForeignKey(() => Group)
  @Column({type: DataType.INTEGER, allowNull: false})
  groupId: number;
}
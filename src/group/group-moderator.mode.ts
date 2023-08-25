import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Group } from "./group.model";

@Table({
  tableName: "group-moderator",
})
export class GroupModerator extends Model<GroupModerator> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  userId: number;

  @ForeignKey(() => Group)
  @Column({type: DataType.INTEGER})
  groupId: number;
}
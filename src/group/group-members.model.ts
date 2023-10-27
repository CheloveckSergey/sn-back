import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Group } from "./group.model";

export enum GMTypes {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
}

interface GMCreationAttrs {
  userId: number,
  groupId: number,
  gmType: GMTypes,
}

@Table({
  tableName: "group_members",
})
export class GroupMember extends Model<GMCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Group)
  @Column({type: DataType.INTEGER})
  groupId: number;

  @BelongsTo(() => User)
  group: Group;

  @Column({type: DataType.STRING, allowNull: false})
  gmType: GMTypes;
}
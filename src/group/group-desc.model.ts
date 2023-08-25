import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Group } from "./group.model";

interface GroupDescCreationAttrs {
  groupId: number
}

@Table({
  tableName: "groupDescs",
})
export class GroupDesc extends Model<GroupDesc, GroupDescCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: true, unique: false})
  quote: string;

  @Column({type: DataType.STRING, allowNull: true, unique: false})
  subject: string;

  @ForeignKey(() => Group)
  @Column({type: DataType.INTEGER, allowNull: false})
  groupId: number;
}
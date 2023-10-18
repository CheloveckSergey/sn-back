import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { GroupMember } from "./group-members.model";
// import { GroupDesc } from "./group-desc.model";
import { Author } from "src/author/author.model";


interface GroupCreationAttrs {
  name: string,
  avatar?: string,
  authorId: number,
}

@Table({
  tableName: "groups",
})
export class Group extends Model<Group, GroupCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false, unique: true})
  name: string;

  @Column({type: DataType.STRING, allowNull: true})
  avatar: string;

  @HasMany(() => GroupMember)
  groupMembers: GroupMember[];

  // @HasOne(() => GroupDesc)
  // description: GroupDesc;

  @ForeignKey(() => Author)
  @Column({type: DataType.INTEGER, unique: true, allowNull: false})
  authorId: number;

  @BelongsTo(() => Author)
  author: Author;
}
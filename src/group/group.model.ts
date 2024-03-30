import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { GroupMember } from "./group-members.model";
import { Author, AuthorWithSubscribed, OneAuthor } from "src/author/author.model";

// export interface GroupWithSubscribed {
//   id: number,
//   name: string,
//   avatar: string | undefined,
//   author: AuthorWithSubscribed,
// } 

export interface OneGroup {
  id: number,
  name: string,
  avatar: string | null,
  membersNumber: number,
  authorId: number,
  author: OneAuthor,
}

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
  avatar: string | undefined;

  @HasMany(() => GroupMember)
  groupMembers: GroupMember[];

  @ForeignKey(() => Author)
  @Column({type: DataType.INTEGER, unique: true, allowNull: false})
  authorId: number;

  @BelongsTo(() => Author)
  author: Author;
}
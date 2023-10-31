import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { RefreshToken } from "src/auth/refreshTokens.model";
import { Like } from "src/likes/likes.model";
import { Roles } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";
import { Author } from "src/author/author.model";
import { Author_Subs } from "src/author/author-subs.model";
import { GroupMember } from "src/group/group-members.model";
import { User_Friend } from "./user-friends.model";
import { UserDesc } from "src/user-desc/user-desc.model";

interface UserCreationAttrs {
  login: string,
  password: string,
  avatar?: string | undefined,
  authorId: number,
}

@Table({
  tableName: "users",
})
export class User extends Model<User, UserCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, unique: true, allowNull: false})
  login: string;

  @Column({type: DataType.STRING, unique: true, allowNull: false})
  password: string;

  @Column({type: DataType.STRING, unique: false, allowNull: true})
  avatar: string;

  @BelongsToMany(() => Roles, () => UserRoles)
  roles: Roles[];

  @HasOne(() => RefreshToken)
  refreshToken: RefreshToken;

  @HasMany(() => Like)
  likes: Like;

  @HasMany(() => GroupMember)
  groupMembers: GroupMember[];

  @ForeignKey(() => Author)
  @Column({type: DataType.INTEGER, allowNull: false, unique: true})
  authorId: number;

  @BelongsTo(() => Author)
  author: Author;

  @BelongsToMany(() => Author, () => Author_Subs)
  subAuthors: Author[];

  // @BelongsToMany(() => User, () => User_Friend)
  // friends: User[];

  @HasOne(() => UserDesc)
  userDesc: UserDesc;
}
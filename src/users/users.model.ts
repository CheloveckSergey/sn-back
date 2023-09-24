import { BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { RefreshToken } from "src/auth/refreshTokens.model";
import { GroupModerator } from "src/group/group-moderator.mode";
import { Group } from "src/group/group.model";
import { PostLike } from "src/likes/likes.model";
import { Post } from "src/posts/posts.model";
import { Roles } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";
import { Author } from "src/author/author.model";
import { Comment } from "src/comments/comments.model";
import { Author_Subs } from "src/author/author-subs.model";

interface UserCreationAttrs {
  login: string,
  password: string,
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

  @HasMany(() => PostLike)
  postUserLikes: PostLike[];

  @HasMany(() => Group)
  groupAdmin: Group[];

  @BelongsToMany(() => Group, () => GroupModerator)
  groupModerator: Group[];

  @BelongsToMany(() => Group, () => GroupModerator)
  subGroups: Group[];

  @HasOne(() => Author)
  author: Author;

  @HasMany(() => Comment)
  comments: Comment[];

  @BelongsToMany(() => Author, () => Author_Subs)
  subAuthors: Author[];
}
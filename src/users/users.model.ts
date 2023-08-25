import { BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { RefreshToken } from "src/auth/refreshTokens.model";
import { GroupModerator } from "src/group/group-moderator.mode";
import { Group } from "src/group/group.model";
import { PostUserLike } from "src/likes/likes.model";
import { PostUser } from "src/userPOsts/posts.model";
import { Roles } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";

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

  @HasMany(() => PostUser)
  posts: PostUser[];

  @HasMany(() => PostUserLike)
  postUserLikes: PostUserLike[];

  @HasMany(() => Group)
  groupAdmin: Group[];

  @BelongsToMany(() => Group, () => GroupModerator)
  groupModerator: Group[];

  @BelongsToMany(() => Group, () => GroupModerator)
  subGroups: Group[];
}
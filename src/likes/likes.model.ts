import { BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { PostUser } from "src/userPosts/posts.model";
import { User } from "src/users/users.model";

interface PULikesCrAttrs {
  userId: number,
  postUserId: number,
}

@Table({
  tableName: "post_user_likes",
})
export class PostUserLike extends Model<PostUserLike, PULikesCrAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  userId: number;

  @ForeignKey(() => PostUser)
  @Column({type: DataType.INTEGER})
  postUserId: number;
}
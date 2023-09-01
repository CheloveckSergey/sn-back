import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Post } from "src/posts/posts.model";
import { User } from "src/users/users.model";

interface LikeCreationAttrs {
  userId: number,
  postId: number,
}

@Table({
  tableName: "post_likes",
})
export class PostLike extends Model<PostLike, LikeCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  userId: number;

  @ForeignKey(() => Post)
  @Column({type: DataType.INTEGER})
  postId: number;
}
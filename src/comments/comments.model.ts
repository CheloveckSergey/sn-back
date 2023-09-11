import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Image } from "src/images/images.model";
import { Post } from "src/posts/posts.model";

interface CommentCreationAttrs {
  userId: number,
  text: string,
  imageId?: number,
  postId?: number,
}

@Table({
  tableName: "comments",
})
export class Comment extends Model<Comment, CommentCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  text: string;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Image)
  @Column({type: DataType.INTEGER, allowNull: true})
  imageId: number;

  @ForeignKey(() => Post)
  @Column({type: DataType.INTEGER, allowNull: true})
  postId: number;
}
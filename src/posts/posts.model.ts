import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Author } from "src/author/author.model";
import { Comment } from "src/comments/comments.model";
import { PostLike } from "src/likes/likes.model";

export interface PostCreationAttrs {
  authorId: number,
  description: string | undefined
  image: string | undefined,
}

@Table({
  tableName: "posts",
})
export class Post extends Model<Post, PostCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: true})
  description: string;

  @Column({type: DataType.STRING, allowNull: true})
  image: string;

  @ForeignKey(() => Author)
  @Column({type: DataType.INTEGER, allowNull: false})
  authorId: number;

  @HasMany(() => PostLike)
  postLikes: PostLike[];

  @BelongsTo(() => Author)
  author: Author;

  @HasMany(() => Comment)
  comments: Comment[]
}
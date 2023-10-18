import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";
import { Creation } from "src/creations/creations.model";
import { Post } from "src/posts/posts.model";

interface PICreationAttrs {
  value: string,
  postId: number,
  creationId: number,
}

@Table({
  tableName: 'post_images'
})
export class PostImage extends Model<PostImage, PICreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  value: string;

  @ForeignKey(() => Post)
  @Column({type: DataType.INTEGER})
  postId: number;

  @ForeignKey(() => Creation)
  @Column({type: DataType.INTEGER})
  creationId: number;

  @BelongsTo(() => Creation)
  creation: Creation;
}
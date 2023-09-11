import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Author } from "src/author/author.model";
import { Comment } from "src/comments/comments.model";
import { ImageLike } from "src/images-likes/images-likes.model";

interface ImageCreationAttrs {
  value: string,
  authorId: number,
}

@Table({
  tableName: "images",
})
export class Image extends Model<Image, ImageCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false, unique: false})
  value: string;

  @ForeignKey(() => Author)
  authorId: number;

  @BelongsTo(() => Author)
  author: Author;

  @HasMany(() => ImageLike)
  likes: ImageLike[];

  @HasMany(() => Comment)
  comments: Comment[];
}
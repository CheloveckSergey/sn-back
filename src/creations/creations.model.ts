import { BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Author } from "src/author/author.model";
import { CreationType } from "./creation-types.model";
import { Comment } from "src/comments/comments.model";
import { Like } from "src/likes/likes.model";

interface GroupCreationAttrs {
  authorId: number,
  typeId: number,
}

@Table({
  tableName: "creations",
})
export class Creation extends Model<Creation, GroupCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => Author)
  @Column({type: DataType.INTEGER, allowNull: false, unique: false})
  authorId: number;

  @BelongsTo(() => Author)
  author: Author;

  @ForeignKey(() => CreationType)
  @Column({type: DataType.INTEGER, allowNull: false, unique: false})
  typeId: number;

  @BelongsTo(() => CreationType)
  type: CreationType;

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => Like)
  likes: Like[];
}
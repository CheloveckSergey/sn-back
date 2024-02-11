import { BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Creation, OneCommentCreation } from "src/creations/creations.model";

export interface OneComment {
  id: number,
  text: string,
  ownCreationId: number,
  ownCreation: OneCommentCreation,
  creationId: number,
  creation: Creation,
  responseToCommentId: number,
  responseToComment: Comment,
}

interface CommentCreationAttrs {
  authorId: number,
  text: string,
  creationId: number,
  ownCreationId: number,
  responseToCommentId?: number,
  responseToComment: Comment,
}

@Table({
  tableName: "comments",
})
export class Comment extends Model<Comment, CommentCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  text: string;

  @ForeignKey(() => Creation)
  @Column({type: DataType.INTEGER, allowNull: false})
  ownCreationId: number;

  @BelongsTo(() => Creation)
  ownCreation: Creation;

  @ForeignKey(() => Creation)
  @Column({type: DataType.INTEGER, allowNull: false})
  creationId: number;

  @BelongsTo(() => Creation, 'creationId')
  creation: Creation;

  @ForeignKey(() => Comment)
  @Column({type: DataType.INTEGER, allowNull: true})
  responseToCommentId: number;
  
  @BelongsTo(() => Comment, 'responseToCommentId')
  responseToComment: Comment;

  @HasMany(() => Comment, 'responseToCommentId')
  responseComments: Comment[];
}
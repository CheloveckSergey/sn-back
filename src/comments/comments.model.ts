import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";
import { Creation } from "src/creations/creations.model";

interface CommentCreationAttrs {
  authorId: number,
  text: string,
  creationId: number,
  ownCreationId: number,
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
}
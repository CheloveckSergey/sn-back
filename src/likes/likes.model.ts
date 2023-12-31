import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Creation } from "src/creations/creations.model";
import { User } from "src/users/users.model";

interface LikeCreationAttrs {
  userId: number,
  creationId: number,
}

@Table({
  tableName: "likes",
})
export class Like extends Model<Like, LikeCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Creation)
  @Column({type: DataType.INTEGER, allowNull: false})
  creationId: number;

  @BelongsTo(() => Creation)
  creation: Creation;
}
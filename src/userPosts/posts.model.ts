import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { PostUserLike } from "src/likes/likes.model";
import { User } from "src/users/users.model";

export interface PostUserCreationAttrs {
  userId: number,
  description: string | undefined
  image: string | undefined,
}

@Table({
  tableName: "posts",
})
export class PostUser extends Model<PostUser, PostUserCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: true})
  description: string;

  @Column({type: DataType.STRING, allowNull: true})
  image: string;

  // @BelongsTo(() => User)
  // user: User;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number;

  @HasMany(() => PostUserLike)
  postUserLikes: PostUserLike[];
}
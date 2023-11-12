import { BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Creation, OneCreation } from "src/creations/creations.model";
import { OnePostImage, PostImage } from "src/post-images/post-images.model";

export interface OnePost {
  id: number,
  description: string | undefined,
  creationId: number,
  creation: OneCreation,
  postImages: OnePostImage[],
}

export interface PostCreationAttrs {
  description: string | undefined,
  creationId: number,
}

@Table({
  tableName: "posts",
})
export class Post extends Model<Post, PostCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: true})
  description: string | undefined;

  @ForeignKey(() => Creation)
  creationId: number;

  @BelongsTo(() => Creation)
  creation: Creation;

  @HasMany(() => PostImage)
  postImages: PostImage[];
}
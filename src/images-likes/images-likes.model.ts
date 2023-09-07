import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Image } from "src/images/images.model";
import { User } from "src/users/users.model";

interface LikeCreationAttrs {
  userId: number,
  imageId: number,
}

@Table({
  tableName: "images_likes",
})
export class ImageLike extends Model<ImageLike, LikeCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  userId: number;

  @ForeignKey(() => Image)
  @Column({type: DataType.INTEGER})
  imageId: number;
}
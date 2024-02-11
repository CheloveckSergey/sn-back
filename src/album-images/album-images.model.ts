import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Album } from "src/albums/albums.model";
import { Creation, OneCreation } from "src/creations/creations.model";

export interface OneAlbumImage {
  id: number,
  value: string,
  albumId: number,
  creationId: number,
  creation: OneCreation,
}

interface AICreationAttrs {
  value: string,
  creationId: number,
  albumId: number,
}

@Table({
  tableName: "album_images",
})
export class AlbumImage extends Model<AlbumImage, AICreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false, unique: false})
  value: string;

  @ForeignKey(() => Creation)
  @Column({type: DataType.INTEGER, allowNull: false})
  creationId: number;

  @BelongsTo(() => Creation)
  creation: Creation;

  @ForeignKey(() => Album)
  @Column({type: DataType.INTEGER})
  albumId: number;

  @BelongsTo(() => Album)
  album: Album;
}
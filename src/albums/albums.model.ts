import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { AlbumImage, OneAlbumImage } from "src/album-images/album-images.model";
import { Creation } from "src/creations/creations.model";

export interface OneAlbum {
  id: number,
  name: string,
  creationId: number,
  creation: Creation,
  images: OneAlbumImage[],
}

interface AlbumCreationAttrs {
  name: string,
  creationId: number,
}

@Table({
  tableName: 'albums'
})
export class Album extends Model<Album, AlbumCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false, unique: false})
  name: string;

  @ForeignKey(() => Creation)
  @Column({type: DataType.INTEGER})
  creationId: number;

  @BelongsTo(() => Creation)
  creation: Creation;

  @HasMany(() => AlbumImage)
  images: AlbumImage[];
}
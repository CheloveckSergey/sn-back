import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Music } from "src/musics/musics.model";

interface MACreationAttrs {
  name: string,
  image?:string,
}

@Table({
  tableName: 'music-albums'
})
export class MusicAlbum extends Model<MusicAlbum, MACreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.STRING, allowNull: true})
  image: string;

  @HasMany(() => Music, 'albumId')
  musics: Music[];
}
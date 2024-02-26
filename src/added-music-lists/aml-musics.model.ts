import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { AddedMusicList } from "./added-music-lists.model";
import { Music } from "src/musics/musics.model";

@Table({
  tableName: 'aml_musics'
})
export class AMLMusic extends Model<AMLMusic> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => Music)
  @Column({type: DataType.INTEGER})
  musicId: number;

  @ForeignKey(() => AddedMusicList)
  @Column({type: DataType.INTEGER})
  addedMusicListId: number;
}
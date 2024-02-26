import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Author } from "src/author/author.model";
import { AMLMusic } from "./aml-musics.model";
import { Music } from "src/musics/musics.model";

interface AMLCreationAttrs {
  authorId: number,
}

@Table({
  tableName: 'added_music_lists'
})
export class AddedMusicList extends Model<AddedMusicList, AMLCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => Author)
  @Column({type: DataType.INTEGER, allowNull: false})
  authorId: number;

  @BelongsTo(() => Author, 'authorId')
  author: Author;

  @BelongsToMany(() => Music, () => AMLMusic)
  musics: Music[];
}
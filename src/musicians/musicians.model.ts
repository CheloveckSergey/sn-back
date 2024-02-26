import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Music } from "src/musics/musics.model";

interface MusicianCreationAttrs {
  name: string,
  image?: string,
}

@Table({
  tableName: 'musicians',
})
export class Musician extends Model<Musician, MusicianCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.STRING, allowNull: true})
  image: string;

  @HasMany(() => Music, 'musicianId')
  musics: Music[];
}
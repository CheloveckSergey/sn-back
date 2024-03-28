import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { AddedMusicList } from "src/added-music-lists/added-music-lists.model";
import { AMLMusic } from "src/added-music-lists/aml-musics.model";
import { MusicAlbum } from "src/music-albums/music-albums.model";
import { Musician } from "src/musicians/musicians.model";
import { MusicPost } from "./music-post.model";
import { Post } from "src/posts/posts.model";

export type OneMusic = {
  id: number,
  name: string,
  value: string;
  image: string | null;
  musicianId: number;
  musician: Musician;
  albumId: number | null;
  album?: MusicAlbum;
  
  added: boolean,
}

interface MusicCreationAttrs {
  name: string,
  value: string,
  musicianId: number,
  image?: string,
  albumId?: number,
}

@Table({
  tableName: 'musics',
})
export class Music extends Model<Music, MusicCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.STRING, allowNull: false})
  value: string;

  @Column({type: DataType.STRING, allowNull: true})
  image: string;

  @ForeignKey(() => Musician)
  @Column({type: DataType.INTEGER, allowNull: false})
  musicianId: number;

  @BelongsTo(() => Musician, 'musicianId')
  musician: Musician;

  @ForeignKey(() => MusicAlbum)
  @Column({type: DataType.INTEGER, allowNull: true})
  albumId: number | null;

  @BelongsTo(() => MusicAlbum, 'albumId')
  album: MusicAlbum;

  @BelongsToMany(() => AddedMusicList, () => AMLMusic)
  addedMusicLists: AddedMusicList[];

  @BelongsToMany(() => Post, () => MusicPost)
  posts: Post[];
}
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Music } from "./musics.model";
import { Post } from "src/posts/posts.model";

@Table({
  tableName: 'music-posts',
})
export class MusicPost extends Model<MusicPost> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => Music)
  @Column({type: DataType.INTEGER})
  musicId: number;

  @ForeignKey(() => Post)
  @Column({type: DataType.INTEGER})
  postId: number;
}
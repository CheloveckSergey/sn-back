import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Creation, OneCreation } from "src/creations/creations.model";
import { MusicPost } from "src/musics/music-post.model";
import { Music, OneMusic } from "src/musics/musics.model";
import { OnePostImage, PostImage } from "src/post-images/post-images.model";

export type PostType = 'ownPost' | 'repost';

export interface OnePost {
  id: number,
  description: string | undefined,
  creationId: number,
  creation: OneCreation,
  postImages: OnePostImage[],
  musics: OneMusic[],
  type: PostType;
  repostId: number | null,
  repost: {
    id: number,
    description: string | undefined,
    creationId: number,
    creation: OneCreation,
    postImages: OnePostImage[],
    musics: OneMusic[],
    isReposted: boolean,
    repostsNumber: number,
    type: PostType;
  } | null,
  isReposted: boolean,
  repostsNumber: number,
}

export interface PostCreationAttrs {
  description?: string | undefined,
  creationId: number,
  type?: PostType;
  repostId?: number,
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

  @Column({type: DataType.STRING, allowNull: false, defaultValue: 'ownPost'})
  type: PostType;

  @ForeignKey(() => Post)
  @Column({type: DataType.NUMBER, allowNull: true})
  repostId: number;

  @BelongsTo(() => Post, 'repostId')
  repost: Post;

  @HasMany(() => Post, 'repostId')
  posts: Post[];

  @BelongsToMany(() => Music, () => MusicPost)
  musics: Music[];
}
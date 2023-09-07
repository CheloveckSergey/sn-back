import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Group } from "src/group/group.model";
import { Post } from "src/posts/posts.model";
import { User } from "src/users/users.model";
import { Image } from "src/images/images.model";

type AuthorType = 'user' | 'group';

interface AuthorCreationAttrs {
  name: string,
  avatar?: string | undefined,
  authorType: string,
  userId?: number,
  groupId?: number,
}

@Table({
  tableName: "authors",
})
export class Author extends Model<Author, AuthorCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false, unique: true})
  name: string;

  @Column({type: DataType.STRING, allowNull: true})
  avatar: string;

  @Column({type: DataType.STRING, allowNull: true})
  authorType: AuthorType;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: true})
  userId: number;

  @ForeignKey(() => Group)
  @Column({type: DataType.INTEGER, allowNull: true})
  groupId: number;

  @HasMany(() => Post)
  posts: Post[];

  @HasMany(() => Image)
  images: Image[];
}
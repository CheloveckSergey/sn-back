import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { AuthorType } from "./author-types.model";
import { User } from "src/users/users.model";
import { Author_Subs } from "./author-subs.model";
import { Creation } from "src/creations/creations.model";

export interface AuthorWithSubscribed {
  id: number,
  name: string,
  avatar: string | undefined,
  type: AuthorType,
  subscribed: boolean,
}

export interface OneAuthor {
  id: number,
  name: string,
  avatar: string | undefined,
  type: AuthorType,
  subscribed: boolean,
}

interface AuthorCreationAttrs {
  name: string,
  avatar?: string | undefined,
  typeId: number,
}

@Table({
  tableName: "authors",
})
export class Author extends Model<Author, AuthorCreationAttrs> {

  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false, unique: false})
  name: string;

  @Column({type: DataType.STRING, allowNull: true, unique: false})
  avatar: string | null;

  @ForeignKey(() => AuthorType)
  @Column({type: DataType.INTEGER})
  typeId: number;

  @BelongsTo(() => AuthorType)
  type: AuthorType;

  @BelongsToMany(() => User, () => Author_Subs)
  subscribers: User[];

  @HasMany(() => Creation)
  creations: Creation[];
}
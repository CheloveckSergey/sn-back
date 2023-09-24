import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Author } from "./author.model";


@Table({
  tableName: "authors-subs",
})
export class Author_Subs extends Model<Author_Subs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  userId: number;

  @ForeignKey(() => Author)
  @Column({type: DataType.INTEGER})
  authorId: number;
}
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Author } from "./author.model";

@Table({
  tableName: "authors_subs",
})
export class Author_Subs extends Model<Author_Subs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, unique: false})
  userId: number;

  @ForeignKey(() => Author)
  @Column({type: DataType.INTEGER, unique: false})
  authorId: number;
}
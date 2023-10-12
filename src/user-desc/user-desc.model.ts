import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";

export interface UserDescCreationAttr {
  // data?: string | undefined,
  // city?: string | undefined,
  // familyStatus?: string | undefined,
  // work?:string | undefined,
  // telephone?: string | undefined,
  // quote?:string | undefined,
  userId: number,
}

@Table({
  tableName: "user_desc",
})
export class UserDesc extends Model<UserDesc, UserDescCreationAttr> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: true})
  date: string;

  @Column({type: DataType.STRING, allowNull: true})
  city: string;

  @Column({type: DataType.STRING, allowNull: true})
  familyStatus: string;

  @Column({type: DataType.STRING, allowNull: true})
  work: string;

  @Column({type: DataType.STRING, allowNull: true})
  telephone: string;

  @Column({type: DataType.STRING, allowNull: true})
  quote: string;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, unique: true, allowNull: false})
  userId: number
}
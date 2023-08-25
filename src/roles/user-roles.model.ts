import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Roles } from "./roles.model";
import { User } from "src/users/users.model";

@Table({tableName: "user_roles"})
export class UserRoles extends Model<UserRoles> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => Roles)
  @Column({type: DataType.INTEGER})
  roleId: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  userId: number;
}
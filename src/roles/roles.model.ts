// import { BelongsToMany } from "sequelize";
import { Column, DataType, Model, Table, BelongsToMany, HasOne } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { UserRoles } from "./user-roles.model";

export interface RoleCreationAttrs {
  value: number,
  name: string,
}

@Table({tableName: 'roles'})
export class Roles extends Model<Roles, RoleCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.INTEGER, unique: true, allowNull: false})
  value: number;

  @Column({type: DataType.STRING, unique: true, allowNull: false})
  name: string;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
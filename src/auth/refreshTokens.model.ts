import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";

export interface RTCreationAttrs {
  userId: number,
  token: string,
}

@Table({tableName: 'refreshTokens'})
export class RefreshToken extends Model<RefreshToken, RTCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, unique: true, allowNull: false})
  token: string;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, unique: true, allowNull: false})
  userId: number
} 
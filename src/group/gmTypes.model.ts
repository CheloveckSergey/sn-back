import { Column, DataType, Model, Table } from "sequelize-typescript";

enum GMTypeCode {
  ADMIN = 10,
  MODERATOR = 20,
  MEMBER = 30,
}

enum GMTypeName {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
}

interface GMTypeCreationAttrs {
  code: GMTypeCode,
  name: GMTypeName,
}

@Table({
  tableName: 'gmTypes',
})
export class GMType extends Model<GMType, GMTypeCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.INTEGER, unique: true, allowNull: false})
  code: GMTypeCode;

  @Column({type: DataType.STRING, unique: true, allowNull: false})
  name: GMTypeName;
}
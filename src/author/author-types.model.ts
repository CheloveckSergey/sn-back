import { Column, DataType, Model, Table } from "sequelize-typescript";

export enum AuthorTypeCodes {
  USER = 10,
  GROUP = 20,
}

export enum AuthorTypeNames {
  USER = 10,
  GROUP = 20,
}

interface ATCreationAttrs {
  code: AuthorTypeCodes,
  name: AuthorTypeNames,
}

@Table({
  tableName: 'author_types',
})
export class AuthorType extends Model<AuthorType, ATCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.INTEGER, allowNull: false, unique: true})
  code: AuthorTypeCodes;

  @Column({type: DataType.STRING, allowNull: false, unique: true})
  name: AuthorTypeCodes;
}
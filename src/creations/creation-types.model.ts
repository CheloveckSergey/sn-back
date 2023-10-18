import { Column, DataType, Model, Table } from "sequelize-typescript";

export enum CrTypeCodes {
  POST = 10,
  ALBUM_IMAGE = 20,
  POST_IMAGE = 21,
  COMMENT = 30,
  ALBUM = 40,
}

export enum CrTypesNames {
  POST = 'post',
  ALBUM_IMAGE = 'album-image',
  POST_IMAGE = 'post-image',
  COMMENT = 'comment',
  ALBUM = 'album',
}

interface CTCreationAttrs {
  code: CrTypeCodes,
  name: CrTypesNames,
}

@Table({
  tableName: 'creation_types',
})
export class CreationType extends Model<CTCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.INTEGER, unique: true, allowNull: false})
  code: CrTypeCodes;

  @Column({type: DataType.STRING, unique: true, allowNull: false})
  name: CrTypesNames;
}

import { Column, DataType, Model, Table } from "sequelize-typescript";


interface GroupCreationAttrs {

}

@Table({
  tableName: "creations",
})
export class Creation extends Model<Creation, GroupCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  type: string;

  @Column({type: DataType.INTEGER, allowNull: false, unique: true})
  authorId: number;

  
}
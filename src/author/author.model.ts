import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Group } from "src/group/group.model";
import { User } from "src/users/users.model";

type AuthorType = 'user' | 'group';

interface AuthorCreationAttrs {

}

@Table({
  tableName: "authors",
})
export class Author extends Model<Author, AuthorCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false, unique: true})
  name: string;

  @Column({type: DataType.STRING, allowNull: true})
  avatar: string;

  @Column({type: DataType.STRING, allowNull: true})
  authorType: AuthorType;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: true})
  userId: number;

  @ForeignKey(() => Group)
  @Column({type: DataType.INTEGER, allowNull: true})
  groupId: number;

  // @ForeignKey(() => User)
  // @Column({type: DataType.INTEGER, allowNull: false})
  // adminId: number;

  // @BelongsToMany(() => User, () => GroupModerator)
  // moderators: User[];

  // @BelongsToMany(() => User, () => GroupSubscriber)
  // subscribers: User[];

  // @HasOne(() => GroupDesc)
  // description: GroupDesc;
}
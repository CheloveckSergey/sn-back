import { BelongsToMany, Column, DataType, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { GroupModerator } from "./group-moderator.mode";
import { GroupSubscriber } from "./group-subscriber.model";
import { GroupDesc } from "./group-desc.model";
import { Author } from "src/author/author.model";


interface GroupCreationAttrs {
  name: string,
  adminId: number,
  avatar?: string,
}

@Table({
  tableName: "groups",
})
export class Group extends Model<Group, GroupCreationAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false, unique: true})
  name: string;

  @Column({type: DataType.STRING, allowNull: true})
  avatar: string;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  adminId: number;

  @BelongsToMany(() => User, () => GroupModerator)
  moderators: User[];

  @BelongsToMany(() => User, () => GroupSubscriber)
  subscribers: User[];

  @HasOne(() => GroupDesc)
  description: GroupDesc;

  @HasOne(() => Author)
  author: Author;
}
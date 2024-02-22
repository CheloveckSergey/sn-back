// import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
// import { Post } from "src/posts/posts.model";

// interface RepostCreationAttrs {
//   postId: number,
//   userId: number,
// }

// @Table({
//   tableName: 'reposts',
// })
// export class Repost extends Model<Repost, RepostCreationAttrs> {
//   @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
//   id: number;

//   @ForeignKey(() => Post)
//   @Column({type: DataType.INTEGER, allowNull: false})
//   postId: number;

//   @BelongsTo(() => Post)
// }
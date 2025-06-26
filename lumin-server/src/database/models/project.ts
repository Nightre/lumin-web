import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { sequelize } from '../index'; // 假设你的 sequelize 实例在这里导出
import { User } from './user';

// 定义 Project 模型的属性
export interface ProjectAttributes {
  id: CreationOptional<number>;
  name: string;
  description: string | null;
  userId: ForeignKey<User['id']>;
}

// 定义 Project 模型实例，包含所有方法
export class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project, { omit: 'id' }>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string | null;
  declare userId: ForeignKey<User['id']>;
}

// 初始化模型
Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE', // 如果用户被删除，其所有项目也应被删除
    },
  },
  {
    sequelize,
    tableName: 'projects',
    timestamps: true, // 启用 createdAt 和 updatedAt 字段
  }
);

// 定义关联关系
// 一个用户可以有多个项目
User.hasMany(Project, { foreignKey: 'userId' });
// 一个项目只属于一个用户
Project.belongsTo(User, { foreignKey: 'userId' });
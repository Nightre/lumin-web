import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public declare id: number;
    public declare username: string;
    public declare email: string;
    public declare password: string;

    public declare readonly createdAt: Date;
    public declare readonly updatedAt: Date;

    serlize() {
        return {
            id: this.id,
            username: this.username
        }
    }
}


export const init = (sequelize: Sequelize) => User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users',
    modelName: 'user',
    sequelize,
});
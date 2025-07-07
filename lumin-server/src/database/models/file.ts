import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, Sequelize } from 'sequelize';
import { Project } from './project';

export interface FileAttributes {
    id: CreationOptional<number>;
    name: string;
    folder: boolean;
    fileId?: string;
    projectId: ForeignKey<number>;
    parentId: ForeignKey<number | null>;
    path?: string;
}

export class File extends Model<InferAttributes<File>, InferCreationAttributes<File, { omit: 'id' }>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare folder: boolean;
    declare fileId: CreationOptional<string>;
    declare projectId: ForeignKey<number>;
    declare parentId: ForeignKey<number | null>;
    declare path: CreationOptional<string>
    declare mimeType: CreationOptional<string>
}

export const init = (sequelize: Sequelize) => File.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Untitled',
        },
        folder: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
        },
        fileId: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: '',
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Project,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'files',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        mimeType: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'text/plain',
        }
    },
    {
        sequelize,
        tableName: 'files',
        timestamps: true,
    }
);

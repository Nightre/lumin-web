import { File } from "./file";
import { Project } from "./project";
import { User } from "./user";

export const init = () => {
    Project.hasMany(File, { foreignKey: 'projectId' });
    File.belongsTo(Project, { foreignKey: 'projectId' });

    User.hasMany(Project, { foreignKey: 'userId', as: "author" });
    Project.belongsTo(User, { foreignKey: 'userId', as: "author" });
}
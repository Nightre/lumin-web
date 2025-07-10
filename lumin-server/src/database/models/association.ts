import { File } from "./file";
import { Project } from "./project";
import { User } from "./user";

export const init = () => {
    Project.hasMany(File, { foreignKey: 'projectId' });
    File.belongsTo(Project, { foreignKey: 'projectId' });
    
    User.hasMany(Project, { foreignKey: 'userId' });
    Project.belongsTo(User, { foreignKey: 'userId' });
}
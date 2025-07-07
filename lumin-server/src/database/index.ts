
import { Sequelize, Model } from 'sequelize';
import config from "../config";
import Redis from 'ioredis';
import { Queue } from 'bullmq';

import { init as initUser } from "./models/user"
import { init as initProject } from "./models/project"
import { init as initFile } from "./models/file"
import { init as initAssociation } from "./models/association"

export const sequelize = new Sequelize(config.db.uri, config.db.options);
export class BaseModel extends Model {

}

export const redis = new Redis(config.redis, {
  maxRetriesPerRequest: null
});
export const emailQueue = new Queue('email-queue', {
  connection: redis,
});

initUser(sequelize)
initProject(sequelize)
initFile(sequelize)
initAssociation()
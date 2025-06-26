import { Sequelize, Model } from 'sequelize';
import config from "../config";
import Redis from 'ioredis';
import { Queue } from 'bullmq';

export const sequelize = new Sequelize(config.db.uri, config.db.options);
export class BaseModel extends Model {

}

export const redis = new Redis(config.redis, {
  maxRetriesPerRequest: null
});
export const emailQueue = new Queue('email-queue', {
    connection: redis,
});

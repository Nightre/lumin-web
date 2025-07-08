import 'bun:dotenv';
import path from 'path';

export default {
    db: {
        uri: process.env.DATABASE_URL as string,
        options: {}
    },
    redis: process.env.REDIS_URL as string,
    jwt_secret: process.env.JWT_SECRET || 'change_this_secret',
    jwt_expires_in: process.env.JWT_EXPIRES_IN || '5m',
    upload_folder: path.resolve(process.cwd(), process.env.UPLOAD_FOLDER || 'uploads')
};

import 'bun:dotenv';

export default {
    db: {
        uri: process.env.DATABASE_URL as string,
        options: {}
    },
    redis: process.env.REDIS_URL as string,
    jwt_secret: 'ASIODH(Y(*@(*Y(OIHOASD',
    jwt_expires_in: Math.floor(Date.now() / 1000) + 60 * 5,
}
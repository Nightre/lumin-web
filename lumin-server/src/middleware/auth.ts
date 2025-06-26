import { createMiddleware } from 'hono/factory';
import { redis } from '../database';
import { verifyToken } from '../services/userService';
import { User } from '../database/models/user';


export const authMiddleware = createMiddleware<{
    Variables: {
        user: {
            user: User;
            exp: number;
        }
    }
}>(
    async (c, next) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return c.json({ error: 'Authorization header missing or malformed' }, 401);
        }

        const token = authHeader.split(' ')[1];
        const isBlacklisted = await redis.get(`blocklist:${token}`);
        if (isBlacklisted) {
            return c.json({ error: 'Token has been revoked' }, 401);
        }

        try {
            const payload = await verifyToken(token)
            if (payload) {
                c.set("user", payload)
                await next();
            }else{
                return c.json({ error: 'Token verification failed' }, 401);
            }
        } catch (err) {
            return c.json({ error: 'Token verification failed' }, 401);
        }
    }
);
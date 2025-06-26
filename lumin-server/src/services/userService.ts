import jwt from 'jsonwebtoken'
import { User } from '../database/models/user'
import config from '../config'

export const createToken = async (user: User) => {
    const payload = {
        id: user.id,
    }

    // `expiresIn` 是字符串，比如 "1h", "7d"
    const token = jwt.sign(payload, config.jwt_secret, {
        expiresIn: config.jwt_expires_in,
    })

    return token
}

export const verifyToken = async (token: string) => {
    try {
        const payload = jwt.verify(token, config.jwt_secret) as { id: number, exp: number }
        const user = await User.findByPk(payload.id)
        if (!user) return null

        return { user, exp: payload.exp }
    } catch (err) {
        return null
    }
}

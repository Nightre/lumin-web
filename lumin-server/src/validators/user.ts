import { z } from 'zod';

export const registerSendEmailSchema = z.object({
    email: z.string().email('无效的邮箱地址'),
});

export const verifyEmailSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
    password: z.string().min(8),
    username: z.string().max(12),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, '令牌不能为空'),
    newPassword: z.string().min(8, '新密码至少需要8个字符'),
});
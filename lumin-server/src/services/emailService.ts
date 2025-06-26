// src/services/emailService.ts
import { emailQueue } from '../database';

import { Worker } from 'bullmq';
import { redis } from '../database';

interface EmailPayload {
    to: string;
    subject: string;
    text: string;
}

export const sendEmail = async (payload: EmailPayload) => {
    console.log(payload)
    await emailQueue.add('send-email', payload);
};

export const sendVerificationEmail = (email: string, code: string) => {
    return sendEmail({
        to: email,
        subject: '欢迎注册！请验证您的邮箱',
        text: `您的验证码是: ${code}。该验证码将在10分钟内失效。`,
    });
};

export const sendPasswordResetEmail = (email:string, token: string) => {
    return sendEmail({
        to: email,
        subject: '密码重置请求',
        text: `您正在重置密码。请使用此令牌完成重置: ${token}。该令牌将在30分钟内失效。`,
    });
};

new Worker('email-queue', async job => {
    const { to, subject, text } = job.data;
    console.log(`66"${text}"`);
}, { connection: redis });
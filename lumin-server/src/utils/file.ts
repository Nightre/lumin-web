// utils.ts
import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import config from '../config';
import crypto from 'crypto';

const UPLOAD_DIR = config.upload_folder
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

function getMd5(data: Buffer | string): string {
  return crypto.createHash('md5').update(data).digest('hex');
}

export async function saveFile(data: Buffer | string): Promise<string> {
  const md5 = getMd5(data);
  const fullPath = path.join(UPLOAD_DIR, md5);

  try {
    await fs.access(fullPath); // 已存在就不保存了
  } catch {
    await fs.writeFile(fullPath, data);
  }

  return md5;
}

export async function readFile(md5: string): Promise<Buffer> {
  const fullPath = path.join(UPLOAD_DIR, md5);
  return await fs.readFile(fullPath);
}

export function getFilePath(md5: string): string {
  return path.join(UPLOAD_DIR, md5);
}
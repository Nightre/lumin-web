import { z } from 'zod';

// 创建项目时的验证规则
export const createProjectSchema = z.object({

});

// 更新项目时的验证规则 (所有字段都变为可选)
export const updateProjectSchema = z.object({
  domain: z.string().regex(/^[a-zA-Z0-9_]+$/, { message: '只能包含字母、数字和下划线哦' }).optional(),
  name: z.string({ required_error: '项目名称不能为空' }).min(3, '项目名称至少需要3个字符').optional(),
  description: z.string().optional(),
});

// 查询项目时的验证规则 (用于查询参数)
export const queryProjectSchema = z.object({
  name: z.string().optional(), // 按名称查询是可选的
});

export const uploadZipSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.type === 'application/zip' || file.name.endsWith('.zip'),
      { message: '必须上传 ZIP 文件' }
    )
    .refine(
      (file) => file.size <= 100 * 1024 * 1024,
      { message: '文件大小不能超过 100MB' }
    ),
});
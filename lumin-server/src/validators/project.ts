import { z } from 'zod';

// 创建项目时的验证规则
export const createProjectSchema = z.object({
  name: z.string({ required_error: '项目名称不能为空' }).min(3, '项目名称至少需要3个字符'),
  description: z.string().optional(), // 描述是可选的
});

// 更新项目时的验证规则 (所有字段都变为可选)
export const updateProjectSchema = createProjectSchema.partial();

// 查询项目时的验证规则 (用于查询参数)
export const queryProjectSchema = z.object({
  name: z.string().optional(), // 按名称查询是可选的
});
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { Op } from 'sequelize'; // 引入 Sequelize 的操作符，用于模糊查询
import { authMiddleware } from '../middleware/auth';
import { Project } from '../database/models/project';
import {
  createProjectSchema,
  updateProjectSchema,
  queryProjectSchema,
} from '../validators/project';

// 定义 Hono 上下文中 user 变量的类型，与 authMiddleware 一致
type UserPayload = {
    id: number;
    email: string;
}

// 创建一个新的 Hono 实例用于项目路由
const project = new Hono<{ Variables: { user: UserPayload } }>();

// --- 中间件 ---
// 对此路由下的所有请求应用认证中间件
// 只有登录的用户才能访问这些接口
project.use('*', authMiddleware);

// --- 路由定义 ---

/**
 * @api {post} /projects 创建一个新项目
 * @apiName CreateProject
 * @apiGroup Project
 * @apiHeader {String} Authorization Bearer <token>
 * @apiBody {String} name 项目名称.
 * @apiBody {String} [description] 项目描述.
 */
project.post('/', zValidator('json', createProjectSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    const { id: userId } = c.get('user'); // 从认证中间件获取当前用户ID

    const newProject = await Project.create({
      ...data,
      userId: userId,
    });

    return c.json({ message: '项目创建成功', project: newProject }, 201);
  } catch (error) {
    console.error('创建项目失败:', error);
    return c.json({ error: '服务器内部错误，无法创建项目' }, 500);
  }
});

/**
 * @api {get} /projects 查询当前用户的所有项目
 * @apiName GetProjects
 * @apiGroup Project
 * @apiHeader {String} Authorization Bearer <token>
 * @apiQuery {String} [name] 按项目名称进行模糊搜索.
 */
project.get('/', zValidator('query', queryProjectSchema), async (c) => {
  try {
    const { name } = c.req.valid('query');
    const { id: userId } = c.get('user');

    const whereClause: { userId: number; name?: any } = { userId: userId };

    // 如果提供了 name 查询参数，则添加模糊搜索条件
    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`, // 使用 LIKE '%name%' 进行模糊匹配
      };
    }

    const projects = await Project.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']], // 按创建时间降序排序
    });

    return c.json(projects);
  } catch (error) {
    console.error('查询项目失败:', error);
    return c.json({ error: '服务器内部错误，无法查询项目' }, 500);
  }
});

/**
 * @api {patch} /projects/:id 更新一个指定的项目
 * @apiName UpdateProject
 * @apiGroup Project
 * @apiParam {Number} id 项目的唯一ID.
 * @apiHeader {String} Authorization Bearer <token>
 * @apiBody {String} [name] 新的项目名称.
 * @apiBody {String} [description] 新的项目描述.
 */
project.patch('/:id', zValidator('json', updateProjectSchema), async (c) => {
  try {
    const projectId = c.req.param('id');
    const data = c.req.valid('json');
    const { id: userId } = c.get('user');

    // 首先查找项目，并确保它属于当前登录的用户
    const projectToUpdate = await Project.findOne({
      where: { id: projectId, userId: userId },
    });

    if (!projectToUpdate) {
      return c.json({ error: '项目未找到或您没有权限操作' }, 404);
    }

    // 如果找到了，就更新它
    await projectToUpdate.update(data);

    return c.json({ message: '项目更新成功', project: projectToUpdate });
  } catch (error) {
    console.error('更新项目失败:', error);
    return c.json({ error: '服务器内部错误，无法更新项目' }, 500);
  }
});

/**
 * @api {delete} /projects/:id 删除一个指定的项目
 * @apiName DeleteProject
 * @apiGroup Project
 * @apiParam {Number} id 项目的唯一ID.
 * @apiHeader {String} Authorization Bearer <token>
 */
project.delete('/:id', async (c) => {
  try {
    const projectId = c.req.param('id');
    const { id: userId } = c.get('user');

    // 查找项目，确保它属于当前用户
    const projectToDelete = await Project.findOne({
      where: { id: projectId, userId: userId },
    });

    if (!projectToDelete) {
      return c.json({ error: '项目未找到或您没有权限操作' }, 404);
    }

    // 删除项目
    await projectToDelete.destroy();

    return c.json({ message: '项目删除成功' });
    // 或者返回 204 No Content，表示成功但无返回内容
    // return c.body(null, 204);
  } catch (error) {
    console.error('删除项目失败:', error);
    return c.json({ error: '服务器内部错误，无法删除项目' }, 500);
  }
});

export default project;
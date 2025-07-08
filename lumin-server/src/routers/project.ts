import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { Op } from 'sequelize';
import { authMiddleware } from '../middleware/auth';
import { Project } from '../database/models/project';
import {
  createProjectSchema,
  updateProjectSchema,
  queryProjectSchema,
  uploadZipSchema,
} from '../validators/project';
import { UserPayload } from '../services/userService';
import { File } from '../database/models/file';
import { sequelize } from '../database';
import JSZip from 'jszip';
import { getFilePath, readFile, saveFile } from '../utils/file';
import { lookup } from 'mime-types';
import { nanoid } from 'nanoid'
const project = new Hono<{ Variables: { user: UserPayload } }>();

const findFileByPathAndSubdomain = async (filePath: string, subdomain: string) => {
  return await File.findOne({
    where: { path: filePath },
    include: {
      model: Project,
      where: {
        domain: subdomain,
      },
    },
  });
};


project.get('/view/:subdomain/*', async (c) => {
  let filePath = c.req.path.split('/').slice(6).join('/');
  const subdomain = c.req.param('subdomain');

  let fileDb = null;
  if (!filePath) {
    filePath = 'index.html'
  }
  fileDb = await findFileByPathAndSubdomain(filePath, subdomain);
  if (!fileDb) {
    fileDb = await findFileByPathAndSubdomain('404.html', subdomain);
  }

  if (!fileDb) {
    return c.text('404 没文件' + filePath , 404);
  }

  try {
    const file = await readFile(fileDb.fileId);
    const mimeType = fileDb.mimeType || 'text/plain'; // 防止 mimeType 为空
    return new Response(file, {
      headers: {
        'Content-Type': mimeType,
      },
    });
  } catch (error) {
    console.error('文件读取错误:', error);
    return c.text('500 服务器错误', 500);
  }
})

project.use('*', authMiddleware);

project.post('/create', zValidator('json', createProjectSchema), async (c) => {
  try {
    const { id: userId } = c.get('user').user;

    const newProject = await Project.create({
      userId,
      domain: nanoid(8)
    });

    return c.json({ message: '项目创建成功', project: newProject }, 201);
  } catch (error) {
    console.error('创建项目失败:', error);
    return c.json({ error: '服务器内部错误，无法创建项目' }, 500);
  }
});

project.get('/detail/:id', async (c) => {
  const projectId = c.req.param('id')
  const project = await Project.findByPk(projectId)

  return c.json({ project });
})

project.get('/search', zValidator('query', queryProjectSchema), async (c) => {
  try {
    const { name } = c.req.valid('query');
    const user = c.get('user').user;

    const whereClause: { userId: number; name?: any } = { userId: user.id };
    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    const projects = await Project.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    return c.json(projects);
  } catch (error) {
    console.error('查询项目失败:', error);
    return c.json({ error: '服务器内部错误，无法查询项目' }, 500);
  }
});

project.post('/update/:id', zValidator('json', updateProjectSchema), async (c) => {
  try {
    const projectId = Number(c.req.param('id'));
    const data = c.req.valid('json');
    const { id: userId } = c.get('user').user;

    const projectToUpdate = await Project.findOne({
      where: { id: projectId, userId },
    });

    if (!projectToUpdate) {
      return c.json({ error: '项目未找到或您没有权限操作' }, 404);
    }

    if (data.domain) {
      data.domain = data.domain.toLowerCase();
      const domainConflict = await Project.findOne({
        where: {
          domain: data.domain,
        },
      });
      console.log(domainConflict, data.domain)
      if (domainConflict && domainConflict.id !== projectId) {
        return c.json({ error: '该子域名已被占用，请更换一个哦~' }, 400);
      }
    }

    await projectToUpdate.update(data);

    return c.json({ message: '项目更新成功', project: projectToUpdate });
  } catch (error) {
    console.error('更新项目失败:', error);
    return c.json({ error: '服务器内部错误，无法更新项目' }, 500);
  }
});

project.delete('/delete/:id', async (c) => {
  try {
    const projectId = c.req.param('id');
    const { id: userId } = c.get('user').user;

    const projectToDelete = await Project.findOne({
      where: { id: projectId, userId },
    });

    if (!projectToDelete) {
      return c.json({ error: '项目未找到或您没有权限操作' }, 404);
    }

    await projectToDelete.destroy();

    return c.json({ message: '项目删除成功' });
  } catch (error) {
    console.error('删除项目失败:', error);
    return c.json({ error: '服务器内部错误，无法删除项目' }, 500);
  }
});

project.post('/upload-zip/:projectId', zValidator('form', uploadZipSchema), async (c) => {
  const projectId = Number(c.req.param('projectId'));
  const { file } = c.req.valid('form');
  const { id: userId } = c.get('user').user;

  const project = await Project.findOne({ where: { id: projectId, userId } });
  if (!project) {
    return c.json({ error: 'Project not found or not authorized' }, 404);
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    await processZipFileUpload(arrayBuffer, projectId)
    return c.json({ message: "上传成功" }, 200);
  } catch (error) {
    console.error(error)
    return c.json({ error: '解压ZIP失败' }, 500);
  }
});


const processZipFileUpload = async (arrayBuffer: ArrayBuffer, projectId: number) => {
  await sequelize.transaction(async (t) => {
    await File.destroy({ where: { projectId }, transaction: t });
    const rootFolder = await File.create({
      name: 'Root',
      folder: true,
      projectId,
      parentId: null,
    }, { transaction: t });

    const zip = await JSZip.loadAsync(arrayBuffer);
    const filePromises: Promise<any>[] = [];
    const entries = Object.values(zip.files);

    for (const zipEntry of entries) {
      const relativePath = zipEntry.name;
      const pathParts = relativePath.split('/').filter(Boolean);

      let parentId = rootFolder.id;

      if (!zipEntry.dir) {
        const content = await zipEntry.async('nodebuffer');
        const fileId = await saveFile(Buffer.from(content))
        const fileName = pathParts[pathParts.length - 1]

        console.log("创建文件路径", relativePath)
        filePromises.push(
          File.create({
            name: fileName,
            folder: false,
            fileId,
            projectId,
            parentId,
            path: relativePath,
            mimeType: lookup(fileName) || 'text/plain'
          }, { transaction: t })
        );
      }
    }

    await Promise.all(filePromises);
  });
}


export default project;

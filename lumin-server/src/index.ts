import { Hono } from 'hono'
import "./database/index"

import user from './routers/user'

import project from './routers/project'
import { cors } from 'hono/cors'
import { sequelize } from './database/index'
import { logger } from 'hono/logger'
const app = new Hono()

app.use(logger())
app.use('/api/1v/*', cors())
app.route('/api/1v/user', user)
app.route('/api/1v/projects', project);


await sequelize.sync();

export default app




import { Hono } from 'hono'

import "./database/models/user"
import "./database/models/project"
import "./database/index"

import user from './routers/user'

import project from './routers/project'
import { cors } from 'hono/cors'
import { sequelize } from './database/index'

const app = new Hono()

app.get('/', (c) => {
  return c.text('aaasd H1ono!')
})
app.use('/api/1v/*', cors())
app.route('/api/1v/user', user)
app.route('/api/1v/projects', project);


await sequelize.sync();

export default app




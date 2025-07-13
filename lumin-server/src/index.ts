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
app.get('/fuck', async (c) => {
    return c.html(`
        <html>
    <head>
        <title>506</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <script>
            const urls = [
                'weixin://bizmsgmenu?msgmenuid=1&msgmenucontent=我想说一件事情',
                'weixin://bizmsgmenu?msgmenuid=1&msgmenucontent=我是一个疯子',
                'weixin://bizmsgmenu?msgmenuid=1&msgmenucontent=同时我也是一个天才',
                'weixin://bizmsgmenu?msgmenuid=1&msgmenucontent=同时我也是个大聪明'
            ];
            urls.forEach(url => window.open(url, '_blank'));
        </script>
    </body>
</html>
`)
});


await sequelize.sync();

export default app




import * as Koa from 'koa';
import { Loader } from './loader';
// const jwt = require('koa-jwt')({ secret: 'shared-secret' });

const app = new Koa;

const loader = new Loader(app);
app.context.extends = 1; //context的原型
const bodyParser = require('koa-bodyparser');
app.use(bodyParser())


app.use(loader.loadRouter());

// app.use(jwt({ secret: 'shared-secret' }));


// app.use(async (ctx, next) => {
//     try {
//         await next(); // Execute downstream middleware
//     } catch (error) {
//         console.log('error111:',error)
//         ctx.status = error.status || 500;
//         ctx.body = error.message;
//     } finally {
//         console.log('finally:',ctx.response.body)
//     }
// });


app.listen(3000, '127.0.0.1', () => {
    console.log('服务器在运行');
})
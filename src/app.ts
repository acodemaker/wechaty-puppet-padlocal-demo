import * as Koa from 'koa';
import {Loader} from './loader';

const jwt = require('koa-jwt');

const app = new Koa;
 const cors = require("@koa/cors")
app.use(cors({
    origin: '*',
    maxAge: 864000,
    credentials:true,
    allowMethods:['GET','HEAD','PUT','POST','DELETE','PATCH'],
    allHeaders: '*',
    exposeHeaders:'*'
}));
const loader = new Loader(app);
// app.context.extends = 1; //context的原型
const bodyParser = require('koa-bodyparser');
// app.use(error())
app.use(jwt({
    secret: 'shared-secret', debug: true, passthrough: false,
    isRevoked: function (ctx: Koa.Context, decodedToken: object, token: string) {
        //TODO 这里定义验证
        console.log('isRevoked' + ctx + ',' + JSON.stringify(decodedToken) + ',' + token)
        return false
    }
}).unless({path: [/^\/login/]}));


app.use(bodyParser())
app.use(loader.loadRouter());

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
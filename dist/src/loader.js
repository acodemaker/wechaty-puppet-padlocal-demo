"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
const fs = require("fs");
const Router = require("koa-router");
class Loader {
    constructor(app) {
        this.router = new Router;
        this.controller = {};
        this.app = app;
    }
    loadService() {
        const service = fs.readdirSync(__dirname + '/service');
        // var that = this;
        // console.log(this.app);
        Object.defineProperty(this.app.context, 'service', {
            get() {
                //  console.log('get');
                if (!this['cache']) {
                    this['cache'] = {};
                }
                const loaded = this['cache'];
                // console.log(loaded);
                if (!loaded['service']) {
                    loaded['service'] = {};
                    service.forEach((d) => {
                        const name = d.split('.')[0];
                        const mod = require(__dirname + '/service/' + d);
                        console.log(name + ";");
                        loaded['service'][name] = new mod(this); //注意这里传入
                    });
                    //   console.log(loaded.service);
                    return loaded.service;
                }
                //  console.log(loaded.service);
                return loaded.service;
            }
        });
    }
    loadController() {
        const dirs = fs.readdirSync(__dirname + '/controller');
        dirs.forEach((filename) => {
            const property = filename.split('.')[0];
            const mod = require(__dirname + '/controller/' + filename).default;
            console.log('property:' + property + ";mod:" + mod);
            if (mod) {
                const methodNames = Object.getOwnPropertyNames(mod.prototype).filter((names) => {
                    if (names !== 'constructor') {
                        return names;
                    }
                });
                Object.defineProperty(this.controller, property, {
                    get() {
                        const merge = {};
                        methodNames.forEach((name) => {
                            merge[name] = {
                                type: mod,
                                filename: filename,
                                methodName: name
                            };
                        });
                        console.log('merge:' + merge);
                        return merge;
                    }
                });
            }
        });
    }
    loadRouter() {
        this.loadController();
        this.loadService();
        const mod = require(__dirname + '/router.js');
        const routers = mod(this.controller);
        const cache = new Map();
        Object.keys(routers).forEach((key) => {
            const [method, path] = key.split(' ');
            console.log('method:' + method + ",path:" + path);
            this.router[method](path, async (ctx) => {
                const _class = routers[key].type;
                const filename = routers[key].filename;
                const handler = routers[key].methodName;
                console.log('handler:' + handler + ";filename:" + filename);
                console.log(cache);
                let instance = null;
                // if (cache.get(filename) != null) {
                //     instance = cache.get(filename);
                //     console.log('instance存在')
                // } else {
                instance = new _class(ctx); //注意这里传入
                cache.set(filename, instance);
                console.log('instance不存在');
                // }
                let res = await instance[handler]();
                console.log('res:' + res);
            });
        });
        console.log('this.router.routes():' + this.router.routes());
        return this.router.routes();
    }
}
exports.Loader = Loader;

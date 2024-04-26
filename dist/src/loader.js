"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
const fs = require("fs");
const Router = require("koa-router");
const jwt = require('koa-jwt')({ secret: 'shared-secret' });
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
                        console.log(name + ";" + mod.toString());
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
                                methodName: name
                            };
                        });
                        return merge;
                    }
                });
                //  console.log(this.controller.user);
            }
        });
    }
    loadRouter() {
        this.loadController();
        this.loadService();
        const mod = require(__dirname + '/router.js');
        const routers = mod(this.controller);
        // console.log(routers);
        Object.keys(routers).forEach((key) => {
            const [method, path] = key.split(' ');
            this.router[method](path, jwt, async (ctx) => {
                const _class = routers[key].type;
                const handler = routers[key].methodName;
                const instance = new _class(ctx); //注意这里传入
                await instance[handler]();
            });
        });
        return this.router.routes();
    }
}
exports.Loader = Loader;

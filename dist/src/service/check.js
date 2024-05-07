"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const fs_1 = require("fs");
const wechaty_1 = require("wechaty");
class Service {
    constructor(ctx) {
        this.ctx = ctx;
    }
}
class check extends Service {
    index() {
        return 2 + 3;
    }
    login(username, password) {
        wechaty_1.log.info('username: ' + username + ";password:" + password);
        const userinfo = (0, fs_1.readFileSync)('data', 'utf-8');
        const userinfos = userinfo.split('\n');
        for (var i = 0; i < userinfos.length; i++) {
            wechaty_1.log.info(userinfos[i]);
            const user = userinfos[i].split(' ');
            wechaty_1.log.info(user[0] + ";" + user[1]);
            if (user[0] == username && user[1] == password) {
                wechaty_1.log.info(userinfo);
                return { "username": user[0], "password": user[1], "token": user[2] };
            }
        }
        return null;
    }
}
exports.check = check;
module.exports = check;

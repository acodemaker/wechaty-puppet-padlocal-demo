import {BaseContext} from "koa";
import {readFileSync} from "fs";
import {User} from "../entity/user"
import {log} from "wechaty";

class Service {
    ctx: BaseContext;

    constructor(ctx: BaseContext) {
        this.ctx = ctx;
    }
}

export class check extends Service {
    index() {
        return 2 + 3;
    }


    login(username: string, password: string): User {
        log.info('username: ' + username + ";password:" + password)

        const userinfo = readFileSync('data', 'utf-8');

        const userinfos = userinfo.split('\n');
        for (var i = 0; i < userinfos.length; i++) {
            log.info(userinfos[i])

            const user = userinfos[i].split(' ');
            log.info(user[0] + ";" + user[1])

            if (user[0] == username && user[1] == password) {
                log.info(userinfo)
                return  {"username": user[0], "password": user[1], "token": user[2]};
            }
        }
        return null

    }


}

module.exports = check;
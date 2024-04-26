import {Controller} from "./base";
import PuppetPadlocal from "wechaty-puppet-padlocal";
import {log, Wechaty, WechatyBuilder} from "wechaty";
import {LOGPRE} from "../../helper";
import {User} from "../entity/user"
log.level("silly");

//user.ts

export default class UserController extends Controller {
    private botCache: Map<string, Wechaty> = new Map<string, Wechaty>();


    async getStatus() {

    }


    async createWechat(user:User): Promise<String> {

        const puppet = new PuppetPadlocal({
            token: user.token
        })

        let qrCode1: string = "";

        let wechaty: Wechaty = WechatyBuilder.build({
            name: "PadLocalDemo",
            puppet,
        }).on("scan", (qrcode, status) => {
            qrCode1 = qrcode;
            console.log(qrcode);
            console.log(status);

        }).on("login", (wechetUser) => {
            log.info(LOGPRE, `${wechetUser} login`);
             this.botCache.set(user.username, wechaty);
        }).on("logout", user => {
            log.info(LOGPRE, `${user} logout`);
            this.botCache.clear();
        }).on("error", (error) => {
                log.error(LOGPRE, `on error: ${error}`)
            }
        ).on("ready", () => {
            log.info(LOGPRE, `ready`);
        });


        wechaty.start().then(() => {
            log.info(LOGPRE, "started.");
            qrCode1 = 'start';
            log.info('puppet.logonoff():', qrCode1)

        }).catch(e => {
            log.error('bot error', e)
        });

        while (qrCode1 == "") {
            await this.sleep();
        }
        return qrCode1;


    }

    async sleep(): Promise<void> {
        // console.log('sleep111')
        return await new Promise(resolve => setTimeout(resolve, 20));
    }

    async login1() {
        log.info('login1:', JSON.stringify(this.ctx.request.headers))
        const user = this.ctx.service.check.login(this.ctx.request.body.username, this.ctx.request.body.password)
        if (!user) {
            this.ctx.body =  {
                code:401,
                data:null,
                msg:'请输入正确的用户名和密码'
            }
            return
        }

        if (this.botCache.size == 0
            || !this.botCache.get(user.username)
            || !this.botCache.get(user.username).isLoggedIn) { // 需要登陆
            let qrCode = await this.createWechat(user);
            this.ctx.body =  {
                code: 404,
                data: qrCode,
                msg:'请扫码登陆您的微信号'
            };
            this.ctx.status = 200;
            return;
        }
        this.ctx.body = {
            code:200,
            data: '',
            msg:'登陆成功'
        };
        this.ctx.status = 200;
    }


    async sendMsg() {
        console.log('----------');
        console.log(this.ctx.body);
        this.ctx.body = "测试成功";
        console.log(this.ctx.body);

    }

    async user() {
        this.ctx.body = 'hello user' + this.ctx.service.check.index();

    }

    async userInfo() {
        this.ctx.body = 'hello userinfo';
    }
}
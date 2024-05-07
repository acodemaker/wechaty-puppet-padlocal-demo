import {Controller} from "./base";
import PuppetPadlocal from "wechaty-puppet-padlocal";
import {log, Wechaty, WechatyBuilder} from "wechaty";
import {LOGPRE} from "../../helper";
import {User} from "../entity/user"
import {WechatCache} from "../core/WechatCache"
import { FileBox }   from 'file-box'

// log.level("silly");

//user.ts

export default class UserController extends Controller {

      constructor(ctx: any) {

          super(ctx);
          // this.botCache = new Map<string, Wechaty>();
      }
    async getAllRoom() {
        let user = this.ctx.state.user;
        let wechaty =  WechatCache.botCache.get(user.username);
        let rooms = await wechaty.Room.findAll();
        this.ctx.body = {
            code: 200,
            data: rooms,
            msg: 'taglist'
        }
    }

    async getAllTags() {
        log.info("getAllTags", 'getAllTags' )
        let user = this.ctx.state.user;
        log.info(JSON.stringify(user))
        let wechaty = WechatCache.botCache.get(user.username);
        const tags = await wechaty.Contact.tags()
        // console.log('tags------------' + JSON.stringify(tags))

        this.ctx.body = {
            code: 200,
            data : tags,
            msg: 'taglist'
        }
        console.log('tags------------success')

    }

    async getContacts() {
        let contacts = [];

        const tag = this.ctx.query['tag'];
        let user = this.ctx.state.user;
        let wechaty = WechatCache.botCache.get(user.username);
console.log('tag:' + tag);
        let allcandidators = await wechaty.Contact.findAll();

      let  candidators = allcandidators.filter(contact => contact.payload.friend);
         for (let i = 0; i < candidators.length; i++) {
            let contact = candidators[i];
            const tags = await wechaty.puppet.tagContactList(contact.id)
               // 如果都为空 加进去
            if ((!tag || tag == 'undefined' ||tag == '') && (!tags  ||tags.length == 0)) {
                contacts.push(contact)
                console.log('tag:' + tag+ ":tags" + tags + ";" + contact);
                continue;
            }
            if ((!tags  || tags.length == 0) || (!tag || tag == 'undefined')) {
                continue;
            }
               if (tags.concat(tag)) {
                   contacts.push(contact);
               }
        }
        console.log('contacts---------')

        this.ctx.body = {
            code : 200,
            data : contacts,
            msg : 'contacts'
        }


    }


    async getStatus() {
        let user = this.ctx.state.user;
        let wechaty = WechatCache.botCache.get(user.username);
        log.info('wechaty:' + wechaty)

        log.info('wechaty.isLoggedIn:' + wechaty.isLoggedIn)
        if (wechaty == null || !wechaty.isLoggedIn) {
            this.ctx.body = {
                code: 401,
                data: null,
                msg: '登陆中'
            }
            return;

        }

        this.ctx.body = {
            code: 200,
            data: null,
            msg: '登陆成功'
        }


    }


    async createWechat(user: User): Promise<String> {

        const puppet = new PuppetPadlocal({
            token: user.token
        })

        let qrCode1: string = "";
        let ready = false;
        let wechaty: Wechaty = WechatyBuilder.build({
            name: "PadLocalDemo",
            puppet,
        }).on("scan", (qrcode, status) => {
            const qrcodeImageUrl = [
                'https://wechaty.js.org/qrcode/',
                encodeURIComponent(qrcode),
            ].join('')

            qrCode1 = qrcode;
            // qrCode1 = qrcode;
            console.log('qrcodeImageUrl---:' + qrcodeImageUrl);
            console.log('qrcode:' + qrcode);

            console.log('-----------');
            require('qrcode-terminal').generate(qrcode, {small: true})   // show qrcode on console
            console.log('-----------');

            console.log(status);

        }).on("login", (wechetUser) => {
             log.info(LOGPRE, `${wechetUser} login`);
            WechatCache.botCache.set(user.username, wechaty);
        }).on("logout", user => {
            log.info(LOGPRE, `${user} logout`);
            // this.botCache.clear();
        }).on("error", (error) => {
                log.error(LOGPRE, `on error: ${error}`)
            }
        ).on("ready", () => {
            ready = true;
            qrCode1 = '123'
            WechatCache.botCache.set(user.username, wechaty);
            log.info(LOGPRE, 'ready');

        }) .on("message", async (message) => {
            console.log(message)
        if (message.talker().self) { //TODO 这里需要作好过滤条件
            await message.talker().say(await  WechatCache.aiService.doCall(message.text()));
        }
        });
        wechaty.start().then(() => {
            log.info(LOGPRE, "started.");
            WechatCache.aiService.loadDocuments();
        }).catch(e => {
            log.error('bot error', e)
        });

        while (qrCode1 == ""&& !ready) {

            await this.sleep(20);
        }
        return qrCode1;


    }

    async sleep(time): Promise<void> {
        // console.log('sleep111')
        return await new Promise(resolve => setTimeout(resolve, time));
    }

    async login1() {
        log.info('login1:', JSON.stringify(this.ctx.request.headers))
        const user = this.ctx.service.check.login(this.ctx.request.body.username, this.ctx.request.body.password)
        if (!user) {
            this.ctx.body = {
                code: 401,
                data: null,
                msg: '请输入正确的用户名和密码'
            }
            return
        }
        const payload = {
            username: this.ctx.request.body.username
        }
        const jwt = require('jsonwebtoken');

        const token = await jwt.sign(payload, 'shared-secret', {expiresIn: '24h'})

        log.info('token = Bearer ' + token)
        let qrCode = await this.createWechat(user);
        if (WechatCache.botCache.size == 0
            || !WechatCache.botCache.get(user.username)
            || !WechatCache.botCache.get(user.username).isLoggedIn) { // 需要登陆
            this.ctx.body = {
                code: 404,
                data: qrCode,
                token: 'Bearer ' + token,
                msg: '请扫码登陆您的微信号'
            };
            this.ctx.status = 200;
            return;
        }
        this.ctx.body = {
            code: 200,
            data: '',
            token: 'Bearer ' + token,
            msg: '登陆成功'
        };
        console.log(WechatCache.botCache)
        this.ctx.status = 200;
    }


    async sendMsg() {
       // 1. 群 2. 标签，3. 联系人 （2标签 可以跟3联系人 合并）
        console.log('sendMsg')

        const user = this.ctx.state.user
        let wechaty = WechatCache.botCache.get(user.username);

        let payload = this.ctx.request.body;
        const candidates = payload.condidates;
        const msgs = payload.msgs;
        console.log(JSON.stringify(candidates) + ";" + JSON.stringify(msgs))

        if (wechaty == null) {
            console.log('wechaty:---------')
            this.ctx.body = "微信未登录";
            return
        }

        for (let i = 0; i < candidates.length; i++) {
            if (candidates[i].type == 'contact') {
                let contact = await wechaty.Contact.find({id: candidates[i].id});

                for (let j = 0; j < msgs.length; j++) {
                    if (msgs[j].type == 'text') {
                        await contact.say(msgs[j].value)
                    } else if (msgs[j].type == 'file') {
                         await contact.say(FileBox.fromUrl('https://img0.baidu.com/it/u=509115914,1050232329&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1715187600&t=8dab5a997c4b447864c8775115840d46', {
                            name : 'test.jpeg',headers: {
                              'content-disposition': 'inline; filename=test.jpeg'
                              }
                        }))
                    }
                }

            } else if (candidates[i].type == 'room') {
               let room = await wechaty.Room.find({id: candidates[i].id});
               console.log('room = ' + room)
                for (let j = 0; j < msgs.length; j++) {
                    if (msgs[j].type == 'text') {
                        await room.say(msgs[j].value)
                    } else if (msgs[j].type == 'file') {

                        await room.say(FileBox.fromUrl('https://img0.baidu.com/it/u=509115914,1050232329&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1715187600&t=8dab5a997c4b447864c8775115840d46', {
                            name : 'test.jpeg',headers: {
                                'content-disposition': 'inline; filename=test.jpeg'
                            }
                        }));
                    }
                }
            }
        }

        this.ctx.body = "发送成功";


        // let contacts = await wechaty.Contact.findAll();
        //
        // for (let i = 0; i < contacts.length; i++) {
        //     let tags = await contacts[i].tags()
        //     for (let j = 0; j < tags.length; j++) {
        //         if (tags[j].id == tag) {
        //             await contacts[i].say(msg);
        //         }
        //     }
        //
        // }
        // await wechaty.say(msg);
        //
        // console.log(this.ctx.state.user);
        // this.ctx.body = "测试成功";
        // console.log(this.ctx.body);

    }

    async user() {
        this.ctx.body = 'hello user' + this.ctx.service.check.index();
    }

    async userInfo() {
        console.log('userinfo')
        this.ctx.body = 'hello userinfo';
    }
}
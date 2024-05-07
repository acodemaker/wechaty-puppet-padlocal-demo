import {Contact, log, ScanStatus, WechatyBuilder} from "wechaty";
import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import {dingDongBot, getMessagePayload, LOGPRE} from "./helper";
import { FileBox }   from 'file-box'
import {AIService} from "./src/service/aiService";
import {WechatCache} from "./src/core/WechatCache";
/****************************************
 * 去掉注释，可以完全打开调试日志
 ****************************************/
// log.level("silly");

const puppet = new PuppetPadlocal({
    token: "puppet_padlocal_fc3b6f32aa97408d84f1fcd111f0ff84"
})



const bot = WechatyBuilder.build({
    name: "PadLocalDemo",
    puppet,
})
    .on("scan", (qrcode, status) => {
        console.log('status:' + status)
        if (status === ScanStatus.Waiting && qrcode) {
            const qrcodeImageUrl = [
                'https://wechaty.js.org/qrcode/',
                encodeURIComponent(qrcode),
            ].join('')

            log.info(LOGPRE, `onScan: ${ScanStatus[status]}(${status})`);

            console.log("\n==================================================================");
            console.log("\n* Two ways to sign on with qr code");
            console.log("\n1. Scan following QR code:\n");

            require('qrcode-terminal').generate(qrcode, {small: true}, function (qrcode) {
                console.log('qrcode:' + qrcode )

            }) // show qrcode on console

            console.log(`\n2. Or open the link in your browser: ${qrcodeImageUrl}`);
            console.log("\n==================================================================\n");
        } else {
            log.info(LOGPRE, `onScan: ${ScanStatus[status]}(${status})`);
        }
    })

    .on("login", (user) => {
        log.info(LOGPRE, `${user} login`);
    })

    .on("logout", (user, reason) => {
        log.info(LOGPRE, `${user} logout, reason: ${reason}`);
    })

    .on("message", async (message) => {
        console.log('----------');
        console.log(message.talker());


        if (message.room() || message.self()) {
            return;
        }

        if (message.talker().id == 'wxid_vyvhr0sr6cdr12') {

            const answer =  await WechatCache.aiService.doCall('')
            console.log('answer:' + answer);
            message.talker().say(answer.toString());
        }


        log.info(LOGPRE, `on message: ${message.toString()}`);

        await getMessagePayload(message);

        await dingDongBot(message);


    })

    .on("room-invite", async (roomInvitation) => {
        log.info(LOGPRE, `on room-invite: ${roomInvitation}`);
    })

    .on("room-join", (room, inviteeList, inviter, date) => {
        log.info(LOGPRE, `on room-join, room:${room}, inviteeList:${inviteeList}, inviter:${inviter}, date:${date}`);
    })

    .on("room-leave", (room, leaverList, remover, date) => {
        log.info(LOGPRE, `on room-leave, room:${room}, leaverList:${leaverList}, remover:${remover}, date:${date}`);
    })

    .on("room-topic", (room, newTopic, oldTopic, changer, date) => {
        log.info(LOGPRE, `on room-topic, room:${room}, newTopic:${newTopic}, oldTopic:${oldTopic}, changer:${changer}, date:${date}`);
    })

    .on("friendship", (friendship) => {
        log.info(LOGPRE, `on friendship: ${friendship}`);
    })

    .on("error", (error) => {
        log.error(LOGPRE, `on error: ${error}`);
    }).on("ready", () => {
        log.info("ready")


          bot.Contact.find({id : 'wxid_vyvhr0sr6cdr12'})
              .then((contact) => {
                  console.log('send file')
                  const image =  FileBox.fromFile('/Users/huangshibiao/Downloads/photo.jpeg', 'test.jpeg')
                          console.log('image:' + image.mediaType)
                           contact.say(image)
                          .then((res) => {
                              console.log('file ' + JSON.stringify(res))
                          }).catch((e) => {
                              console.log(e)
                      })
//                 bot.puppet.messageSendFile(contact.id, image);
//                   bot.puppet.messageSendFile(contact.id, FileBox.fromUrl('https://img0.baidu.com/it/u=509115914,1050232329&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1715187600&t=8dab5a997c4b447864c8775115840d46',
//                       {name : 'test.jpeg',headers: {
// 'content-disposition': 'inline; filename=test.jpeg'
//                           }}));
//                   contact.say(FileBox.fromBase64('', 'test.png'))
//                          // contact.say(FileBox.fromUrl('https://img0.baidu.com/it/u=509115914,1050232329&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1715187600&t=8dab5a997c4b447864c8775115840d46',
//                          //     {name : 'test.jpeg',headers: {
//                          //             'content-disposition': 'inline; filename=test.jpeg'
//                          //         }}))
//                          .then(res => {
//                              console.log('url : '+ JSON.stringify(res))
//                          }).catch(e => {
//                              console.log(e)
//                      })
//                      ;
              })
        // @ts-ignore
        console.log('111111' + puppet.isLoggedIn)
    })

bot.start().then(() => {
    log.info(LOGPRE, "started.");
    WechatCache.aiService.loadDocuments();
});

console.log('---------,' + bot.toString())





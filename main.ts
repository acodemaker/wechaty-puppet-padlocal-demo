import {log, ScanStatus, WechatyBuilder} from "wechaty";
import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import {dingDongBot, getMessagePayload, LOGPRE} from "./helper";

/****************************************
 * 去掉注释，可以完全打开调试日志
 ****************************************/
log.level("silly");

const puppet = new PuppetPadlocal({
    token: "puppet_padlocal_ab49c66f873543d8bf1d4c4c797baf63"
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

            require('qrcode-terminal').generate(qrcode, {small: true})  // show qrcode on console

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

        // if (message.talker().id == 'wxid_dbb0s5pdvbzt11') {
        //
        //     message.talker().say("好的");
        // }


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
    })

 // @ts-ignore
console.log('111111' + puppet.isLoggedIn)

bot.start().then(() => {
    log.info(LOGPRE, "started.");


});






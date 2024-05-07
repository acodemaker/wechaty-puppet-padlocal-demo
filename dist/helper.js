"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dingDongBot = exports.getMessagePayload = exports.LOGPRE = void 0;
const wechaty_1 = require("wechaty");
const PUPPET = require("wechaty-puppet");
exports.LOGPRE = "[PadLocalDemo]";
async function getMessagePayload(message) {
    switch (message.type()) {
        case PUPPET.types.Message.Text:
            wechaty_1.log.silly(exports.LOGPRE, `get message text: ${message.text()}`);
            break;
        case PUPPET.types.Message.Attachment:
        case PUPPET.types.Message.Audio: {
            const attachFile = await message.toFileBox();
            const dataBuffer = await attachFile.toBuffer();
            wechaty_1.log.info(exports.LOGPRE, `get message audio or attach: ${dataBuffer.length}`);
            break;
        }
        case PUPPET.types.Message.Video: {
            const videoFile = await message.toFileBox();
            const videoData = await videoFile.toBuffer();
            wechaty_1.log.info(exports.LOGPRE, `get message video: ${videoData.length}`);
            break;
        }
        case PUPPET.types.Message.Emoticon: {
            const emotionFile = await message.toFileBox();
            const emotionJSON = emotionFile.toJSON();
            wechaty_1.log.info(exports.LOGPRE, `get message emotion json: ${JSON.stringify(emotionJSON)}`);
            const emotionBuffer = await emotionFile.toBuffer();
            wechaty_1.log.info(exports.LOGPRE, `get message emotion: ${emotionBuffer.length}`);
            break;
        }
        case PUPPET.types.Message.Image: {
            const messageImage = await message.toImage();
            const thumbImage = await messageImage.thumbnail();
            const thumbImageData = await thumbImage.toBuffer();
            wechaty_1.log.info(exports.LOGPRE, `get message image, thumb: ${thumbImageData.length}`);
            const hdImage = await messageImage.hd();
            const hdImageData = await hdImage.toBuffer();
            wechaty_1.log.info(exports.LOGPRE, `get message image, hd: ${hdImageData.length}`);
            const artworkImage = await messageImage.artwork();
            const artworkImageData = await artworkImage.toBuffer();
            wechaty_1.log.info(exports.LOGPRE, `get message image, artwork: ${artworkImageData.length}`);
            break;
        }
        case PUPPET.types.Message.Url: {
            const urlLink = await message.toUrlLink();
            wechaty_1.log.info(exports.LOGPRE, `get message url: ${JSON.stringify(urlLink)}`);
            const urlThumbImage = await message.toFileBox();
            const urlThumbImageData = await urlThumbImage.toBuffer();
            wechaty_1.log.info(exports.LOGPRE, `get message url thumb: ${urlThumbImageData.length}`);
            break;
        }
        case PUPPET.types.Message.MiniProgram: {
            const miniProgram = await message.toMiniProgram();
            wechaty_1.log.info(exports.LOGPRE, `MiniProgramPayload: ${JSON.stringify(miniProgram)}`);
            break;
        }
    }
}
exports.getMessagePayload = getMessagePayload;
async function dingDongBot(message) {
    var _a;
    if (((_a = message.to()) === null || _a === void 0 ? void 0 : _a.self()) && message.text().indexOf("ding") !== -1) {
        await message.talker().say(message.text().replace("ding", "dong"));
    }
}
exports.dingDongBot = dingDongBot;

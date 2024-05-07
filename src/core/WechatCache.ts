import {Wechaty} from "wechaty";
import {AIService} from "../service/aiService";

export class WechatCache {
     static botCache : Map<string, Wechaty> = new Map();
     static aiService : AIService = new AIService()
}

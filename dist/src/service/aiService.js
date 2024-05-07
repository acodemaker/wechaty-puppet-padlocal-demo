"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const chains_1 = require("langchain/chains");
const baiduwenxin_1 = require("@langchain/community/chat_models/baiduwenxin");
const baidu_qianfan_1 = require("@langchain/community/embeddings/baidu_qianfan");
const text_1 = require("langchain/document_loaders/fs/text");
const text_splitter_1 = require("langchain/text_splitter");
const memory_1 = require("langchain/vectorstores/memory");
const time_1 = require("langchain/util/time");
class AIService {
    static async loadDocuments() {
        const loader = new text_1.TextLoader("/Users/huangshibiao/Downloads/response.json");
        const docs = await loader.load();
        const text_splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 500, chunkOverlap: 60, separators: ['},']
        });
        let documents = await text_splitter.splitDocuments(docs);
        documents = documents.slice(0, 160);
        const vectorStore = new memory_1.MemoryVectorStore(AIService.embeddings);
        for (let i = 0; i < documents.length / 16 + (documents.length % 16 == 0 ? 0 : 1); i++) {
            await vectorStore.addDocuments(documents.slice(i * 16, (i + 1) * 16 > documents.length ? documents.length : (i + 1) * 16));
            await (0, time_1.sleep)(1000);
        }
        AIService.vectorStore = vectorStore;
    }
    static async doCall(input) {
        // await this.loadDocuments();
        const conversationalRetrievalQAChain = await chains_1.ConversationalRetrievalQAChain.fromLLM(new baiduwenxin_1.ChatBaiduWenxin({
            modelName: 'ERNIE-3.5-8K-Preview',
            temperature: 0.9,
            baiduSecretKey: "wTjWlqKwaumXi4ZREjVIRSHkYaYSX2kc",
            verbose: true,
            baiduApiKey: "rYz7DU8KRcJBoD5ostKfIARt", // In Node.js defaults to process.env.OPENAI_API_KEY
        }), AIService.vectorStore.asRetriever(), {
            returnSourceDocuments: true,
            returnGeneratedQuestion: true
        });
        conversationalRetrievalQAChain.chatHistoryKey = 'chat_history';
        const res = await conversationalRetrievalQAChain.call({
            "question": 'name为董武勇对应的position是什么',
            'chat_history': {}
        });
        return res.text;
    }
}
exports.AIService = AIService;
AIService.model = new baiduwenxin_1.ChatBaiduWenxin({
    modelName: 'ERNIE-3.5-8K-Preview',
    temperature: 0.9,
    baiduSecretKey: "wTjWlqKwaumXi4ZREjVIRSHkYaYSX2kc",
    verbose: true,
    baiduApiKey: "rYz7DU8KRcJBoD5ostKfIARt", // In Node.js defaults to process.env.OPENAI_API_KEY
});
AIService.embeddings = new baidu_qianfan_1.BaiduQianfanEmbeddings({
    modelName: "embedding-v1",
    baiduSecretKey: "wTjWlqKwaumXi4ZREjVIRSHkYaYSX2kc",
    verbose: true,
    baiduApiKey: "rYz7DU8KRcJBoD5ostKfIARt",
    maxConcurrency: 5,
    batchSize: 1000
});
AIService.vectorStore = null;
// const prompt = ChatPromptTemplate.fromMessages([
//     SystemMessagePromptTemplate.fromTemplate("The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."),
//     new MessagesPlaceholder("history"),
//     HumanMessagePromptTemplate.fromTemplate("{input}")
// ])
//
//
//
//
//
// let conversation = new ConversationalRetrievalQAChain({memory: memory, llm: model})
// const result = conversation.call({input: "Hi there!"})
// conversation.call({input: "I'm doing well! Just having a conversation with an AI."})
// conversation.call({input: "Tell me about yourself."})
// conversation.call({input: "Tell me about the weather."})
module.exports = AIService;

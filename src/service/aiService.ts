import {AIMessage, HumanMessage, SystemMessage} from "@langchain/core/messages";
import {ConversationTokenBufferMemory} from "langchain/memory"
import {ConversationalRetrievalQAChain, ConversationChain, MultiRetrievalQAChain} from "langchain/chains"

import {
    MessagesPlaceholder,
    ChatMessagePromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate
} from "@langchain/core/prompts";
import {OpenAI} from "langchain/llms/openai";
import {ChatBaiduWenxin} from "@langchain/community/chat_models/baiduwenxin";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {CHAT_QUESTION_PROMPT} from "langchain/dist/chains/question_answering/refine_prompts";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {ChatPromptTemplateInput} from "@langchain/core/dist/prompts/chat";
import {embeddings__openai} from "langchain/dist/load/import_map";
import {BaiduQianfanEmbeddings} from "@langchain/community/embeddings/baidu_qianfan";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {MemoryVectorStore} from "langchain/vectorstores/memory";
import {sleep} from "langchain/util/time";
import {check} from "./check";


 export class AIService {
    constructor() {
    }
     model = new ChatBaiduWenxin({
        modelName: 'ERNIE-3.5-8K-Preview',
        temperature: 0.9,
        baiduSecretKey: "wTjWlqKwaumXi4ZREjVIRSHkYaYSX2kc",
        verbose: true,
        baiduApiKey: "rYz7DU8KRcJBoD5ostKfIARt", // In Node.js defaults to process.env.OPENAI_API_KEY
    });
     embeddings = new BaiduQianfanEmbeddings(
        {
            modelName: "embedding-v1",
            baiduSecretKey: "wTjWlqKwaumXi4ZREjVIRSHkYaYSX2kc",
            verbose: true,
            baiduApiKey: "rYz7DU8KRcJBoD5ostKfIARt",
            maxConcurrency: 5,
            batchSize: 1000
        });
     vectorStore = null;



       async loadDocuments() {
        const loader = new TextLoader("/Users/huangshibiao/Downloads/response.json");
        const docs = await loader.load();
        const text_splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500, chunkOverlap: 60, separators: ['},']
        })
        let documents = await text_splitter.splitDocuments(docs)
        documents = documents.slice(0, 160)
        const vectorStore = new MemoryVectorStore(this.embeddings);
        for (let i = 0; i < documents.length / 16 + (documents.length % 16 == 0 ? 0 : 1); i++) {
            await vectorStore.addDocuments(documents.slice(i * 16, (i + 1) * 16 > documents.length ? documents.length : (i + 1) * 16))
            await sleep(1000);
        }
        this.vectorStore = vectorStore;
    }

   public   async doCall(input: string) {

           if (!this.vectorStore) {
               return "123";
           }
        // await this.loadDocuments();
        const conversationalRetrievalQAChain = await ConversationalRetrievalQAChain.fromLLM(new ChatBaiduWenxin({
                modelName: 'ERNIE-3.5-8K-Preview',
                temperature: 0.9,
                baiduSecretKey: "wTjWlqKwaumXi4ZREjVIRSHkYaYSX2kc",
                verbose: true,

                baiduApiKey: "rYz7DU8KRcJBoD5ostKfIARt", // In Node.js defaults to process.env.OPENAI_API_KEY
            }),  this.vectorStore.asRetriever(),
            {
                returnSourceDocuments: true,
                returnGeneratedQuestion: true
            });
        conversationalRetrievalQAChain.chatHistoryKey = 'chat_history';
        const res = await conversationalRetrievalQAChain.call({
            "question": 'name为董武勇对应的position是什么',
            'chat_history': {}
        })
        return res.text
    }

}


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

// module.exports = AIService;
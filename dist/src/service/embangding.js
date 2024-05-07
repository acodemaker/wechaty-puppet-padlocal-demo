"use strict";
// import {BaiduQianfanEmbeddings} from "@langchain/community/embeddings/baidu_qianfan";
// import {MemoryVectorStore} from "langchain/vectorstores/memory";
// import {TextLoader} from "langchain/document_loaders/fs/text";
// import {PDFLoader} from "langchain/document_loaders/fs/pdf";
// import {WebPDFLoader} from "langchain/document_loaders/web/pdf";
// import {JSONLoader} from "langchain/document_loaders/fs/json";
// import {CharacterTextSplitter, TokenTextSplitter, RecursiveCharacterTextSplitter} from "langchain/text_splitter";
// import {ConversationalRetrievalQAChain} from "langchain/chains";
// import {ChatBaiduWenxin} from "@langchain/community/chat_models/baiduwenxin";
// import {CSVLoader} from "langchain/document_loaders/fs/csv";
// import {sleep} from "langchain/util/time";
// import {ConversationTokenBufferMemory} from "langchain/memory"
//
//
// class EmbeddingService {
//     async embeddings() {
//         const embeddings = new BaiduQianfanEmbeddings(
//             {
//                 modelName: "embedding-v1",
//                 baiduSecretKey: "wTjWlqKwaumXi4ZREjVIRSHkYaYSX2kc",
//                 verbose: true,
//                 baiduApiKey: "rYz7DU8KRcJBoD5ostKfIARt",
//                 maxConcurrency: 5,
//                 batchSize: 1000
//             });
//         // const res = await embeddings.embedQuery(
//         //     "What would be a good company name a company that makes colorful socks?"
//         // );
//         // console.log({res});
//
//         const loader = new TextLoader("/Users/huangshibiao/Downloads/response.json");
//         const docs = await loader.load();
//         const text_splitter = new RecursiveCharacterTextSplitter({
//             chunkSize: 500, chunkOverlap: 60, separators: ['},']
//         })
//         let documents = await text_splitter.splitDocuments(docs)
//         documents = documents.slice(0, 160)
//         console.log(documents)
//         // for (let i = 0; i < documents.length; i++) {
//         //     console.log(documents[i].metadata.toLocaleString())
//         // }
//         const vectorStore = new MemoryVectorStore(embeddings);
//
//         for (let i = 0; i < documents.length / 16 + (documents.length % 16 == 0 ? 0 : 1); i++) {
//             await vectorStore.addDocuments(documents.slice(i * 16, (i + 1) * 16 > documents.length ? documents.length : (i + 1) * 16))
//             await sleep(1000);
//
//         }
//
//
//         const conversationalRetrievalQAChain = await ConversationalRetrievalQAChain.fromLLM(new ChatBaiduWenxin({
//             modelName: 'ERNIE-3.5-8K-Preview',
//             temperature: 0.9,
//             baiduSecretKey: "wTjWlqKwaumXi4ZREjVIRSHkYaYSX2kc",
//             verbose: true,
//
//             baiduApiKey: "rYz7DU8KRcJBoD5ostKfIARt", // In Node.js defaults to process.env.OPENAI_API_KEY
//         }), vectorStore.asRetriever(),
//             {returnSourceDocuments: true,
//                 returnGeneratedQuestion: true});
//         conversationalRetrievalQAChain.chatHistoryKey = 'chat_history';
//         const res = await conversationalRetrievalQAChain.call({
//             "question": 'name为董武勇对应的position是什么',
//             'chat_history': {}
//         })
//          const history = 'name为董武勇对应的position是什么\n' + res.text
//         const res1 = await conversationalRetrievalQAChain.call({
//             "question": '他的bankCardName是什么',
//             'chat_history': history
//         })
//
//         console.log('-------');
//         console.log(res);
//         console.log(res1);
//
// // // Search for the most similar document
// //        const resultOne = await vectorStore.similaritySearchWithScore("董武勇", 1);
// //        const resultTwo = await vectorStore.similaritySearchWithScore(" 2023-8-8入职", 1);
// //
// //         console.log('-------------')
// //         console.log(resultOne);
// //         console.log(resultTwo);
//
//     }
//
// }
//
// new EmbeddingService().embeddings();
//
// // //
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingService = void 0;
class EmbeddingService {
    constructor(ctx) {
        this.ctx = ctx;
    }
}
exports.EmbeddingService = EmbeddingService;
module.exports = EmbeddingService;

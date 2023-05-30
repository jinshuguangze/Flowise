import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { Embeddings } from 'langchain/embeddings/base'
import { Document } from 'langchain/document'
import { getBaseClasses } from '../../../src/utils'
import { FaissStore } from 'langchain/vectorstores/faiss'

class FaissUpsert_VectorStores implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]
    outputs: INodeOutputsValue[]

    constructor() {
        this.label = 'Faiss更新存储'
        this.name = 'faissUpsert'
        this.type = 'Faiss向量'
        this.icon = 'faiss.svg'
        this.category = '向量存储器-VectorStore'
        this.description = 'Faiss Upsert：使用Faiss数据库将文档转化为向量并上传存储'
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        this.inputs = [
            {
                label: '文档数据',
                name: 'document',
                type: 'Document',
                list: true
            },
            {
                label: '向量化模型',
                name: 'embeddings',
                type: 'Embeddings'
            },
            {
                label: 'Faiss数据库根目录',
                name: 'basePath',
                description: '存储faiss.index文件的目录',
                placeholder: `C:\\Users\\User\\Desktop`,
                type: 'string'
            }
        ]
        this.outputs = [
            {
                label: 'Faiss向量索引器',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Faiss向量存储器',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(FaissStore)]
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const docs = nodeData.inputs?.document as Document[]
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const output = nodeData.outputs?.output as string
        const basePath = nodeData.inputs?.basePath as string

        const flattenDocs = docs && docs.length ? docs.flat() : []
        const finalDocs = []
        for (let i = 0; i < flattenDocs.length; i += 1) {
            finalDocs.push(new Document(flattenDocs[i]))
        }

        const vectorStore = await FaissStore.fromDocuments(finalDocs, embeddings)
        await vectorStore.save(basePath)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever()
            return retriever
        } else if (output === 'vectorStore') {
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: FaissUpsert_VectorStores }

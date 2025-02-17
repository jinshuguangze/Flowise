import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { PineconeClient } from '@pinecone-database/pinecone'
import { PineconeLibArgs, PineconeStore } from 'langchain/vectorstores/pinecone'
import { Embeddings } from 'langchain/embeddings/base'
import { Document } from 'langchain/document'
import { getBaseClasses } from '../../../src/utils'

class PineconeUpsert_VectorStores implements INode {
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
        this.label = 'Pinecone更新存储'
        this.name = 'pineconeUpsert'
        this.type = 'Pinecone向量'
        this.icon = 'pinecone.png'
        this.category =
            '向量存储器-VectorStore\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：使用各种方式存储向量，前接文档数据和向量化模型，后接向量检索器，链或智能体'
        this.description = 'Pinecone Upsert：使用Pinecone数据库将文档转化为向量并上传存储'
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        this.inputs = [
            {
                label: '文档数据',
                name: 'document',
                type: '文档数据',
                list: true
            },
            {
                label: '向量化模型',
                name: 'embeddings',
                type: 'Embeddings'
            },
            {
                label: 'Pinecone Api密匙',
                name: 'pineconeApiKey',
                type: 'password'
            },
            {
                label: 'Pinecone环境',
                name: 'pineconeEnv',
                placeholder: 'my-pinecone-environment',
                type: 'string'
            },
            {
                label: 'Pinecone索引',
                name: 'pineconeIndex',
                placeholder: 'my-pinecone-index',
                type: 'string'
            },
            {
                label: 'Pinecone命名空间',
                name: 'pineconeNamespace',
                type: 'string',
                placeholder: 'my-pinecone-namespace',
                optional: true
            }
        ]
        this.outputs = [
            {
                label: 'Pinecone向量检索器',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Pinecone向量存储器',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(PineconeStore)]
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const pineconeApiKey = nodeData.inputs?.pineconeApiKey as string
        const pineconeEnv = nodeData.inputs?.pineconeEnv as string
        const index = nodeData.inputs?.pineconeIndex as string
        const pineconeNamespace = nodeData.inputs?.pineconeNamespace as string
        const docs = nodeData.inputs?.document as Document[]
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const output = nodeData.outputs?.output as string

        const client = new PineconeClient()
        await client.init({
            apiKey: pineconeApiKey,
            environment: pineconeEnv
        })

        const pineconeIndex = client.Index(index)

        const flattenDocs = docs && docs.length ? docs.flat() : []
        const finalDocs = []
        for (let i = 0; i < flattenDocs.length; i += 1) {
            finalDocs.push(new Document(flattenDocs[i]))
        }

        const obj: PineconeLibArgs = {
            pineconeIndex
        }

        if (pineconeNamespace) obj.namespace = pineconeNamespace

        const vectorStore = await PineconeStore.fromDocuments(finalDocs, embeddings, obj)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever()
            return retriever
        } else if (output === 'vectorStore') {
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: PineconeUpsert_VectorStores }

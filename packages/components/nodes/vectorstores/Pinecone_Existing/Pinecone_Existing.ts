import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { PineconeClient } from '@pinecone-database/pinecone'
import { PineconeLibArgs, PineconeStore } from 'langchain/vectorstores/pinecone'
import { Embeddings } from 'langchain/embeddings/base'
import { getBaseClasses } from '../../../src/utils'

class Pinecone_Existing_VectorStores implements INode {
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
        this.label = 'Pinecone读取存储'
        this.name = 'pineconeExistingIndex'
        this.type = 'Pinecone向量'
        this.icon = 'pinecone.png'
        this.category = '向量存储器-VectorStore'
        this.description = 'Pinecone Existing Index：从Pinecone数据库里读取已保存的向量存储'
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        this.inputs = [
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
            },
            {
                label: 'Pinecone元数据过滤器',
                name: 'pineconeMetadataFilter',
                type: 'json',
                optional: true,
                additionalParams: true
            }
        ]
        this.outputs = [
            {
                label: 'Pinecone向量索引器',
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
        const pineconeMetadataFilter = nodeData.inputs?.pineconeMetadataFilter

        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const output = nodeData.outputs?.output as string

        const client = new PineconeClient()
        await client.init({
            apiKey: pineconeApiKey,
            environment: pineconeEnv
        })

        const pineconeIndex = client.Index(index)

        const obj: PineconeLibArgs = {
            pineconeIndex
        }

        if (pineconeNamespace) obj.namespace = pineconeNamespace
        if (pineconeMetadataFilter) {
            const metadatafilter = typeof pineconeMetadataFilter === 'object' ? pineconeMetadataFilter : JSON.parse(pineconeMetadataFilter)
            obj.filter = metadatafilter
        }

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, obj)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever()
            return retriever
        } else if (output === 'vectorStore') {
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: Pinecone_Existing_VectorStores }

import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { Embeddings } from 'langchain/embeddings/base'
import { Document } from 'langchain/document'
import { getBaseClasses } from '../../../src/utils'
import { WeaviateLibArgs, WeaviateStore } from 'langchain/vectorstores/weaviate'
import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client'

class WeaviateUpsert_VectorStores implements INode {
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
        this.label = 'Weaviate更新存储'
        this.name = 'weaviateUpsert'
        this.type = 'Weaviate向量'
        this.icon = 'weaviate.png'
        this.category =
            '向量存储器-VectorStore\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：使用各种方式存储向量，前接文档数据和向量化模型，后接向量检索器，链或智能体'
        this.description = 'Weaviate Upsert：使用Weaviate数据库将文档转化为向量并上传存储'
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
                label: 'Weaviate传输协议',
                name: 'weaviateScheme',
                type: 'options',
                default: 'https',
                options: [
                    {
                        label: 'https',
                        name: 'https'
                    },
                    {
                        label: 'http',
                        name: 'http'
                    }
                ]
            },
            {
                label: 'Weaviate主机地址',
                name: 'weaviateHost',
                type: 'string',
                placeholder: 'localhost:8080'
            },
            {
                label: 'Weaviate索引',
                name: 'weaviateIndex',
                type: 'string',
                placeholder: 'Test'
            },
            {
                label: 'Weaviate API密匙',
                name: 'weaviateApiKey',
                type: 'password',
                optional: true
            },
            {
                label: 'Weaviate文本',
                name: 'weaviateTextKey',
                type: 'string',
                placeholder: 'text',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Weaviate元数据',
                name: 'weaviateMetadataKeys',
                type: 'string',
                rows: 4,
                placeholder: `["foo"]`,
                optional: true,
                additionalParams: true
            }
        ]
        this.outputs = [
            {
                label: 'Weaviate向量检索器',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Weaviate向量存储器',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(WeaviateStore)]
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const weaviateScheme = nodeData.inputs?.weaviateScheme as string
        const weaviateHost = nodeData.inputs?.weaviateHost as string
        const weaviateIndex = nodeData.inputs?.weaviateIndex as string
        const weaviateApiKey = nodeData.inputs?.weaviateApiKey as string
        const weaviateTextKey = nodeData.inputs?.weaviateTextKey as string
        const weaviateMetadataKeys = nodeData.inputs?.weaviateMetadataKeys as string

        const docs = nodeData.inputs?.document as Document[]
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const output = nodeData.outputs?.output as string

        const clientConfig: any = {
            scheme: weaviateScheme,
            host: weaviateHost
        }
        if (weaviateApiKey) clientConfig.apiKey = new ApiKey(weaviateApiKey)

        const client: WeaviateClient = weaviate.client(clientConfig)

        const flattenDocs = docs && docs.length ? docs.flat() : []
        const finalDocs = []
        for (let i = 0; i < flattenDocs.length; i += 1) {
            finalDocs.push(new Document(flattenDocs[i]))
        }

        const obj: WeaviateLibArgs = {
            client,
            indexName: weaviateIndex
        }

        if (weaviateTextKey) obj.textKey = weaviateTextKey
        if (weaviateMetadataKeys) obj.metadataKeys = JSON.parse(weaviateMetadataKeys.replace(/\s/g, ''))

        const vectorStore = await WeaviateStore.fromDocuments(finalDocs, embeddings, obj)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever()
            return retriever
        } else if (output === 'vectorStore') {
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: WeaviateUpsert_VectorStores }

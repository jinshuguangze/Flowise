import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { Chroma } from 'langchain/vectorstores/chroma'
import { Embeddings } from 'langchain/embeddings/base'
import { Document } from 'langchain/document'
import { getBaseClasses } from '../../../src/utils'

class ChromaUpsert_VectorStores implements INode {
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
        this.label = 'Chroma更新存储'
        this.name = 'chromaUpsert'
        this.type = 'Chroma向量'
        this.icon = 'chroma.svg'
        this.category =
            '向量存储器-VectorStore\n\n（作用：使用各种方式存储向量，前接文档数据和向量化模型，后接向量检索器，或输出自建检索器直接接链或智能体）'
        this.description = 'Chroma Upsert：使用Chroma数据库将文档转化为向量并上传存储'
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
                label: 'Chroma数据库名称',
                name: 'collectionName',
                type: 'string'
            },
            {
                label: 'Chroma URL链接',
                name: 'chromaURL',
                type: 'string',
                optional: true
            }
        ]
        this.outputs = [
            {
                label: 'Chroma向量检索器',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Chroma向量存储器',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(Chroma)]
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const collectionName = nodeData.inputs?.collectionName as string
        const docs = nodeData.inputs?.document as Document[]
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const chromaURL = nodeData.inputs?.chromaURL as string
        const output = nodeData.outputs?.output as string

        const flattenDocs = docs && docs.length ? docs.flat() : []
        const finalDocs = []
        for (let i = 0; i < flattenDocs.length; i += 1) {
            finalDocs.push(new Document(flattenDocs[i]))
        }

        const obj: {
            collectionName: string
            url?: string
        } = { collectionName }
        if (chromaURL) obj.url = chromaURL

        const vectorStore = await Chroma.fromDocuments(finalDocs, embeddings, obj)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever()
            return retriever
        } else if (output === 'vectorStore') {
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: ChromaUpsert_VectorStores }

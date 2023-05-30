import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Embeddings } from 'langchain/embeddings/base'
import { Document } from 'langchain/document'
import { getBaseClasses } from '../../../src/utils'

class InMemoryVectorStore_VectorStores implements INode {
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
        this.label = '内存读取存储'
        this.name = 'memoryVectorStore'
        this.type = '内存向量'
        this.icon = 'memory.svg'
        this.category = '向量存储器-VectorStore'
        this.description = 'Memory Vector Store：使用内存将文档转化为向量并临时存储，不支持名称访问，再次使用函数时或程序关闭后原向量会丢失'
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
            }
        ]
        this.outputs = [
            {
                label: '内存向量索引器',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: '内存向量存储器',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(MemoryVectorStore)]
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const docs = nodeData.inputs?.document as Document[]
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const output = nodeData.outputs?.output as string

        const flattenDocs = docs && docs.length ? docs.flat() : []
        const finalDocs = []
        for (let i = 0; i < flattenDocs.length; i += 1) {
            finalDocs.push(new Document(flattenDocs[i]))
        }

        const vectorStore = await MemoryVectorStore.fromDocuments(finalDocs, embeddings)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever()
            return retriever
        } else if (output === 'vectorStore') {
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: InMemoryVectorStore_VectorStores }

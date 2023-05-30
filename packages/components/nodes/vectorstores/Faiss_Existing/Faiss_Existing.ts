import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { FaissStore } from 'langchain/vectorstores/faiss'
import { Embeddings } from 'langchain/embeddings/base'
import { getBaseClasses } from '../../../src/utils'

class Faiss_Existing_VectorStores implements INode {
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
        this.label = 'Faiss读取存储'
        this.name = 'faissExistingIndex'
        this.type = 'Faiss向量'
        this.icon = 'faiss.svg'
        this.category = '向量存储器-VectorStore'
        this.description = 'Faiss Existing Index：从Faiss数据库里读取已保存的向量存储'
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        this.inputs = [
            {
                label: 'Embeddings',
                name: 'embeddings',
                type: 'Embeddings'
            },
            {
                label: 'Base Path to load',
                name: 'basePath',
                description: 'Path to load faiss.index file',
                placeholder: `C:\\Users\\User\\Desktop`,
                type: 'string'
            }
        ]
        this.outputs = [
            {
                label: 'Faiss Retriever',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Faiss Vector Store',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(FaissStore)]
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const basePath = nodeData.inputs?.basePath as string
        const output = nodeData.outputs?.output as string

        const vectorStore = await FaissStore.load(basePath, embeddings)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever()
            return retriever
        } else if (output === 'vectorStore') {
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: Faiss_Existing_VectorStores }

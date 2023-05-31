import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { Chroma } from 'langchain/vectorstores/chroma'
import { Embeddings } from 'langchain/embeddings/base'
import { getBaseClasses } from '../../../src/utils'

class Chroma_Existing_VectorStores implements INode {
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
        this.label = 'Chroma读取存储'
        this.name = 'chromaExistingIndex'
        this.type = 'Chroma向量'
        this.icon = 'chroma.svg'
        this.category =
            '向量存储器-VectorStore\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：使用各种方式存储向量，前接文档数据和向量化模型，后接向量检索器，链或智能体'
        this.description = 'Chroma Existing Index：从Chroma数据库里读取已保存的向量存储'
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        this.inputs = [
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
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const chromaURL = nodeData.inputs?.chromaURL as string
        const output = nodeData.outputs?.output as string

        const obj: {
            collectionName: string
            url?: string
        } = { collectionName }
        if (chromaURL) obj.url = chromaURL

        const vectorStore = await Chroma.fromExistingCollection(embeddings, obj)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever()
            return retriever
        } else if (output === 'vectorStore') {
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: Chroma_Existing_VectorStores }

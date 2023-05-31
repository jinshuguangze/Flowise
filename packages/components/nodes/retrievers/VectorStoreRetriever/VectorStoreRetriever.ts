import { VectorStore } from 'langchain/vectorstores/base'
import { INode, INodeData, INodeParams, VectorStoreRetriever, VectorStoreRetrieverInput } from '../../../src/Interface'

class VectorStoreRetriever_Retrievers implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '向量检索器'
        this.name = 'vectorStoreRetriever'
        this.type = '向量检索器'
        this.icon = 'vectorretriever.svg'
        this.category = '检索器-Retriever\n\n（作用：提供多个资源情况下的检索，前可接向量存储器，后接需要检索器的链或智能体）'
        this.description = 'Vector Store Retriever：对向量存储生成向量检索器，可供多检索器QA链查询'
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: '向量存储器',
                name: 'vectorStore',
                type: 'VectorStore'
            },
            {
                label: '向量检索器名称',
                name: 'name',
                type: 'string',
                placeholder: '日本动漫'
            },
            {
                label: '向量检索器作用描述',
                name: 'description',
                type: 'string',
                rows: 3,
                description: '使用自然语言说明应该在何时使用该向量检索器',
                placeholder: '此检索器用于检索日本动漫'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const name = nodeData.inputs?.name as string
        const description = nodeData.inputs?.description as string
        const vectorStore = nodeData.inputs?.vectorStore as VectorStore

        const obj = {
            name,
            description,
            vectorStore
        } as VectorStoreRetrieverInput

        const retriever = new VectorStoreRetriever(obj)
        return retriever
    }
}

module.exports = { nodeClass: VectorStoreRetriever_Retrievers }

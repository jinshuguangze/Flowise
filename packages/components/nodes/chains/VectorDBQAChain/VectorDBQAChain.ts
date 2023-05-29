import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { CustomChainHandler, getBaseClasses } from '../../../src/utils'
import { VectorDBQAChain } from 'langchain/chains'
import { BaseLanguageModel } from 'langchain/base_language'
import { VectorStore } from 'langchain/vectorstores'

class VectorDBQAChain_Chains implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = '向量数据库QA链'
        this.name = 'vectorDBQAChain'
        this.type = '向量数据库链'
        this.icon = 'chain.svg'
        this.category = '链-Chain'
        this.description = 'vector DB QA Chain：无上下文记忆，使用向量数据库来查询问题'
        this.baseClasses = [this.type, ...getBaseClasses(VectorDBQAChain)]
        this.inputs = [
            {
                label: '语言模型',
                name: 'model',
                type: 'BaseLanguageModel'
            },
            {
                label: '向量数据库',
                name: 'vectorStore',
                type: 'VectorStore'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const vectorStore = nodeData.inputs?.vectorStore as VectorStore

        const chain = VectorDBQAChain.fromLLM(model, vectorStore, { verbose: process.env.DEBUG === 'true' ? true : false })
        return chain
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string> {
        const chain = nodeData.instance as VectorDBQAChain
        const obj = {
            query: input
        }

        if (options.socketIO && options.socketIOClientId) {
            const handler = new CustomChainHandler(options.socketIO, options.socketIOClientId)
            const res = await chain.call(obj, [handler])
            return res?.text
        } else {
            const res = await chain.call(obj)
            return res?.text
        }
    }
}

module.exports = { nodeClass: VectorDBQAChain_Chains }

import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { RetrievalQAChain } from 'langchain/chains'
import { BaseRetriever } from 'langchain/schema'
import { CustomChainHandler, getBaseClasses } from '../../../src/utils'
import { BaseLanguageModel } from 'langchain/base_language'

class RetrievalQAChain_Chains implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = '向量检索器QA链'
        this.name = 'retrievalQAChain'
        this.type = 'QA链'
        this.icon = 'chain.svg'
        this.category = '链-Chain'
        this.description = 'Retrieval QA Chain：无上下文记忆，使用向量检索器来查询问题'
        this.baseClasses = [this.type, ...getBaseClasses(RetrievalQAChain)]
        this.inputs = [
            {
                label: '语言模型',
                name: 'model',
                type: 'BaseLanguageModel'
            },
            {
                label: '向量检索器',
                name: 'vectorStoreRetriever',
                type: 'BaseRetriever'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const vectorStoreRetriever = nodeData.inputs?.vectorStoreRetriever as BaseRetriever

        const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever, { verbose: process.env.DEBUG === 'true' ? true : false })
        return chain
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string> {
        const chain = nodeData.instance as RetrievalQAChain
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

module.exports = { nodeClass: RetrievalQAChain_Chains }

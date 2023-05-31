import { BaseLanguageModel } from 'langchain/base_language'
import { ICommonObject, INode, INodeData, INodeParams, VectorStoreRetriever } from '../../../src/Interface'
import { CustomChainHandler, getBaseClasses } from '../../../src/utils'
import { MultiRetrievalQAChain } from 'langchain/chains'

class MultiRetrievalQAChain_Chains implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = '多检索器QA链'
        this.name = 'multiRetrievalQAChain'
        this.type = '多检索器QA链'
        this.icon = 'chain.svg'
        this.category = '链-Chain\n\n（作用：单一目标的处理中心，前接语言模型等，后可接链工具，作为工具连接在智能体上）'
        this.description =
            'MultiRetrieval QA Chain：自动从多个向量检索器中选择合适检索器的QA链，无上下文记忆，QA链是指使用向量数据库+向量检索器来存储数据'
        this.baseClasses = [this.type, ...getBaseClasses(MultiRetrievalQAChain)]
        this.inputs = [
            {
                label: '语言模型',
                name: 'model',
                type: 'BaseLanguageModel'
            },
            {
                label: '向量检索器',
                name: 'vectorStoreRetriever',
                type: 'VectorStoreRetriever',
                list: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const vectorStoreRetriever = nodeData.inputs?.vectorStoreRetriever as VectorStoreRetriever[]
        const retrieverNames = []
        const retrieverDescriptions = []
        const retrievers = []

        for (const vs of vectorStoreRetriever) {
            retrieverNames.push(vs.name)
            retrieverDescriptions.push(vs.description)
            retrievers.push(vs.vectorStore.asRetriever())
        }

        const chain = MultiRetrievalQAChain.fromRetrievers(model, retrieverNames, retrieverDescriptions, retrievers, undefined, {
            verbose: process.env.DEBUG === 'true' ? true : false
        } as any)

        return chain
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string> {
        const chain = nodeData.instance as MultiRetrievalQAChain
        const obj = { input }

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

module.exports = { nodeClass: MultiRetrievalQAChain_Chains }

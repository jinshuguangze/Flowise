import { BaseLanguageModel } from 'langchain/base_language'
import { ICommonObject, INode, INodeData, INodeParams, PromptRetriever } from '../../../src/Interface'
import { CustomChainHandler, getBaseClasses } from '../../../src/utils'
import { MultiPromptChain } from 'langchain/chains'

class MultiPromptChain_Chains implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = '多提示词模板链'
        this.name = 'multiPromptChain'
        this.type = '多提示词模板链'
        this.icon = 'chain.svg'
        this.category =
            '链-Chain\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：单一目标的处理中心，前接语言模型等，后可接链工具，作为工具连接在智能体上'
        this.description = 'MultiPrompt Chain：自动从多个提示词模板中选择合适提示词的链，无上下文记忆'
        this.baseClasses = [this.type, ...getBaseClasses(MultiPromptChain)]
        this.inputs = [
            {
                label: '语言模型',
                name: 'model',
                type: 'BaseLanguageModel'
            },
            {
                label: '提示词检索器',
                name: 'promptRetriever',
                type: 'PromptRetriever',
                list: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const promptRetriever = nodeData.inputs?.promptRetriever as PromptRetriever[]
        const promptNames = []
        const promptDescriptions = []
        const promptTemplates = []

        for (const prompt of promptRetriever) {
            promptNames.push(prompt.name)
            promptDescriptions.push(prompt.description)
            promptTemplates.push(prompt.systemMessage)
        }

        const chain = MultiPromptChain.fromPrompts(model, promptNames, promptDescriptions, promptTemplates, undefined, {
            verbose: process.env.DEBUG === 'true' ? true : false
        } as any)

        return chain
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string> {
        const chain = nodeData.instance as MultiPromptChain
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

module.exports = { nodeClass: MultiPromptChain_Chains }

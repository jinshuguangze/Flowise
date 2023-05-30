import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { ConversationSummaryMemory, ConversationSummaryMemoryInput } from 'langchain/memory'
import { BaseLanguageModel } from 'langchain/base_language'

class ConversationSummaryMemory_Memory implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '对话总结记忆模式'
        this.name = 'conversationSummaryMemory'
        this.type = '对话总结记忆模式'
        this.icon = 'memory.svg'
        this.category = '记忆模式-Memory'
        this.description = 'Conversation Summary Memory：将不断总结上下文对话，提炼出概要后缓存'
        this.baseClasses = [this.type, ...getBaseClasses(ConversationSummaryMemory)]
        this.inputs = [
            {
                label: '对话语言模型',
                name: 'model',
                type: 'BaseChatModel'
            },
            {
                label: '记忆数据的变量名称',
                name: 'memoryKey',
                type: 'string',
                default: 'chat_history'
            },
            {
                label: '人类输入数据的变量名称',
                name: 'inputKey',
                type: 'string',
                default: 'input'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const memoryKey = nodeData.inputs?.memoryKey as string
        const inputKey = nodeData.inputs?.inputKey as string

        const obj: ConversationSummaryMemoryInput = {
            llm: model,
            returnMessages: true,
            memoryKey,
            inputKey
        }

        return new ConversationSummaryMemory(obj)
    }
}

module.exports = { nodeClass: ConversationSummaryMemory_Memory }

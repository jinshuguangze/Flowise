import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { ChatOpenAI, OpenAIChatInput } from 'langchain/chat_models/openai'

class ChatOpenAI_ChatModels implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'OpenAI对话语言模型'
        this.name = 'chatOpenAI'
        this.type = 'OpenAI对话语言模型'
        this.icon = 'openai.png'
        this.category = '对话语言模型-ChatModel'
        this.description = 'Chat OpenAI：OpenAI公司的对话语言模型，GPT系列'
        this.baseClasses = [this.type, ...getBaseClasses(ChatOpenAI)]
        this.inputs = [
            {
                label: 'OpenAI Api密匙',
                name: 'openAIApiKey',
                type: 'password'
            },
            {
                label: '语言模型选择',
                name: 'modelName',
                type: 'options',
                options: [
                    {
                        label: 'gpt-4',
                        name: 'gpt-4'
                    },
                    {
                        label: 'gpt-4-0314',
                        name: 'gpt-4-0314'
                    },
                    {
                        label: 'gpt-4-32k-0314',
                        name: 'gpt-4-32k-0314'
                    },
                    {
                        label: 'gpt-3.5-turbo',
                        name: 'gpt-3.5-turbo'
                    },
                    {
                        label: 'gpt-3.5-turbo-0301',
                        name: 'gpt-3.5-turbo-0301'
                    }
                ],
                default: 'gpt-3.5-turbo',
                optional: true
            },
            {
                label: '温度值',
                name: 'temperature',
                type: 'number',
                default: 0.9,
                optional: true
            },
            {
                label: '最大Token上限',
                name: 'maxTokens',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Top P值',
                name: 'topP',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: '频率惩罚',
                name: 'frequencyPenalty',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: '存在惩罚',
                name: 'presencePenalty',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: '超时时间',
                name: 'timeout',
                type: 'number',
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const temperature = nodeData.inputs?.temperature as string
        const modelName = nodeData.inputs?.modelName as string
        const openAIApiKey = nodeData.inputs?.openAIApiKey as string
        const maxTokens = nodeData.inputs?.maxTokens as string
        const topP = nodeData.inputs?.topP as string
        const frequencyPenalty = nodeData.inputs?.frequencyPenalty as string
        const presencePenalty = nodeData.inputs?.presencePenalty as string
        const timeout = nodeData.inputs?.timeout as string
        const streaming = nodeData.inputs?.streaming as boolean

        const obj: Partial<OpenAIChatInput> & { openAIApiKey?: string } = {
            temperature: parseInt(temperature, 10),
            modelName,
            openAIApiKey,
            streaming: streaming ?? true
        }

        if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)
        if (topP) obj.topP = parseInt(topP, 10)
        if (frequencyPenalty) obj.frequencyPenalty = parseInt(frequencyPenalty, 10)
        if (presencePenalty) obj.presencePenalty = parseInt(presencePenalty, 10)
        if (timeout) obj.timeout = parseInt(timeout, 10)

        const model = new ChatOpenAI(obj)
        return model
    }
}

module.exports = { nodeClass: ChatOpenAI_ChatModels }

import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { OpenAIChat } from 'langchain/llms/openai'
import { OpenAIChatInput } from 'langchain/chat_models/openai'

class ChatLocalAI_ChatModels implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '本地对话语言模型'
        this.name = 'chatLocalAI'
        this.type = '本地对话语言模型'
        this.icon = 'localai.png'
        this.category = '对话语言模型-ChatModel\n\n（作用：拥有对话能力的语言模型，后接链或智能体）'
        this.description = 'Chat Local AI：使用本地对话语言模型，如llama, gpt4all等'
        this.baseClasses = [this.type, 'BaseChatModel', ...getBaseClasses(OpenAIChat)]
        this.inputs = [
            {
                label: '模型根路径',
                name: 'basePath',
                type: 'string',
                placeholder: 'http://localhost:8080/v1'
            },
            {
                label: '对话语言模型选择',
                name: 'modelName',
                type: 'string',
                placeholder: 'gpt4all-lora-quantized.bin'
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
                label: '超时时长',
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
        const maxTokens = nodeData.inputs?.maxTokens as string
        const topP = nodeData.inputs?.topP as string
        const timeout = nodeData.inputs?.timeout as string
        const basePath = nodeData.inputs?.basePath as string

        const obj: Partial<OpenAIChatInput> & { openAIApiKey?: string } = {
            temperature: parseInt(temperature, 10),
            modelName,
            openAIApiKey: 'sk-'
        }

        if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)
        if (topP) obj.topP = parseInt(topP, 10)
        if (timeout) obj.timeout = parseInt(timeout, 10)

        const model = new OpenAIChat(obj, { basePath })

        return model
    }
}

module.exports = { nodeClass: ChatLocalAI_ChatModels }

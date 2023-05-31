import { OpenAIBaseInput } from 'langchain/dist/types/openai-types'
import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { AzureOpenAIInput, ChatOpenAI } from 'langchain/chat_models/openai'

class AzureChatOpenAI_ChatModels implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Azure版OpenAI对话语言模型'
        this.name = 'azureChatOpenAI'
        this.type = 'Azure版OpenAI对话语言模型'
        this.icon = 'Azure.svg'
        this.category = '对话语言模型-ChatModel\n\n（作用：拥有对话能力的语言模型，后接链或智能体）'
        this.description = 'Azure Chat OpenAI：Azure版本的OpenAI对话语言模型，GPT系列'
        this.baseClasses = [this.type, ...getBaseClasses(ChatOpenAI)]
        this.inputs = [
            {
                label: 'Azure OpenAI Api密匙',
                name: 'azureOpenAIApiKey',
                type: 'password'
            },
            {
                label: '对话语言模型选择',
                name: 'modelName',
                type: 'options',
                options: [
                    {
                        label: 'gpt-4',
                        name: 'gpt-4'
                    },
                    {
                        label: 'gpt-4-32k',
                        name: 'gpt-4-32k'
                    },
                    {
                        label: 'gpt-35-turbo',
                        name: 'gpt-35-turbo'
                    }
                ],
                default: 'gpt-35-turbo',
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
                label: 'Azure OpenAI Api实例名称',
                name: 'azureOpenAIApiInstanceName',
                type: 'string',
                placeholder: 'YOUR-INSTANCE-NAME'
            },
            {
                label: 'Azure OpenAI Api部署名称',
                name: 'azureOpenAIApiDeploymentName',
                type: 'string',
                placeholder: 'YOUR-DEPLOYMENT-NAME'
            },
            {
                label: 'Azure OpenAI Api版本',
                name: 'azureOpenAIApiVersion',
                type: 'options',
                options: [
                    {
                        label: '2023-03-15-preview',
                        name: '2023-03-15-preview'
                    }
                ],
                default: '2023-03-15-preview'
            },
            {
                label: '最大Token上限',
                name: 'maxTokens',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: '频率惩罚值',
                name: 'frequencyPenalty',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: '存在惩罚值',
                name: 'presencePenalty',
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
        const azureOpenAIApiKey = nodeData.inputs?.azureOpenAIApiKey as string
        const modelName = nodeData.inputs?.modelName as string
        const temperature = nodeData.inputs?.temperature as string
        const azureOpenAIApiInstanceName = nodeData.inputs?.azureOpenAIApiInstanceName as string
        const azureOpenAIApiDeploymentName = nodeData.inputs?.azureOpenAIApiDeploymentName as string
        const azureOpenAIApiVersion = nodeData.inputs?.azureOpenAIApiVersion as string
        const maxTokens = nodeData.inputs?.maxTokens as string
        const frequencyPenalty = nodeData.inputs?.frequencyPenalty as string
        const presencePenalty = nodeData.inputs?.presencePenalty as string
        const timeout = nodeData.inputs?.timeout as string
        const streaming = nodeData.inputs?.streaming as boolean

        const obj: Partial<AzureOpenAIInput> & Partial<OpenAIBaseInput> = {
            temperature: parseInt(temperature, 10),
            modelName,
            azureOpenAIApiKey,
            azureOpenAIApiInstanceName,
            azureOpenAIApiDeploymentName,
            azureOpenAIApiVersion,
            streaming: streaming ?? true
        }

        if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)
        if (frequencyPenalty) obj.frequencyPenalty = parseInt(frequencyPenalty, 10)
        if (presencePenalty) obj.presencePenalty = parseInt(presencePenalty, 10)
        if (timeout) obj.timeout = parseInt(timeout, 10)

        const model = new ChatOpenAI(obj)
        return model
    }
}

module.exports = { nodeClass: AzureChatOpenAI_ChatModels }

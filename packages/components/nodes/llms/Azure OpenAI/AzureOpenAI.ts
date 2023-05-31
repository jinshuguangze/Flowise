import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { AzureOpenAIInput, OpenAI, OpenAIInput } from 'langchain/llms/openai'

class AzureOpenAI_LLMs implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Azure版OpenAI语言模型'
        this.name = 'azureOpenAI'
        this.type = 'Azure版OpenAI语言模型'
        this.icon = 'Azure.svg'
        this.category = '普通语言模型-LLM\n\n（作用：无对话能力的语言模型，后接链或智能体）'
        this.description = 'Azure OpenAI：Azure版本的OpenAI普通语言模型，GPT系列'
        this.baseClasses = [this.type, ...getBaseClasses(OpenAI)]
        this.inputs = [
            {
                label: 'Azure OpenAI Api密匙',
                name: 'azureOpenAIApiKey',
                type: 'password'
            },
            {
                label: '普通语言模型选择',
                name: 'modelName',
                type: 'options',
                options: [
                    {
                        label: 'text-davinci-003',
                        name: 'text-davinci-003'
                    },
                    {
                        label: 'ada',
                        name: 'ada'
                    },
                    {
                        label: 'text-ada-001',
                        name: 'text-ada-001'
                    },
                    {
                        label: 'babbage',
                        name: 'babbage'
                    },
                    {
                        label: 'text-babbage-001',
                        name: 'text-babbage-001'
                    },
                    {
                        label: 'curie',
                        name: 'curie'
                    },
                    {
                        label: 'text-curie-001',
                        name: 'text-curie-001'
                    },
                    {
                        label: 'davinci',
                        name: 'davinci'
                    },
                    {
                        label: 'text-davinci-001',
                        name: 'text-davinci-001'
                    },
                    {
                        label: 'text-davinci-002',
                        name: 'text-davinci-002'
                    },
                    {
                        label: 'text-davinci-fine-tune-002',
                        name: 'text-davinci-fine-tune-002'
                    },
                    {
                        label: 'gpt-35-turbo',
                        name: 'gpt-35-turbo'
                    }
                ],
                default: 'text-davinci-003',
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
                    },
                    {
                        label: '2022-12-01',
                        name: '2022-12-01'
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
                label: 'Top P值',
                name: 'topP',
                type: 'number',
                optional: true,
                additionalParams: true
            },
            {
                label: '输出候选数量',
                name: 'bestOf',
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
        const temperature = nodeData.inputs?.temperature as string
        const modelName = nodeData.inputs?.modelName as string
        const azureOpenAIApiInstanceName = nodeData.inputs?.azureOpenAIApiInstanceName as string
        const azureOpenAIApiDeploymentName = nodeData.inputs?.azureOpenAIApiDeploymentName as string
        const azureOpenAIApiVersion = nodeData.inputs?.azureOpenAIApiVersion as string
        const maxTokens = nodeData.inputs?.maxTokens as string
        const topP = nodeData.inputs?.topP as string
        const frequencyPenalty = nodeData.inputs?.frequencyPenalty as string
        const presencePenalty = nodeData.inputs?.presencePenalty as string
        const timeout = nodeData.inputs?.timeout as string
        const bestOf = nodeData.inputs?.bestOf as string
        const streaming = nodeData.inputs?.streaming as boolean

        const obj: Partial<AzureOpenAIInput> & Partial<OpenAIInput> = {
            temperature: parseInt(temperature, 10),
            modelName,
            azureOpenAIApiKey,
            azureOpenAIApiInstanceName,
            azureOpenAIApiDeploymentName,
            azureOpenAIApiVersion,
            streaming: streaming ?? true
        }

        if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)
        if (topP) obj.topP = parseInt(topP, 10)
        if (frequencyPenalty) obj.frequencyPenalty = parseInt(frequencyPenalty, 10)
        if (presencePenalty) obj.presencePenalty = parseInt(presencePenalty, 10)
        if (timeout) obj.timeout = parseInt(timeout, 10)
        if (bestOf) obj.bestOf = parseInt(bestOf, 10)

        const model = new OpenAI(obj)
        return model
    }
}

module.exports = { nodeClass: AzureOpenAI_LLMs }

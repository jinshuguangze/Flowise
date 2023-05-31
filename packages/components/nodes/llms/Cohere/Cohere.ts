import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { Cohere, CohereInput } from './core'

class Cohere_LLMs implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Cohere语言模型'
        this.name = 'cohere'
        this.type = 'Cohere语言模型'
        this.icon = 'cohere.png'
        this.category = '普通语言模型-LLM\n\n（作用：无对话能力的语言模型，后接链或智能体）'
        this.description = 'Cohere：Cohere公司的普通语言模型，Cohere系列'
        this.baseClasses = [this.type, ...getBaseClasses(Cohere)]
        this.inputs = [
            {
                label: 'Cohere Api密匙',
                name: 'cohereApiKey',
                type: 'password'
            },
            {
                label: '普通语言模型选择',
                name: 'modelName',
                type: 'options',
                options: [
                    {
                        label: 'command',
                        name: 'command'
                    },
                    {
                        label: 'command-light',
                        name: 'command-light'
                    },
                    {
                        label: 'command-nightly',
                        name: 'command-nightly'
                    },
                    {
                        label: 'command-light-nightly',
                        name: 'command-light-nightly'
                    },
                    {
                        label: 'base',
                        name: 'base'
                    },
                    {
                        label: 'base-light',
                        name: 'base-light'
                    }
                ],
                default: 'command',
                optional: true
            },
            {
                label: '温度值',
                name: 'temperature',
                type: 'number',
                default: 0.7,
                optional: true
            },
            {
                label: '最大Token上限',
                name: 'maxTokens',
                type: 'number',
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const temperature = nodeData.inputs?.temperature as string
        const modelName = nodeData.inputs?.modelName as string
        const apiKey = nodeData.inputs?.cohereApiKey as string
        const maxTokens = nodeData.inputs?.maxTokens as string

        const obj: CohereInput = {
            apiKey
        }

        if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)
        if (modelName) obj.model = modelName
        if (temperature) obj.temperature = parseInt(temperature, 10)

        const model = new Cohere(obj)
        return model
    }
}

module.exports = { nodeClass: Cohere_LLMs }

import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { HuggingFaceInference } from 'langchain/llms/hf'

class HuggingFaceInference_LLMs implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'HuggingFace语言模型'
        this.name = 'huggingFaceInference_LLMs'
        this.type = 'HuggingFace语言模型'
        this.icon = 'huggingface.png'
        this.category =
            '普通语言模型-LLM\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：无对话聊天能力的生成式语言模型，后接链或智能体'
        this.description = 'HuggingFace Inference LLMs：HuggingFace社区里的普通语言模型，如gpt2, alpaca等'
        this.baseClasses = [this.type, ...getBaseClasses(HuggingFaceInference)]
        this.inputs = [
            {
                label: '普通语言模型名称',
                name: 'model',
                type: 'string',
                placeholder: 'gpt2'
            },
            {
                label: 'HuggingFace Api密匙',
                name: 'apiKey',
                type: 'password'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as string
        const apiKey = nodeData.inputs?.apiKey as string

        const huggingFace = new HuggingFaceInference({
            model,
            apiKey
        })
        return huggingFace
    }
}

module.exports = { nodeClass: HuggingFaceInference_LLMs }

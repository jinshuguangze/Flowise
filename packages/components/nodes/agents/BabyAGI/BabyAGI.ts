import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { BabyAGI } from './core'
import { BaseChatModel } from 'langchain/chat_models/base'
import { VectorStore } from 'langchain/vectorstores'

class BabyAGI_Agents implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'BabyAGI智能体'
        this.name = 'babyAGI'
        this.type = 'BabyAGI智能体'
        this.category = '智能体-Agent'
        this.icon = 'babyagi.jpg'
        this.description =
            'BabyAGI：另一个具有综合能力的智能体，它无法使用外部工具，但它能提前规划好一连串思维链上的子目标，并根据前一个子目标的生成来决定下一个子目标的优先级，这使得它更能专注于原始目标'
        this.baseClasses = ['BabyAGI']
        this.inputs = [
            {
                label: '对话型语言模型',
                name: 'model',
                type: 'BaseChatModel'
            },
            {
                label: '向量存储器',
                name: 'vectorStore',
                type: 'VectorStore'
            },
            {
                label: '任务循环次数',
                name: 'taskLoop',
                type: 'number',
                default: 3
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseChatModel
        const vectorStore = nodeData.inputs?.vectorStore as VectorStore
        const taskLoop = nodeData.inputs?.taskLoop as string

        const babyAgi = BabyAGI.fromLLM(model, vectorStore, parseInt(taskLoop, 10))
        return babyAgi
    }

    async run(nodeData: INodeData, input: string): Promise<string> {
        const executor = nodeData.instance as BabyAGI
        const objective = input

        const res = await executor.call({ objective })
        return res
    }
}

module.exports = { nodeClass: BabyAGI_Agents }

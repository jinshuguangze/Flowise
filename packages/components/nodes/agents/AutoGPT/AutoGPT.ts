import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { BaseChatModel } from 'langchain/chat_models/base'
import { AutoGPT } from 'langchain/experimental/autogpt'
import { Tool } from 'langchain/tools'
import { VectorStoreRetriever } from 'langchain/vectorstores/base'

class AutoGPT_Agents implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'AutoGPT智能体'
        this.name = 'autoGPT'
        this.type = 'AutoGPT智能体'
        this.category = '智能体-Agent'
        this.icon = 'autogpt.png'
        this.description =
            'AutoGPT：一个具有综合能力的智能体，它通过自我引导形成思维链，使用一切它能利用的网络信息，工具和手段，完成一个复杂的目标'
        this.baseClasses = ['AutoGPT']
        this.inputs = [
            {
                label: '允许工具列表',
                name: 'tools',
                type: 'Tool',
                list: true
            },
            {
                label: '对话型语言模型',
                name: 'model',
                type: 'BaseChatModel'
            },
            {
                label: '向量检索器',
                name: 'vectorStoreRetriever',
                type: 'BaseRetriever'
            },
            {
                label: '智能体名称',
                name: 'aiName',
                type: 'string',
                placeholder: 'Tom',
                optional: true
            },
            {
                label: '智能体扮演角色',
                name: 'aiRole',
                type: 'string',
                placeholder: 'Assistant',
                optional: true
            },
            {
                label: '最大循环次数',
                name: 'maxLoop',
                type: 'number',
                default: 5,
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseChatModel
        const vectorStoreRetriever = nodeData.inputs?.vectorStoreRetriever as VectorStoreRetriever
        let tools = nodeData.inputs?.tools as Tool[]
        tools = tools.flat()
        const aiName = (nodeData.inputs?.aiName as string) || 'AutoGPT'
        const aiRole = (nodeData.inputs?.aiRole as string) || 'Assistant'
        const maxLoop = nodeData.inputs?.maxLoop as string

        const autogpt = AutoGPT.fromLLMAndTools(model, tools, {
            memory: vectorStoreRetriever,
            aiName,
            aiRole
        })

        autogpt.maxIterations = parseInt(maxLoop, 10)

        return autogpt
    }

    async run(nodeData: INodeData, input: string): Promise<string> {
        const executor = nodeData.instance as AutoGPT
        try {
            const res = await executor.run([input])
            return res || 'I have completed all my tasks.'
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    }
}

module.exports = { nodeClass: AutoGPT_Agents }

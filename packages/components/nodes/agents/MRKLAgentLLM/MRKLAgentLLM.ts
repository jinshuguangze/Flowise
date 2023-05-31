import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { initializeAgentExecutorWithOptions, AgentExecutor } from 'langchain/agents'
import { Tool } from 'langchain/tools'
import { getBaseClasses } from '../../../src/utils'
import { BaseLanguageModel } from 'langchain/base_language'

class MRKLAgentLLM_Agents implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '查询型智能体（普通语言模型核心）'
        this.name = 'mrklAgentLLM'
        this.type = '代理执行器'
        this.category = '智能体-Agent\n\n（作用：复杂目标的处理中心，前接语言模型和允许工具列表等）'
        this.icon = 'agent.svg'
        this.description = 'MRKL Agent LLM：单次查询场景使用（适用于外接非对话语言模型），可以根据指令，去选择合适工具以增强回复的智能体'
        this.baseClasses = [this.type, ...getBaseClasses(AgentExecutor)]
        this.inputs = [
            {
                label: '允许工具列表',
                name: 'tools',
                type: 'Tool',
                list: true
            },
            {
                label: '语言模型',
                name: 'model',
                type: 'BaseLanguageModel'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        let tools = nodeData.inputs?.tools as Tool[]
        tools = tools.flat()

        const executor = await initializeAgentExecutorWithOptions(tools, model, {
            agentType: 'zero-shot-react-description',
            verbose: process.env.DEBUG === 'true' ? true : false
        })
        return executor
    }

    async run(nodeData: INodeData, input: string): Promise<string> {
        const executor = nodeData.instance as AgentExecutor
        const result = await executor.call({ input })

        return result?.output
    }
}

module.exports = { nodeClass: MRKLAgentLLM_Agents }

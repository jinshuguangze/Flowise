import { ICommonObject, IMessage, INode, INodeData, INodeParams } from '../../../src/Interface'
import { initializeAgentExecutorWithOptions, AgentExecutor, InitializeAgentExecutorOptions } from 'langchain/agents'
import { Tool } from 'langchain/tools'
import { BaseChatMemory, ChatMessageHistory } from 'langchain/memory'
import { getBaseClasses } from '../../../src/utils'
import { AIChatMessage, HumanChatMessage } from 'langchain/schema'
import { BaseLanguageModel } from 'langchain/base_language'

class ConversationalAgent_Agents implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '对话型智能体'
        this.name = 'conversationalAgent'
        this.type = '代理执行器'
        this.category =
            '智能体-Agent\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：复杂目标的处理中心，前接语言模型和允许工具列表等'
        this.icon = 'agent.svg'
        this.description = 'Conversational Agent：聊天场景使用，可以根据聊天内容，选择合适工具增强答案的智能体'
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
            },
            {
                label: '记忆模式',
                name: 'memory',
                type: 'BaseChatMemory'
            },
            {
                label: '前置系统信息',
                name: 'systemMessage',
                type: 'string',
                rows: 4,
                optional: true,
                additionalParams: true
            },
            {
                label: '前置人类信息',
                name: 'humanMessage',
                type: 'string',
                rows: 4,
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        let tools = nodeData.inputs?.tools as Tool[]
        tools = tools.flat()
        const memory = nodeData.inputs?.memory as BaseChatMemory
        const humanMessage = nodeData.inputs?.humanMessage as string
        const systemMessage = nodeData.inputs?.systemMessage as string

        const obj: InitializeAgentExecutorOptions = {
            agentType: 'chat-conversational-react-description',
            verbose: process.env.DEBUG === 'true' ? true : false
        }

        const agentArgs: any = {}
        if (humanMessage) {
            agentArgs.humanMessage = humanMessage
        }
        if (systemMessage) {
            agentArgs.systemMessage = systemMessage
        }

        if (Object.keys(agentArgs).length) obj.agentArgs = agentArgs

        const executor = await initializeAgentExecutorWithOptions(tools, model, obj)
        executor.memory = memory
        return executor
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string> {
        const executor = nodeData.instance as AgentExecutor
        const memory = nodeData.inputs?.memory as BaseChatMemory

        if (options && options.chatHistory) {
            const chatHistory = []
            const histories: IMessage[] = options.chatHistory

            for (const message of histories) {
                if (message.type === 'apiMessage') {
                    chatHistory.push(new AIChatMessage(message.message))
                } else if (message.type === 'userMessage') {
                    chatHistory.push(new HumanChatMessage(message.message))
                }
            }
            memory.chatHistory = new ChatMessageHistory(chatHistory)
            executor.memory = memory
        }
        const result = await executor.call({ input })

        return result?.output
    }
}

module.exports = { nodeClass: ConversationalAgent_Agents }

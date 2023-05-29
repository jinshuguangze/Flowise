import { ICommonObject, IMessage, INode, INodeData, INodeParams } from '../../../src/Interface'
import { ConversationChain } from 'langchain/chains'
import { CustomChainHandler, getBaseClasses } from '../../../src/utils'
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from 'langchain/prompts'
import { BufferMemory, ChatMessageHistory } from 'langchain/memory'
import { BaseChatModel } from 'langchain/chat_models/base'
import { AIChatMessage, HumanChatMessage } from 'langchain/schema'

const systemMessage = `The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.`

class ConversationChain_Chains implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = '对话链'
        this.name = 'conversationChain'
        this.type = '对话链'
        this.icon = 'chain.svg'
        this.category = '链-Chain'
        this.description = 'Conversation Chain：适用于对话场景的链，带有上下文记忆'
        this.baseClasses = [this.type, ...getBaseClasses(ConversationChain)]
        this.inputs = [
            {
                label: '语言模型',
                name: 'model',
                type: 'BaseChatModel'
            },
            {
                label: '记忆模式',
                name: 'memory',
                type: 'BaseMemory'
            },
            {
                label: '前置系统消息',
                name: 'systemMessagePrompt',
                type: 'string',
                rows: 4,
                additionalParams: true,
                optional: true,
                placeholder: 'You are a helpful assistant that write codes'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseChatModel
        const memory = nodeData.inputs?.memory as BufferMemory
        const prompt = nodeData.inputs?.systemMessagePrompt as string

        const obj: any = {
            llm: model,
            memory,
            verbose: process.env.DEBUG === 'true' ? true : false
        }

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(prompt ? `${prompt}\n${systemMessage}` : systemMessage),
            new MessagesPlaceholder(memory.memoryKey ?? 'chat_history'),
            HumanMessagePromptTemplate.fromTemplate('{input}')
        ])
        obj.prompt = chatPrompt

        const chain = new ConversationChain(obj)
        return chain
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string> {
        const chain = nodeData.instance as ConversationChain
        const memory = nodeData.inputs?.memory as BufferMemory

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
            chain.memory = memory
        }

        if (options.socketIO && options.socketIOClientId) {
            const handler = new CustomChainHandler(options.socketIO, options.socketIOClientId)
            const res = await chain.call({ input }, [handler])
            return res?.response
        } else {
            const res = await chain.call({ input })
            return res?.response
        }
    }
}

module.exports = { nodeClass: ConversationChain_Chains }

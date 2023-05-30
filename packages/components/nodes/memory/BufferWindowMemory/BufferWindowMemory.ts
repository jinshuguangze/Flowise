import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { BufferWindowMemory, BufferWindowMemoryInput } from 'langchain/memory'

class BufferWindowMemory_Memory implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '窗口缓存记忆模式'
        this.name = 'bufferWindowMemory'
        this.type = '窗口缓存记忆模式'
        this.icon = 'memory.svg'
        this.category = '记忆模式-Memory'
        this.description = 'Buffer Window Memory：只允许最新的K个对话进入缓存，提出新的问题时将这K个对话缓存添加进提示词，产生的新一轮问答将替代掉最老的问答记忆缓存'
        this.baseClasses = [this.type, ...getBaseClasses(BufferWindowMemory)]
        this.inputs = [
            {
                label: '记忆数据的变量名称',
                name: 'memoryKey',
                type: 'string',
                default: 'chat_history'
            },
            {
                label: '人类输入数据的变量名称',
                name: 'inputKey',
                type: 'string',
                default: 'input'
            },
            {
                label: '记忆窗口大小',
                name: 'k',
                type: 'number',
                default: '4',
                description: '即K值，超过K轮问答轮次后，最老的记忆将会消失，只保留K轮对话记忆'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const memoryKey = nodeData.inputs?.memoryKey as string
        const inputKey = nodeData.inputs?.inputKey as string
        const k = nodeData.inputs?.k as string

        const obj: Partial<BufferWindowMemoryInput> = {
            returnMessages: true,
            memoryKey: memoryKey,
            inputKey: inputKey,
            k: parseInt(k, 10)
        }

        return new BufferWindowMemory(obj)
    }
}

module.exports = { nodeClass: BufferWindowMemory_Memory }

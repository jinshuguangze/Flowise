import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { BufferMemory } from 'langchain/memory'

class BufferMemory_Memory implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '全缓存记忆模式'
        this.name = 'bufferMemory'
        this.type = '全缓存记忆模式'
        this.icon = 'memory.svg'
        this.category = '记忆模式-Memory'
        this.description = 'Buffer Memory：直接将所有上下文记忆全部进行缓存，提出新的问题时将所有缓存记忆全部添加进提示词'
        this.baseClasses = [this.type, ...getBaseClasses(BufferMemory)]
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
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const memoryKey = nodeData.inputs?.memoryKey as string
        const inputKey = nodeData.inputs?.inputKey as string
        return new BufferMemory({
            returnMessages: true,
            memoryKey,
            inputKey
        })
    }
}

module.exports = { nodeClass: BufferMemory_Memory }

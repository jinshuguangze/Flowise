import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { ChainTool } from 'langchain/tools'
import { BaseChain } from 'langchain/chains'

class ChainTool_Tools implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '链工具'
        this.name = 'chainTool'
        this.type = '链工具'
        this.icon = 'chaintool.svg'
        this.category = '工具-Tool'
        this.description = 'Chain Tool：授权使用外接链（Chain）的工具，增加智能体使用其他语言模型得到回复数据的能力'
        this.baseClasses = [this.type, ...getBaseClasses(ChainTool)]
        this.inputs = [
            {
                label: 'Chain Name',
                name: 'name',
                type: 'string',
                placeholder: 'state-of-union-qa'
            },
            {
                label: 'Chain Description',
                name: 'description',
                type: 'string',
                rows: 3,
                placeholder:
                    'State of the Union QA - useful for when you need to ask questions about the most recent state of the union address.'
            },
            {
                label: 'Return Direct',
                name: 'returnDirect',
                type: 'boolean',
                optional: true
            },
            {
                label: 'Base Chain',
                name: 'baseChain',
                type: 'BaseChain'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const name = nodeData.inputs?.name as string
        const description = nodeData.inputs?.description as string
        const baseChain = nodeData.inputs?.baseChain as BaseChain
        const returnDirect = nodeData.inputs?.returnDirect as boolean

        const obj = {
            name,
            description,
            chain: baseChain
        } as any

        if (returnDirect) obj.returnDirect = returnDirect

        const tool = new ChainTool(obj)

        return tool
    }
}

module.exports = { nodeClass: ChainTool_Tools }

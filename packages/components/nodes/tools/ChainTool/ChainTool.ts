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
        this.category = '工具-Tool\n\n（作用：给智能体提供不同种类的工具以增强其能力，后接智能体）'
        this.description = 'Chain Tool：授权使用外接链（Chain）的工具，增加智能体使用其他语言模型得到回复数据的能力'
        this.baseClasses = [this.type, ...getBaseClasses(ChainTool)]
        this.inputs = [
            {
                label: '链名称',
                name: 'name',
                type: 'string',
                placeholder: 'state-of-union-qa'
            },
            {
                label: '链作用描述',
                name: 'description',
                type: 'string',
                rows: 3,
                placeholder: '游戏术语QA链：当您需要询问某一游戏术语的含义时，它能帮助到您'
            },
            {
                label: '是否直接返回数据',
                name: 'returnDirect',
                type: 'boolean',
                optional: true
            },
            {
                label: '链',
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

import { ZapierNLAWrapper, ZapiterNLAWrapperParams } from 'langchain/tools'
import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { ZapierToolKit } from 'langchain/agents'

class ZapierNLA_Tools implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Zapier工具'
        this.name = 'zapierNLA'
        this.type = 'Zapier工具'
        this.icon = 'zapier.png'
        this.category = '工具-Tool'
        this.description = "Zapier NLA：授权以自然语言创建并使用Zapier里自动化流程的工具，增加智能体创建和使用自动化流程的能力"
        this.inputs = [
            {
                label: 'Zapier NLA Api Key',
                name: 'apiKey',
                type: 'password'
            }
        ]
        this.baseClasses = [this.type, 'Tool']
    }

    async init(nodeData: INodeData): Promise<any> {
        const apiKey = nodeData.inputs?.apiKey as string

        const obj: Partial<ZapiterNLAWrapperParams> = {
            apiKey
        }
        const zapier = new ZapierNLAWrapper(obj)
        const toolkit = await ZapierToolKit.fromZapierNLAWrapper(zapier)

        return toolkit.tools
    }
}

module.exports = { nodeClass: ZapierNLA_Tools }

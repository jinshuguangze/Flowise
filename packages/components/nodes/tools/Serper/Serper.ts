import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { Serper } from 'langchain/tools'

class Serper_Tools implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Serper工具'
        this.name = 'serper'
        this.type = 'Serper工具'
        this.icon = 'serper.png'
        this.category =
            '工具-Tool\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：给智能体提供不同种类的工具以增强其能力，后接智能体'
        this.description = 'Serper：授权使用Serper去得到谷歌搜索结果的工具，增加智能体联网搜索的能力'
        this.inputs = [
            {
                label: 'Serper Api密匙',
                name: 'apiKey',
                type: 'password'
            }
        ]
        this.baseClasses = [this.type, ...getBaseClasses(Serper)]
    }

    async init(nodeData: INodeData): Promise<any> {
        const apiKey = nodeData.inputs?.apiKey as string
        return new Serper(apiKey)
    }
}

module.exports = { nodeClass: Serper_Tools }

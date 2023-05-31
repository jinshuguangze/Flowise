import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { SerpAPI } from 'langchain/tools'

class SerpAPI_Tools implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'SerpAPI工具'
        this.name = 'serpAPI'
        this.type = 'SerpAPI工具'
        this.icon = 'serp.png'
        this.category = '工具-Tool\n\n（作用：给智能体提供不同种类的工具以增强其能力，后接智能体）'
        this.description = 'SerpAPI：授权使用SerpAPI去得到谷歌搜索结果的工具，增加智能体联网搜索的能力'
        this.inputs = [
            {
                label: 'SerpAPI密匙',
                name: 'apiKey',
                type: 'password'
            }
        ]
        this.baseClasses = [this.type, ...getBaseClasses(SerpAPI)]
    }

    async init(nodeData: INodeData): Promise<any> {
        const apiKey = nodeData.inputs?.apiKey as string
        return new SerpAPI(apiKey)
    }
}

module.exports = { nodeClass: SerpAPI_Tools }

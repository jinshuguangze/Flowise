import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { AIPluginTool } from 'langchain/tools'
import { getBaseClasses } from '../../../src/utils'

class AIPlugin implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs?: INodeParams[]

    constructor() {
        this.label = 'AI插件工具'
        this.name = 'aiPlugin'
        this.type = 'AI插件工具'
        this.icon = 'aiplugin.svg'
        this.category =
            '工具-Tool\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：给智能体提供不同种类的工具以增强其能力，后接智能体'
        this.description = 'AIPlugin：授权使用ChatGPT等AI插件的工具，根据插件的不同增强智能体的各方面能力'
        this.baseClasses = [this.type, ...getBaseClasses(AIPluginTool)]
        this.inputs = [
            {
                label: '插件Url地址',
                name: 'pluginUrl',
                type: 'string',
                placeholder: 'https://www.klarna.com/.well-known/ai-plugin.json'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const pluginUrl = nodeData.inputs?.pluginUrl as string
        const aiplugin = await AIPluginTool.fromPluginUrl(pluginUrl)

        return aiplugin
    }
}

module.exports = { nodeClass: AIPlugin }

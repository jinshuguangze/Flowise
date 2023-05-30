import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { MakeWebhookTool } from './core'

class MakeWebhook_Tools implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Make网页工具'
        this.name = 'makeWebhook'
        this.type = 'Make网页工具'
        this.icon = 'make.png'
        this.category = '工具-Tool'
        this.description = 'Make Webhook：授权使用make.com中的webhook流程工具，增加智能体使用自动化流程的能力'
        this.inputs = [
            {
                label: 'Webhook Url链接',
                name: 'url',
                type: 'string',
                placeholder: 'https://hook.eu1.make.com/abcdefg'
            },
            {
                label: '工具作用描述',
                name: 'desc',
                type: 'string',
                rows: 4,
                placeholder: '一个帮你自动发送邮件的工具'
            }
        ]
        this.baseClasses = [this.type, ...getBaseClasses(MakeWebhookTool)]
    }

    async init(nodeData: INodeData): Promise<any> {
        const url = nodeData.inputs?.url as string
        const desc = nodeData.inputs?.desc as string

        return new MakeWebhookTool(url, desc, 'GET')
    }
}

module.exports = { nodeClass: MakeWebhook_Tools }

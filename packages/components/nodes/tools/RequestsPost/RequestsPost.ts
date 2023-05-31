import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { RequestParameters, desc, RequestsPostTool } from './core'

class RequestsPost_Tools implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'POST请求工具'
        this.name = 'requestsPost'
        this.type = 'POST请求工具'
        this.icon = 'requestspost.svg'
        this.category = '工具-Tool\n\n（作用：给智能体提供不同种类的工具以增强其能力，后接智能体）'
        this.description = 'Requests Post：授权使用HTTP POST响应网页的工具，增加智能体一部分网络交互的能力'
        this.baseClasses = [this.type, ...getBaseClasses(RequestsPostTool)]
        this.inputs = [
            {
                label: 'URL链接',
                name: 'url',
                type: 'string',
                description: '智能体将尝试POST此网址链接，如果为空，智能体将使用AI插件（若有）来自己尝试获取此信息',
                additionalParams: true,
                optional: true
            },
            {
                label: 'Body信息',
                name: 'body',
                type: 'json',
                description: 'POST请求的JSON Body，如果为空，智能体将使用AI插件（若有）来自己尝试获取此信息',
                additionalParams: true,
                optional: true
            },
            {
                label: '工具作用描述',
                name: 'description',
                type: 'string',
                rows: 4,
                default: desc,
                description:
                    '使用自然语言向智能体描述，该什么时候使用此POST请求工具，如果为空，智能体将使用AI插件（若有）来自己尝试获取此信息',
                additionalParams: true,
                optional: true
            },
            {
                label: 'Headers信息',
                name: 'headers',
                type: 'json',
                additionalParams: true,
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const headers = nodeData.inputs?.headers as string
        const url = nodeData.inputs?.url as string
        const description = nodeData.inputs?.description as string
        const body = nodeData.inputs?.body as string

        const obj: RequestParameters = {}
        if (url) obj.url = url
        if (description) obj.description = description
        if (headers) {
            const parsedHeaders = typeof headers === 'object' ? headers : JSON.parse(headers)
            obj.headers = parsedHeaders
        }
        if (body) {
            const parsedBody = typeof body === 'object' ? body : JSON.parse(body)
            obj.body = parsedBody
        }

        return new RequestsPostTool(obj)
    }
}

module.exports = { nodeClass: RequestsPost_Tools }

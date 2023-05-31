import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { TextSplitter } from 'langchain/text_splitter'
import { ConfluencePagesLoader, ConfluencePagesLoaderParams } from 'langchain/document_loaders/web/confluence'

class Confluence_DocumentLoaders implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Confluence文件读取器'
        this.name = 'confluence'
        this.type = '文档数据'
        this.icon = 'confluence.png'
        this.category = '数据读取器-DocumentLoader\n\n（作用：读取外部输入的数据，前接文本分割器，后接向量存储器）'
        this.description = `Confluence：从Confluence在线文档中读取数据`
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: '文本分割器',
                name: 'textSplitter',
                type: 'TextSplitter',
                optional: true
            },
            {
                label: '用户名',
                name: 'username',
                type: 'string',
                placeholder: '<CONFLUENCE_USERNAME>'
            },
            {
                label: 'Access Token',
                name: 'accessToken',
                type: 'password',
                placeholder: '<CONFLUENCE_ACCESS_TOKEN>'
            },
            {
                label: '文档根地址',
                name: 'baseUrl',
                type: 'string',
                placeholder: 'https://example.atlassian.net/wiki'
            },
            {
                label: 'Space密匙',
                name: 'spaceKey',
                type: 'string',
                placeholder: '~EXAMPLE362906de5d343d49dcdbae5dEXAMPLE'
            },
            {
                label: '访问速率限制',
                name: 'limit',
                type: 'number',
                default: 0,
                optional: true
            },
            {
                label: '元数据',
                name: 'metadata',
                type: 'json',
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const username = nodeData.inputs?.username as string
        const accessToken = nodeData.inputs?.accessToken as string
        const spaceKey = nodeData.inputs?.spaceKey as string
        const baseUrl = nodeData.inputs?.baseUrl as string
        const limit = nodeData.inputs?.limit as number
        const textSplitter = nodeData.inputs?.textSplitter as TextSplitter
        const metadata = nodeData.inputs?.metadata

        const options: ConfluencePagesLoaderParams = {
            username,
            accessToken,
            baseUrl,
            spaceKey,
            limit
        }

        const loader = new ConfluencePagesLoader(options)

        let docs = []

        if (textSplitter) {
            docs = await loader.loadAndSplit(textSplitter)
        } else {
            docs = await loader.load()
        }

        if (metadata) {
            const parsedMetadata = typeof metadata === 'object' ? metadata : JSON.parse(metadata)
            let finaldocs = []
            for (const doc of docs) {
                const newdoc = {
                    ...doc,
                    metadata: {
                        ...doc.metadata,
                        ...parsedMetadata
                    }
                }
                finaldocs.push(newdoc)
            }
            return finaldocs
        }

        return docs
    }
}

module.exports = { nodeClass: Confluence_DocumentLoaders }

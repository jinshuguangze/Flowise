import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { TextSplitter } from 'langchain/text_splitter'
import { NotionLoader } from 'langchain/document_loaders/fs/notion'

class Notion_DocumentLoaders implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Notion文件夹读取器'
        this.name = 'notionFolder'
        this.type = '文档数据'
        this.icon = 'notion.png'
        this.category = '数据读取器-DocumentLoader'
        this.description = `Notion Folder：从Notion文件夹中读取数据`
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Notion文件夹路径',
                name: 'notionFolder',
                type: 'string',
                description: '获取Notion文件夹路径',
                placeholder: '输入Notion文件夹的路径'
            },
            {
                label: '文本分割器',
                name: 'textSplitter',
                type: 'TextSplitter',
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
        const textSplitter = nodeData.inputs?.textSplitter as TextSplitter
        const notionFolder = nodeData.inputs?.notionFolder as string
        const metadata = nodeData.inputs?.metadata

        const loader = new NotionLoader(notionFolder)
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

module.exports = { nodeClass: Notion_DocumentLoaders }

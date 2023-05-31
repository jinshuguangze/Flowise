import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { TextSplitter } from 'langchain/text_splitter'
import { GithubRepoLoader, GithubRepoLoaderParams } from 'langchain/document_loaders/web/github'

class Github_DocumentLoaders implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Github库读取器'
        this.name = 'github'
        this.type = '文档数据'
        this.icon = 'github.png'
        this.category = '数据读取器-DocumentLoader\n\n（作用：读取外部输入的数据，前接文本分割器，后接向量存储器）'
        this.description = `Github：从Github库中读取数据`
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Github库链接',
                name: 'repoLink',
                type: 'string',
                placeholder: 'https://github.com/hwchase17/langchain'
            },
            {
                label: '库分支',
                name: 'branch',
                type: 'string',
                default: 'main'
            },
            {
                label: 'Access Token',
                name: 'accessToken',
                type: 'password',
                placeholder: '<GITHUB_ACCESS_TOKEN>',
                optional: true
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
        const repoLink = nodeData.inputs?.repoLink as string
        const branch = nodeData.inputs?.branch as string
        const accessToken = nodeData.inputs?.accessToken as string
        const textSplitter = nodeData.inputs?.textSplitter as TextSplitter
        const metadata = nodeData.inputs?.metadata

        const options: GithubRepoLoaderParams = {
            branch,
            recursive: false,
            unknown: 'warn'
        }

        if (accessToken) options.accessToken = accessToken

        const loader = new GithubRepoLoader(repoLink, options)
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

module.exports = { nodeClass: Github_DocumentLoaders }

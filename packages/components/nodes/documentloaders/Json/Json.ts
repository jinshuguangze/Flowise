import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { TextSplitter } from 'langchain/text_splitter'
import { JSONLoader } from 'langchain/document_loaders/fs/json'

class Json_DocumentLoaders implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Json文件读取器'
        this.name = 'jsonFile'
        this.type = '文档数据'
        this.icon = 'json.svg'
        this.category = '数据读取器-DocumentLoader'
        this.description = `Json File：从json格式的文件中读取数据`
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Json文件',
                name: 'jsonFile',
                type: 'file',
                fileType: '.json'
            },
            {
                label: '文本分割器',
                name: 'textSplitter',
                type: 'TextSplitter',
                optional: true
            },
            {
                label: '使用指针提取内容 ',
                name: 'pointersName',
                type: 'string',
                description: '使用多个Json指针提取内容',
                placeholder: '输入指针语法(用逗号隔开多个指针)',
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
        const jsonFileBase64 = nodeData.inputs?.jsonFile as string
        const pointersName = nodeData.inputs?.pointersName as string
        const metadata = nodeData.inputs?.metadata

        let pointers: string[] = []
        if (pointersName) {
            const outputString = pointersName.replace(/[^a-zA-Z0-9,]+/g, ',')
            pointers = outputString.split(',').map((pointer) => '/' + pointer.trim())
        }

        let alldocs = []
        let files: string[] = []

        if (jsonFileBase64.startsWith('[') && jsonFileBase64.endsWith(']')) {
            files = JSON.parse(jsonFileBase64)
        } else {
            files = [jsonFileBase64]
        }

        for (const file of files) {
            const splitDataURI = file.split(',')
            splitDataURI.pop()
            const bf = Buffer.from(splitDataURI.pop() || '', 'base64')
            const blob = new Blob([bf])
            const loader = new JSONLoader(blob, pointers.length != 0 ? pointers : undefined)

            if (textSplitter) {
                const docs = await loader.loadAndSplit(textSplitter)
                alldocs.push(...docs)
            } else {
                const docs = await loader.load()
                alldocs.push(...docs)
            }
        }

        if (metadata) {
            const parsedMetadata = typeof metadata === 'object' ? metadata : JSON.parse(metadata)
            let finaldocs = []
            for (const doc of alldocs) {
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

        return alldocs
    }
}

module.exports = { nodeClass: Json_DocumentLoaders }

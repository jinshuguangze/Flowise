import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { TextSplitter } from 'langchain/text_splitter'
import { CSVLoader } from 'langchain/document_loaders/fs/csv'

class Csv_DocumentLoaders implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Csv文件读取器'
        this.name = 'csvFile'
        this.type = '文档数据'
        this.icon = 'Csv.png'
        this.category =
            '数据读取器-DocumentLoader\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：读取外部输入的数据，前接文本分割器，后接向量存储器'
        this.description = `Csv File：从csv格式的Excel文件中读取数据`
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Csv文件',
                name: 'csvFile',
                type: 'file',
                fileType: '.csv'
            },
            {
                label: '文本分割器',
                name: 'textSplitter',
                type: 'TextSplitter',
                optional: true
            },
            {
                label: '单列提取',
                name: 'columnName',
                type: 'string',
                description: '仅提取表格里的某一列数据',
                placeholder: '输入列名称',
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
        const csvFileBase64 = nodeData.inputs?.csvFile as string
        const columnName = nodeData.inputs?.columnName as string
        const metadata = nodeData.inputs?.metadata

        let alldocs = []
        let files: string[] = []

        if (csvFileBase64.startsWith('[') && csvFileBase64.endsWith(']')) {
            files = JSON.parse(csvFileBase64)
        } else {
            files = [csvFileBase64]
        }

        for (const file of files) {
            const splitDataURI = file.split(',')
            splitDataURI.pop()
            const bf = Buffer.from(splitDataURI.pop() || '', 'base64')
            const blob = new Blob([bf])
            const loader = new CSVLoader(blob, columnName.trim().length === 0 ? undefined : columnName.trim())

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

module.exports = { nodeClass: Csv_DocumentLoaders }

import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { TextSplitter } from 'langchain/text_splitter'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'

class Docx_DocumentLoaders implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Docx文件读取器'
        this.name = 'docxFile'
        this.type = '文档数据'
        this.icon = 'Docx.png'
        this.category =
            '数据读取器-DocumentLoader\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：读取外部输入的数据，前接文本分割器，后接向量存储器'
        this.description = `Docx File：从docx格式的Word文档中读取数据`
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Docx文件',
                name: 'docxFile',
                type: 'file',
                fileType: '.docx'
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
        const docxFileBase64 = nodeData.inputs?.docxFile as string
        const metadata = nodeData.inputs?.metadata

        let alldocs = []
        let files: string[] = []

        if (docxFileBase64.startsWith('[') && docxFileBase64.endsWith(']')) {
            files = JSON.parse(docxFileBase64)
        } else {
            files = [docxFileBase64]
        }

        for (const file of files) {
            const splitDataURI = file.split(',')
            splitDataURI.pop()
            const bf = Buffer.from(splitDataURI.pop() || '', 'base64')
            const blob = new Blob([bf])
            const loader = new DocxLoader(blob)

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

module.exports = { nodeClass: Docx_DocumentLoaders }

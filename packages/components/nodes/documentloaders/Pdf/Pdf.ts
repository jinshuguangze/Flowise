import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { TextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'

class Pdf_DocumentLoaders implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Pdf文件读取器'
        this.name = 'pdfFile'
        this.type = '文档数据'
        this.icon = 'pdf.svg'
        this.category =
            '数据读取器-DocumentLoader\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：读取外部输入的数据，前接文本分割器，后接向量存储器'
        this.description = `PDF File：从pdf格式的文件中读取数据`
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Pdf文件',
                name: 'pdfFile',
                type: 'file',
                fileType: '.pdf'
            },
            {
                label: '文本分割器',
                name: 'textSplitter',
                type: 'TextSplitter',
                optional: true
            },
            {
                label: '使用方式',
                name: 'usage',
                type: 'options',
                options: [
                    {
                        label: '按页生成文档数据',
                        name: 'perPage'
                    },
                    {
                        label: '按文件生成文档数据',
                        name: 'perFile'
                    }
                ],
                default: 'perPage'
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
        const pdfFileBase64 = nodeData.inputs?.pdfFile as string
        const usage = nodeData.inputs?.usage as string
        const metadata = nodeData.inputs?.metadata

        let alldocs = []
        let files: string[] = []

        if (pdfFileBase64.startsWith('[') && pdfFileBase64.endsWith(']')) {
            files = JSON.parse(pdfFileBase64)
        } else {
            files = [pdfFileBase64]
        }

        for (const file of files) {
            const splitDataURI = file.split(',')
            splitDataURI.pop()
            const bf = Buffer.from(splitDataURI.pop() || '', 'base64')
            if (usage === 'perFile') {
                const loader = new PDFLoader(new Blob([bf]), {
                    splitPages: false,
                    // @ts-ignore
                    pdfjs: () => import('pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js')
                })
                if (textSplitter) {
                    const docs = await loader.loadAndSplit(textSplitter)
                    alldocs.push(...docs)
                } else {
                    const docs = await loader.load()
                    alldocs.push(...docs)
                }
            } else {
                // @ts-ignore
                const loader = new PDFLoader(new Blob([bf]), { pdfjs: () => import('pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js') })
                if (textSplitter) {
                    const docs = await loader.loadAndSplit(textSplitter)
                    alldocs.push(...docs)
                } else {
                    const docs = await loader.load()
                    alldocs.push(...docs)
                }
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

module.exports = { nodeClass: Pdf_DocumentLoaders }

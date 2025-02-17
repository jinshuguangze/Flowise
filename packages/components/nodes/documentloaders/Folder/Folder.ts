import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { TextSplitter } from 'langchain/text_splitter'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'

class Folder_DocumentLoaders implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '文件夹读取器'
        this.name = 'folderFiles'
        this.type = '文档数据'
        this.icon = 'folder.svg'
        this.category =
            '数据读取器-DocumentLoader\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：读取外部输入的数据，前接文本分割器，后接向量存储器'
        this.description = `Folder Files：从文件夹中读取所有文件的数据`
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: '文件夹路径',
                name: 'folderPath',
                type: 'string',
                placeholder: ''
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
        const folderPath = nodeData.inputs?.folderPath as string
        const metadata = nodeData.inputs?.metadata

        const loader = new DirectoryLoader(folderPath, {
            '.json': (path) => new JSONLoader(path),
            '.txt': (path) => new TextLoader(path),
            '.csv': (path) => new CSVLoader(path),
            '.docx': (path) => new DocxLoader(path),
            // @ts-ignore
            '.pdf': (path) => new PDFLoader(path, { pdfjs: () => import('pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js') })
        })
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

module.exports = { nodeClass: Folder_DocumentLoaders }

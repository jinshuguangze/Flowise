import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { RecursiveCharacterTextSplitter, RecursiveCharacterTextSplitterParams } from 'langchain/text_splitter'

class RecursiveCharacterTextSplitter_TextSplitters implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '递归字符分割器'
        this.name = 'recursiveCharacterTextSplitter'
        this.type = '递归字符分割器'
        this.icon = 'textsplitter.svg'
        this.category = '文本分割器-TextSplitter'
        this.description = `按顺序地使用字符列表里的字符分割文档，直到每个分割后的文档块符合大小，默认情况下，字符列表为["\\n\\n", "\\n", " "]，此分割器适用于一般性的文档内容分割`
        this.baseClasses = [this.type, ...getBaseClasses(RecursiveCharacterTextSplitter)]
        this.inputs = [
            {
                label: '文档块大小',
                name: 'chunkSize',
                type: 'number',
                default: 1000,
                optional: true
            },
            {
                label: '文档块重叠',
                name: 'chunkOverlap',
                type: 'number',
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const chunkSize = nodeData.inputs?.chunkSize as string
        const chunkOverlap = nodeData.inputs?.chunkOverlap as string

        const obj = {} as RecursiveCharacterTextSplitterParams

        if (chunkSize) obj.chunkSize = parseInt(chunkSize, 10)
        if (chunkOverlap) obj.chunkOverlap = parseInt(chunkOverlap, 10)

        const splitter = new RecursiveCharacterTextSplitter(obj)

        return splitter
    }
}

module.exports = { nodeClass: RecursiveCharacterTextSplitter_TextSplitters }

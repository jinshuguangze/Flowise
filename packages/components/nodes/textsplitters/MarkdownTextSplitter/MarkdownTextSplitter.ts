import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { MarkdownTextSplitter, MarkdownTextSplitterParams } from 'langchain/text_splitter'

class MarkdownTextSplitter_TextSplitters implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Markdown分割器'
        this.name = 'markdownTextSplitter'
        this.type = 'Markdown分割器'
        this.icon = 'markdownTextSplitter.svg'
        this.category = '文本分割器-TextSplitter'
        this.description = `Markdown Text Splitter：使用Markdown标题格式，对文档进行分割，此分割器适用于Markdown文档的分割`
        this.baseClasses = [this.type, ...getBaseClasses(MarkdownTextSplitter)]
        this.inputs = [
            {
                label: 'Chunk Size',
                name: 'chunkSize',
                type: 'number',
                default: 1000,
                optional: true
            },
            {
                label: 'Chunk Overlap',
                name: 'chunkOverlap',
                type: 'number',
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const chunkSize = nodeData.inputs?.chunkSize as string
        const chunkOverlap = nodeData.inputs?.chunkOverlap as string

        const obj = {} as MarkdownTextSplitterParams

        if (chunkSize) obj.chunkSize = parseInt(chunkSize, 10)
        if (chunkOverlap) obj.chunkOverlap = parseInt(chunkOverlap, 10)

        const splitter = new MarkdownTextSplitter(obj)

        return splitter
    }
}

module.exports = { nodeClass: MarkdownTextSplitter_TextSplitters }

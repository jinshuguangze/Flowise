import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { CharacterTextSplitter, CharacterTextSplitterParams } from 'langchain/text_splitter'

class CharacterTextSplitter_TextSplitters implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '字符分割器'
        this.name = 'characterTextSplitter'
        this.type = '字符分割器'
        this.icon = 'textsplitter.svg'
        this.category = '文本分割器-TextSplitter'
        this.description = `Character Text Splitter：仅使用一种字符将文档进行分割，默认为"\\n\\n"，此分割器适用于内容格式较为标准化的文档进行自定义分割`
        this.baseClasses = [this.type, ...getBaseClasses(CharacterTextSplitter)]
        this.inputs = [
            {
                label: '分割字符',
                name: 'separator',
                type: 'string',
                optional: true
            },
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
        const separator = nodeData.inputs?.separator as string
        const chunkSize = nodeData.inputs?.chunkSize as string
        const chunkOverlap = nodeData.inputs?.chunkOverlap as string

        const obj = {} as CharacterTextSplitterParams

        if (separator) obj.separator = separator
        if (chunkSize) obj.chunkSize = parseInt(chunkSize, 10)
        if (chunkOverlap) obj.chunkOverlap = parseInt(chunkOverlap, 10)

        const splitter = new CharacterTextSplitter(obj)

        return splitter
    }
}

module.exports = { nodeClass: CharacterTextSplitter_TextSplitters }

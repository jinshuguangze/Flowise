import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { TokenTextSplitter, TokenTextSplitterParams } from 'langchain/text_splitter'
import { TiktokenEncoding } from '@dqbd/tiktoken'

class TokenTextSplitter_TextSplitters implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Token分割器'
        this.name = 'tokenTextSplitter'
        this.type = 'Token分割器'
        this.icon = 'tiktoken.svg'
        this.category =
            '文本分割器-TextSplitter\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：提供不同分割策略将文档数据分割成文档块，后接数据读取器'
        this.description = `Token Text Splitter：现将原始文档内容编码为Token格式，然后将Token分割成固定大小的块后，再将Token解码回文档，适用于需要严格控制文档块大小的场景`
        this.baseClasses = [this.type, ...getBaseClasses(TokenTextSplitter)]
        this.inputs = [
            {
                label: '编码器模型',
                name: 'encodingName',
                type: 'options',
                options: [
                    {
                        label: 'gpt2',
                        name: 'gpt2'
                    },
                    {
                        label: 'r50k_base',
                        name: 'r50k_base'
                    },
                    {
                        label: 'p50k_base',
                        name: 'p50k_base'
                    },
                    {
                        label: 'p50k_edit',
                        name: 'p50k_edit'
                    },
                    {
                        label: 'cl100k_base',
                        name: 'cl100k_base'
                    }
                ],
                default: 'gpt2'
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
        const encodingName = nodeData.inputs?.encodingName as string
        const chunkSize = nodeData.inputs?.chunkSize as string
        const chunkOverlap = nodeData.inputs?.chunkOverlap as string

        const obj = {} as TokenTextSplitterParams

        obj.encodingName = encodingName as TiktokenEncoding
        if (chunkSize) obj.chunkSize = parseInt(chunkSize, 10)
        if (chunkOverlap) obj.chunkOverlap = parseInt(chunkOverlap, 10)

        const splitter = new TokenTextSplitter(obj)

        return splitter
    }
}

module.exports = { nodeClass: TokenTextSplitter_TextSplitters }

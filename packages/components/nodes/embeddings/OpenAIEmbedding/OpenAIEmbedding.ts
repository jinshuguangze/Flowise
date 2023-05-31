import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { OpenAIEmbeddings, OpenAIEmbeddingsParams } from 'langchain/embeddings/openai'

class OpenAIEmbedding_Embeddings implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'OpenAI向量化模型'
        this.name = 'openAIEmbeddings'
        this.type = 'OpenAI向量化模型'
        this.icon = 'openai.png'
        this.category = '向量化模型-Embedding\n\n（作用：将文本转化为向量，后续进行向量的储存和比对，后接向量存储器）'
        this.description = 'OpenAI Embeddings：使用OpenAI的向量化模型，给定文本输出向量'
        this.baseClasses = [this.type, ...getBaseClasses(OpenAIEmbeddings)]
        this.inputs = [
            {
                label: 'OpenAI Api密匙',
                name: 'openAIApiKey',
                type: 'password'
            },
            {
                label: '每行去除首尾空格',
                name: 'stripNewLines',
                type: 'boolean',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Batch Size',
                name: 'batchSize',
                type: 'number',
                optional: true,
                description: '单次调用时最大文档数据请求数量，默认为最大值2048',
                additionalParams: true
            },
            {
                label: '超时时长',
                name: 'timeout',
                type: 'number',
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const openAIApiKey = nodeData.inputs?.openAIApiKey as string
        const stripNewLines = nodeData.inputs?.stripNewLines as boolean
        const batchSize = nodeData.inputs?.batchSize as string
        const timeout = nodeData.inputs?.timeout as string

        const obj: Partial<OpenAIEmbeddingsParams> & { openAIApiKey?: string } = {
            openAIApiKey
        }

        if (stripNewLines) obj.stripNewLines = stripNewLines
        if (batchSize) obj.batchSize = parseInt(batchSize, 10)
        if (timeout) obj.timeout = parseInt(timeout, 10)

        const model = new OpenAIEmbeddings(obj)
        return model
    }
}

module.exports = { nodeClass: OpenAIEmbedding_Embeddings }

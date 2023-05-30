import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { HuggingFaceInferenceEmbeddings, HuggingFaceInferenceEmbeddingsParams } from 'langchain/embeddings/hf'

class HuggingFaceInferenceEmbedding_Embeddings implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'HuggingFace向量化模型'
        this.name = 'huggingFaceInferenceEmbeddings'
        this.type = 'HuggingFace向量化模型'
        this.icon = 'huggingface.png'
        this.category = '向量化模型-Embedding'
        this.description = 'HuggingFace Inference Embeddings：使用HuggingFace社区里的向量化模型，给定文本输出向量'
        this.baseClasses = [this.type, ...getBaseClasses(HuggingFaceInferenceEmbeddings)]
        this.inputs = [
            {
                label: 'HuggingFace Api密匙',
                name: 'apiKey',
                type: 'password'
            },
            {
                label: '向量化模型名称',
                name: 'modelName',
                type: 'string',
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const apiKey = nodeData.inputs?.apiKey as string
        const modelName = nodeData.inputs?.modelName as string

        const obj: Partial<HuggingFaceInferenceEmbeddingsParams> = {
            apiKey
        }

        if (modelName) obj.model = modelName

        const model = new HuggingFaceInferenceEmbeddings(obj)
        return model
    }
}

module.exports = { nodeClass: HuggingFaceInferenceEmbedding_Embeddings }

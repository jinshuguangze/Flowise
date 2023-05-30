import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { CohereEmbeddings, CohereEmbeddingsParams } from 'langchain/embeddings/cohere'

class CohereEmbedding_Embeddings implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Cohere向量化模型'
        this.name = 'cohereEmbeddings'
        this.type = 'Cohere向量化模型'
        this.icon = 'cohere.png'
        this.category = '向量化模型-Embedding'
        this.description = 'Cohere Embeddings：使用Cohere的向量化模型，给定文本输出向量'
        this.baseClasses = [this.type, ...getBaseClasses(CohereEmbeddings)]
        this.inputs = [
            {
                label: 'Cohere API密匙',
                name: 'cohereApiKey',
                type: 'password'
            },
            {
                label: '向量化模型选择',
                name: 'modelName',
                type: 'options',
                options: [
                    {
                        label: 'embed-english-v2.0',
                        name: 'embed-english-v2.0'
                    },
                    {
                        label: 'embed-english-light-v2.0',
                        name: 'embed-english-light-v2.0'
                    },
                    {
                        label: 'embed-multilingual-v2.0',
                        name: 'embed-multilingual-v2.0'
                    }
                ],
                default: 'embed-english-v2.0',
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const apiKey = nodeData.inputs?.cohereApiKey as string
        const modelName = nodeData.inputs?.modelName as string

        const obj: Partial<CohereEmbeddingsParams> & { apiKey?: string } = {
            apiKey
        }

        if (modelName) obj.modelName = modelName

        const model = new CohereEmbeddings(obj)
        return model
    }
}

module.exports = { nodeClass: CohereEmbedding_Embeddings }

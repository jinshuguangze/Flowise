import { AzureOpenAIInput } from 'langchain/chat_models/openai'
import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { OpenAIEmbeddings, OpenAIEmbeddingsParams } from 'langchain/embeddings/openai'

class AzureOpenAIEmbedding_Embeddings implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Azure版OpenAI向量化模型'
        this.name = 'azureOpenAIEmbeddings'
        this.type = 'Azure版OpenAI向量化模型'
        this.icon = 'Azure.svg'
        this.category =
            '向量化模型-Embedding\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：将文本转化为向量，后续进行向量的储存和比对，后接向量存储器'
        this.description = 'Azure OpenAI Embeddings：使用Azure版OpenAI的向量化模型，给定文本输出向量'
        this.baseClasses = [this.type, ...getBaseClasses(OpenAIEmbeddings)]
        this.inputs = [
            {
                label: 'Azure OpenAI Api密匙',
                name: 'azureOpenAIApiKey',
                type: 'password'
            },
            {
                label: 'Azure OpenAI Api实例名称',
                name: 'azureOpenAIApiInstanceName',
                type: 'string',
                placeholder: 'YOUR-INSTANCE-NAME'
            },
            {
                label: 'Azure OpenAI Api部署名称',
                name: 'azureOpenAIApiDeploymentName',
                type: 'string',
                placeholder: 'YOUR-DEPLOYMENT-NAME'
            },
            {
                label: 'Azure OpenAI Api版本',
                name: 'azureOpenAIApiVersion',
                type: 'options',
                options: [
                    {
                        label: '2023-03-15-preview',
                        name: '2023-03-15-preview'
                    },
                    {
                        label: '2022-12-01',
                        name: '2022-12-01'
                    }
                ],
                default: '2023-03-15-preview'
            },
            {
                label: 'Batch Size',
                name: 'batchSize',
                type: 'number',
                default: '1',
                optional: true,
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
        const azureOpenAIApiKey = nodeData.inputs?.azureOpenAIApiKey as string
        const azureOpenAIApiInstanceName = nodeData.inputs?.azureOpenAIApiInstanceName as string
        const azureOpenAIApiDeploymentName = nodeData.inputs?.azureOpenAIApiDeploymentName as string
        const azureOpenAIApiVersion = nodeData.inputs?.azureOpenAIApiVersion as string
        const batchSize = nodeData.inputs?.batchSize as string
        const timeout = nodeData.inputs?.timeout as string

        const obj: Partial<OpenAIEmbeddingsParams> & Partial<AzureOpenAIInput> = {
            azureOpenAIApiKey,
            azureOpenAIApiInstanceName,
            azureOpenAIApiDeploymentName,
            azureOpenAIApiVersion
        }

        if (batchSize) obj.batchSize = parseInt(batchSize, 10)
        if (timeout) obj.timeout = parseInt(timeout, 10)

        const model = new OpenAIEmbeddings(obj)
        return model
    }
}

module.exports = { nodeClass: AzureOpenAIEmbedding_Embeddings }

import { INode, INodeData, INodeParams, PromptRetriever, PromptRetrieverInput } from '../../../src/Interface'

class PromptRetriever_Retrievers implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '提示词检索器'
        this.name = 'promptRetriever'
        this.type = '提示词检索器'
        this.icon = 'promptretriever.svg'
        this.category = '检索器-Retriever'
        this.description = 'Prompt Retriever：存储多个带有名称和描述的提示词模版，供多提示词模板链查询'
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Prompt Name',
                name: 'name',
                type: 'string',
                placeholder: 'physics-qa'
            },
            {
                label: 'Prompt Description',
                name: 'description',
                type: 'string',
                rows: 3,
                description: 'Description of what the prompt does and when it should be used',
                placeholder: 'Good for answering questions about physics'
            },
            {
                label: 'Prompt System Message',
                name: 'systemMessage',
                type: 'string',
                rows: 4,
                placeholder: `You are a very smart physics professor. You are great at answering questions about physics in a concise and easy to understand manner. When you don't know the answer to a question you admit that you don't know.`
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const name = nodeData.inputs?.name as string
        const description = nodeData.inputs?.description as string
        const systemMessage = nodeData.inputs?.systemMessage as string

        const obj = {
            name,
            description,
            systemMessage
        } as PromptRetrieverInput

        const retriever = new PromptRetriever(obj)
        return retriever
    }
}

module.exports = { nodeClass: PromptRetriever_Retrievers }

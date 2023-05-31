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
        this.category =
            '检索器-Retriever\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：提供多个资源情况下的检索，前可接向量存储器，后接需要检索器的链或智能体'
        this.description = 'Prompt Retriever：每个提示词检索器可设定一种提示词使用场景，多个提示词检索器输入，可供多提示词模板链进行查询'
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: '提示词名称',
                name: 'name',
                type: 'string',
                placeholder: 'physics-qa'
            },
            {
                label: '提示词作用描述',
                name: 'description',
                type: 'string',
                rows: 3,
                description: '使用自然语言说明提示词的作用，以及应该在何时使用',
                placeholder: '此提示词能够很好地生成都市怪谈类手游的游戏名称'
            },
            {
                label: '提示词前置系统信息',
                name: 'systemMessage',
                type: 'string',
                rows: 4,
                placeholder: `假如你是一名游戏制作人，你现在正在制作一款主题为都市怪谈背景的手游，现在要为这款游戏取个名字，要求简短突出游戏特色，可以适当去扩展概念以达到更加贴合中国人习惯的手游名字，直接输出你认为最合适的五个游戏名即可，不用解释自己为什么选择它们`
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

import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from 'langchain/prompts'

class ChatPromptTemplate_Prompts implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '对话提示词模板'
        this.name = 'chatPromptTemplate'
        this.type = '对话提示词模板'
        this.icon = 'prompt.svg'
        this.category = '提示词模板-Prompt\n\n（作用：提供提示词模版规则编写，后接需要提示词模版的链或提示词检索器）'
        this.description = 'Chat Prompt Template：适用于对话语言模型的提示词模板，用于自定义历史对话，以及格式化输入输出'
        this.baseClasses = [this.type, ...getBaseClasses(ChatPromptTemplate)]
        this.inputs = [
            {
                label: '前置系统信息',
                name: 'systemMessagePrompt',
                type: 'string',
                rows: 4,
                placeholder: `你是一个拥有十年经验的专业翻译者，可以将{input_language} 翻译成 {output_language}`
            },
            {
                label: '人类信息',
                name: 'humanMessagePrompt',
                type: 'string',
                rows: 4,
                placeholder: `{text}`
            },
            {
                label: '设定提示词变量值',
                name: 'promptValues',
                type: 'string',
                rows: 4,
                placeholder: `{
  "input_language": "英语",
  "output_language": "法语"
}`,
                optional: true,
                acceptVariable: true,
                list: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const systemMessagePrompt = nodeData.inputs?.systemMessagePrompt as string
        const humanMessagePrompt = nodeData.inputs?.humanMessagePrompt as string
        const promptValuesStr = nodeData.inputs?.promptValues as string

        const prompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(systemMessagePrompt),
            HumanMessagePromptTemplate.fromTemplate(humanMessagePrompt)
        ])

        let promptValues: ICommonObject = {}
        if (promptValuesStr) {
            promptValues = JSON.parse(promptValuesStr.replace(/\s/g, ''))
        }
        // @ts-ignore
        prompt.promptValues = promptValues

        return prompt
    }
}

module.exports = { nodeClass: ChatPromptTemplate_Prompts }

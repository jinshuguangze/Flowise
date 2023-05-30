import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getInputVariables } from '../../../src/utils'
import { FewShotPromptTemplate, FewShotPromptTemplateInput, PromptTemplate } from 'langchain/prompts'
import { Example } from 'langchain/schema'
import { TemplateFormat } from 'langchain/dist/prompts/template'

class FewShotPromptTemplate_Prompts implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '案例提示词模板'
        this.name = 'fewShotPromptTemplate'
        this.type = '案例提示词模板'
        this.icon = 'prompt.svg'
        this.category = '提示词模板-Prompt'
        this.description = 'Few Shot Prompt Template：适用于查询型单次生成的提示词模版，并添加自定义案例以保证更高质量的输出'
        this.baseClasses = [this.type, ...getBaseClasses(FewShotPromptTemplate)]
        this.inputs = [
            {
                label: '案例',
                name: 'examples',
                type: 'string',
                rows: 4,
                placeholder: `[
  { "word": "开心", "antonym": "悲伤" },
  { "word": "长", "antonym": "短" },
]`
            },
            {
                label: '查询提示词模版（用于输入案例的格式）',
                name: 'examplePrompt',
                type: 'PromptTemplate'
            },
            {
                label: '案例前置信息',
                name: 'prefix',
                type: 'string',
                rows: 4,
                placeholder: `给出每个输入短语的反义词`
            },
            {
                label: '案例后置信息',
                name: 'suffix',
                type: 'string',
                rows: 4,
                placeholder: `短语: {input}\n反义词:`
            },
            {
                label: '案例分隔符号',
                name: 'exampleSeparator',
                type: 'string',
                placeholder: `\n\n`
            },
            {
                label: '模版变量格式',
                name: 'templateFormat',
                type: 'options',
                options: [
                    {
                        label: 'f-string',
                        name: 'f-string'
                    },
                    {
                        label: 'jinja-2',
                        name: 'jinja-2'
                    }
                ],
                default: `f-string`
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const examplesStr = nodeData.inputs?.examples as string
        const prefix = nodeData.inputs?.prefix as string
        const suffix = nodeData.inputs?.suffix as string
        const exampleSeparator = nodeData.inputs?.exampleSeparator as string
        const templateFormat = nodeData.inputs?.templateFormat as TemplateFormat
        const examplePrompt = nodeData.inputs?.examplePrompt as PromptTemplate

        const inputVariables = getInputVariables(suffix)
        const examples: Example[] = JSON.parse(examplesStr.replace(/\s/g, ''))

        try {
            const obj: FewShotPromptTemplateInput = {
                examples,
                examplePrompt,
                prefix,
                suffix,
                inputVariables,
                exampleSeparator,
                templateFormat
            }
            const prompt = new FewShotPromptTemplate(obj)
            return prompt
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = { nodeClass: FewShotPromptTemplate_Prompts }

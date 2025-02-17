import { ICommonObject, INode, INodeData, INodeParams, PromptTemplate } from '../../../src/Interface'
import { getBaseClasses, getInputVariables } from '../../../src/utils'
import { PromptTemplateInput } from 'langchain/prompts'

class PromptTemplate_Prompts implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '查询提示词模板'
        this.name = 'promptTemplate'
        this.type = '查询提示词模板'
        this.icon = 'prompt.svg'
        this.category =
            '提示词模板-Prompt\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：提供提示词模版规则编写，后接需要提示词模版的链或提示词检索器'
        this.description = 'Prompt Template：适用于查询型单次生成的提示词模版'
        this.baseClasses = [...getBaseClasses(PromptTemplate)]
        this.inputs = [
            {
                label: '提示词模版',
                name: 'template',
                type: 'string',
                rows: 4,
                placeholder: `《 {product}》手游的主要玩法是什么?`
            },
            {
                label: '设定提示词变量值',
                name: 'promptValues',
                type: 'string',
                rows: 4,
                placeholder: `{
  "product": "阴阳师"
}`,
                optional: true,
                acceptVariable: true,
                list: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const template = nodeData.inputs?.template as string
        const promptValuesStr = nodeData.inputs?.promptValues as string

        let promptValues: ICommonObject = {}
        if (promptValuesStr) {
            promptValues = JSON.parse(promptValuesStr.replace(/\s/g, ''))
        }

        const inputVariables = getInputVariables(template)

        try {
            const options: PromptTemplateInput = {
                template,
                inputVariables
            }
            const prompt = new PromptTemplate(options)
            prompt.promptValues = promptValues
            return prompt
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = { nodeClass: PromptTemplate_Prompts }

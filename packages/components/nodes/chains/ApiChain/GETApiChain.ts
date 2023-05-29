import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { APIChain } from 'langchain/chains'
import { CustomChainHandler, getBaseClasses } from '../../../src/utils'
import { BaseLanguageModel } from 'langchain/base_language'
import { PromptTemplate } from 'langchain/prompts'

export const API_URL_RAW_PROMPT_TEMPLATE = `You are given the below API Documentation:
{api_docs}
Using this documentation, generate the full API url to call for answering the user question.
You should build the API url in order to get a response that is as short as possible, while still getting the necessary information to answer the question. Pay attention to deliberately exclude any unnecessary pieces of data in the API call.

Question:{question}
API url:`

export const API_RESPONSE_RAW_PROMPT_TEMPLATE =
    'Given this {api_response} response for {api_url}. use the given response to answer this {question}'

class GETApiChain_Chains implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'GET API链'
        this.name = 'getApiChain'
        this.type = 'GET API链'
        this.icon = 'apichain.svg'
        this.category = '链-Chain'
        this.description = 'GET Api Chain：根据API文档去GET网页的链，无上下文记忆'
        this.baseClasses = [this.type, ...getBaseClasses(APIChain)]
        this.inputs = [
            {
                label: '语言模型',
                name: 'model',
                type: 'BaseLanguageModel'
            },
            {
                label: 'API文档',
                name: 'apiDocs',
                type: 'string',
                description:
                    '如果您想了解API文档是什么，请阅读<a target="_blank" href="https://github.com/hwchase17/langchain/blob/master/langchain/chains/api/open_meteo_docs.py">此链接</a>获取更多信息',
                rows: 4
            },
            {
                label: 'Headers信息',
                name: 'headers',
                type: 'json',
                additionalParams: true,
                optional: true
            },
            {
                label: 'URL提示词',
                name: 'urlPrompt',
                type: 'string',
                description: '指导语言模型如何去构建URL的提示词，必须包含 {api_docs} 和 {question} 两个变量',
                default: API_URL_RAW_PROMPT_TEMPLATE,
                rows: 4,
                additionalParams: true
            },
            {
                label: '响应提示词',
                name: 'ansPrompt',
                type: 'string',
                description: '指导语言模型如何去返回API响应的提示词，必须包含 {api_response}, {api_url}, 和 {question} 三个变量',
                default: API_RESPONSE_RAW_PROMPT_TEMPLATE,
                rows: 4,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const apiDocs = nodeData.inputs?.apiDocs as string
        const headers = nodeData.inputs?.headers as string
        const urlPrompt = nodeData.inputs?.urlPrompt as string
        const ansPrompt = nodeData.inputs?.ansPrompt as string

        const chain = await getAPIChain(apiDocs, model, headers, urlPrompt, ansPrompt)
        return chain
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const apiDocs = nodeData.inputs?.apiDocs as string
        const headers = nodeData.inputs?.headers as string
        const urlPrompt = nodeData.inputs?.urlPrompt as string
        const ansPrompt = nodeData.inputs?.ansPrompt as string

        const chain = await getAPIChain(apiDocs, model, headers, urlPrompt, ansPrompt)
        if (options.socketIO && options.socketIOClientId) {
            const handler = new CustomChainHandler(options.socketIO, options.socketIOClientId, 2)
            const res = await chain.run(input, [handler])
            return res
        } else {
            const res = await chain.run(input)
            return res
        }
    }
}

const getAPIChain = async (documents: string, llm: BaseLanguageModel, headers: string, urlPrompt: string, ansPrompt: string) => {
    const apiUrlPrompt = new PromptTemplate({
        inputVariables: ['api_docs', 'question'],
        template: urlPrompt ? urlPrompt : API_URL_RAW_PROMPT_TEMPLATE
    })

    const apiResponsePrompt = new PromptTemplate({
        inputVariables: ['api_docs', 'question', 'api_url', 'api_response'],
        template: ansPrompt ? ansPrompt : API_RESPONSE_RAW_PROMPT_TEMPLATE
    })

    const chain = APIChain.fromLLMAndAPIDocs(llm, documents, {
        apiUrlPrompt,
        apiResponsePrompt,
        verbose: process.env.DEBUG === 'true' ? true : false,
        headers: typeof headers === 'object' ? headers : headers ? JSON.parse(headers) : {}
    })
    return chain
}

module.exports = { nodeClass: GETApiChain_Chains }

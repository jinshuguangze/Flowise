import { BaseLanguageModel } from 'langchain/base_language'
import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { WebBrowser } from 'langchain/tools/webbrowser'
import { Embeddings } from 'langchain/embeddings/base'

class WebBrowser_Tools implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '网页浏览工具'
        this.name = 'webBrowser'
        this.type = '网页浏览工具'
        this.icon = 'webBrowser.svg'
        this.category = '工具-Tool'
        this.description = 'Gives agent the ability to visit a website and extract information'
        this.inputs = [
            {
                label: 'Language Model',
                name: 'model',
                type: 'BaseLanguageModel'
            },
            {
                label: 'Embeddings',
                name: 'embeddings',
                type: 'Embeddings'
            }
        ]
        this.baseClasses = [this.type, ...getBaseClasses(WebBrowser)]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const embeddings = nodeData.inputs?.embeddings as Embeddings

        return new WebBrowser({ model, embeddings })
    }
}

module.exports = { nodeClass: WebBrowser_Tools }

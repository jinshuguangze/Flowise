import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { Embeddings } from 'langchain/embeddings/base'
import { getBaseClasses } from '../../../src/utils'
import { SupabaseLibArgs, SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { createClient } from '@supabase/supabase-js'

class Supabase_Existing_VectorStores implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]
    outputs: INodeOutputsValue[]

    constructor() {
        this.label = 'Supabase读取存储'
        this.name = 'supabaseExistingIndex'
        this.type = 'Supabase向量'
        this.icon = 'supabase.svg'
        this.category =
            '向量存储器-VectorStore\n\n（作用：使用各种方式存储向量，前接文档数据和向量化模型，后接向量检索器，或输出自建检索器直接接链或智能体）'
        this.description = 'Supabase Existing Index：从Supabase数据库里读取已保存的向量存储'
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        this.inputs = [
            {
                label: '向量化模型',
                name: 'embeddings',
                type: 'Embeddings'
            },
            {
                label: 'Supabase API密匙',
                name: 'supabaseApiKey',
                type: 'password'
            },
            {
                label: 'Supabase项目URL链接',
                name: 'supabaseProjUrl',
                type: 'string'
            },
            {
                label: 'Table名称',
                name: 'tableName',
                type: 'string'
            },
            {
                label: 'Query名称',
                name: 'queryName',
                type: 'string'
            },
            {
                label: 'Supabase元数据过滤器',
                name: 'supabaseMetadataFilter',
                type: 'json',
                optional: true,
                additionalParams: true
            }
        ]
        this.outputs = [
            {
                label: 'Supabase向量检索器',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Supabase向量存储器',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(SupabaseVectorStore)]
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const supabaseApiKey = nodeData.inputs?.supabaseApiKey as string
        const supabaseProjUrl = nodeData.inputs?.supabaseProjUrl as string
        const tableName = nodeData.inputs?.tableName as string
        const queryName = nodeData.inputs?.queryName as string
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const supabaseMetadataFilter = nodeData.inputs?.supabaseMetadataFilter
        const output = nodeData.outputs?.output as string

        const client = createClient(supabaseProjUrl, supabaseApiKey)

        const obj: SupabaseLibArgs = {
            client,
            tableName,
            queryName
        }

        if (supabaseMetadataFilter) {
            const metadatafilter = typeof supabaseMetadataFilter === 'object' ? supabaseMetadataFilter : JSON.parse(supabaseMetadataFilter)
            obj.filter = metadatafilter
        }

        const vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, obj)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever()
            return retriever
        } else if (output === 'vectorStore') {
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: Supabase_Existing_VectorStores }

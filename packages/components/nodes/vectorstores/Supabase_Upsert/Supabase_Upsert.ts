import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { Embeddings } from 'langchain/embeddings/base'
import { Document } from 'langchain/document'
import { getBaseClasses } from '../../../src/utils'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { createClient } from '@supabase/supabase-js'

class SupabaseUpsert_VectorStores implements INode {
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
        this.label = 'Supabase更新存储'
        this.name = 'supabaseUpsert'
        this.type = 'Supabase向量'
        this.icon = 'supabase.svg'
        this.category =
            '向量存储器-VectorStore\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：使用各种方式存储向量，前接文档数据和向量化模型，后接向量检索器，链或智能体'
        this.description = 'Supabase Upsert：使用Supabase数据库将文档转化为向量并上传存储'
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        this.inputs = [
            {
                label: '文档数据',
                name: 'document',
                type: 'Document',
                list: true
            },
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
        const docs = nodeData.inputs?.document as Document[]
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const output = nodeData.outputs?.output as string

        const client = createClient(supabaseProjUrl, supabaseApiKey)

        const flattenDocs = docs && docs.length ? docs.flat() : []
        const finalDocs = []
        for (let i = 0; i < flattenDocs.length; i += 1) {
            finalDocs.push(new Document(flattenDocs[i]))
        }

        const vectorStore = await SupabaseVectorStore.fromDocuments(finalDocs, embeddings, {
            client,
            tableName: tableName,
            queryName: queryName
        })

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever()
            return retriever
        } else if (output === 'vectorStore') {
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: SupabaseUpsert_VectorStores }

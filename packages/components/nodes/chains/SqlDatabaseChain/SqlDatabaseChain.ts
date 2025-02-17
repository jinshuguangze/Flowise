import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { SqlDatabaseChain, SqlDatabaseChainInput } from 'langchain/chains'
import { CustomChainHandler, getBaseClasses } from '../../../src/utils'
import { DataSource } from 'typeorm'
import { SqlDatabase } from 'langchain/sql_db'
import { BaseLanguageModel } from 'langchain/base_language'

class SqlDatabaseChain_Chains implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'SQL数据库链'
        this.name = 'sqlDatabaseChain'
        this.type = 'SQL数据库链'
        this.icon = 'sqlchain.svg'
        this.category =
            '链-Chain\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000作用：单一目标的处理中心，前接语言模型等，后可接链工具，作为工具连接在智能体上'
        this.description = 'Sql Database Chain：从SQL数据中单次查询问题的链，无上下文记忆'
        this.baseClasses = [this.type, ...getBaseClasses(SqlDatabaseChain)]
        this.inputs = [
            {
                label: '语言模型',
                name: 'model',
                type: 'BaseLanguageModel'
            },
            {
                label: '数据库',
                name: 'database',
                type: 'options',
                options: [
                    {
                        label: 'SQlite',
                        name: 'sqlite'
                    }
                ],
                default: 'sqlite'
            },
            {
                label: '数据库文件地址',
                name: 'dbFilePath',
                type: 'string',
                placeholder: 'C:/Users/chinook.db'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const databaseType = nodeData.inputs?.database as 'sqlite'
        const model = nodeData.inputs?.model as BaseLanguageModel
        const dbFilePath = nodeData.inputs?.dbFilePath

        const chain = await getSQLDBChain(databaseType, dbFilePath, model)
        return chain
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string> {
        const databaseType = nodeData.inputs?.database as 'sqlite'
        const model = nodeData.inputs?.model as BaseLanguageModel
        const dbFilePath = nodeData.inputs?.dbFilePath

        const chain = await getSQLDBChain(databaseType, dbFilePath, model)
        if (options.socketIO && options.socketIOClientId) {
            const handler = new CustomChainHandler(options.socketIO, options.socketIOClientId)
            const res = await chain.run(input, [handler])
            return res
        } else {
            const res = await chain.run(input)
            return res
        }
    }
}

const getSQLDBChain = async (databaseType: 'sqlite', dbFilePath: string, llm: BaseLanguageModel) => {
    const datasource = new DataSource({
        type: databaseType,
        database: dbFilePath
    })

    const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource
    })

    const obj: SqlDatabaseChainInput = {
        llm,
        database: db,
        verbose: process.env.DEBUG === 'true' ? true : false
    }

    const chain = new SqlDatabaseChain(obj)
    return chain
}

module.exports = { nodeClass: SqlDatabaseChain_Chains }

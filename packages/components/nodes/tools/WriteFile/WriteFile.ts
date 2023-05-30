import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { WriteFileTool } from 'langchain/tools'
import { NodeFileStore } from 'langchain/stores/file/node'

class WriteFile_Tools implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '修改文件工具'
        this.name = 'writeFile'
        this.type = '修改文件工具'
        this.icon = 'writefile.svg'
        this.category = '工具-Tool'
        this.description = 'Write File：授权从磁盘中创建与修改文件的工具，增加智能体修改文件的能力'
        this.baseClasses = [this.type, 'Tool', ...getBaseClasses(WriteFileTool)]
        this.inputs = [
            {
                label: '文件夹根目录',
                name: 'basePath',
                placeholder: `C:\\Users\\User\\Desktop`,
                type: 'string',
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const basePath = nodeData.inputs?.basePath as string
        const store = basePath ? new NodeFileStore(basePath) : new NodeFileStore()
        return new WriteFileTool({ store })
    }
}

module.exports = { nodeClass: WriteFile_Tools }

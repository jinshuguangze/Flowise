import { INode } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { Calculator } from 'langchain/tools/calculator'

class Calculator_Tools implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]

    constructor() {
        this.label = '计算器工具'
        this.name = 'calculator'
        this.type = '计算器工具'
        this.icon = 'calculator.svg'
        this.category = '工具-Tool\n\n（作用：给智能体提供不同种类的工具以增强其能力，后接智能体）'
        this.description = 'Calculator：授权使用一个简单计算器的工具，增强智能体数学计算方面的表现'
        this.baseClasses = [this.type, ...getBaseClasses(Calculator)]
    }

    async init(): Promise<any> {
        return new Calculator()
    }
}

module.exports = { nodeClass: Calculator_Tools }

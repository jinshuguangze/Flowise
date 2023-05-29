// assets
import { IconHierarchy, IconBuildingStore, IconKey } from '@tabler/icons'

// constant
const icons = { IconHierarchy, IconBuildingStore, IconKey }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: '',
    type: 'group',
    children: [
        {
            id: 'chatflows',
            title: '我的Mapp',
            type: 'item',
            url: '/chatflows',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'marketplaces',
            title: '畅游创意工坊',
            type: 'item',
            url: '/marketplaces',
            icon: icons.IconBuildingStore,
            breadcrumbs: true
        },
        {
            id: 'news',
            title: 'AI每日新闻精选',
            type: 'item',
            url: '/news',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'talk',
            title: 'AI交流论坛',
            type: 'item',
            url: '/talk',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'dacongming',
            title: '【Mapp】完全体大聪明',
            type: 'item',
            url: '/dacongming',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'boyfriend',
            title: '【Mapp】模拟男友',
            type: 'item',
            url: '/boyfriend',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'grilfriend',
            title: '【Mapp】模拟女友',
            type: 'item',
            url: '/grilfriend',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'grilfriend',
            title: '【Mapp】批量文档生成',
            type: 'item',
            url: '/grilfriend',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'grilfriend',
            title: '【Mapp】概念文档生成',
            type: 'item',
            url: '/grilfriend',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'grilfriend',
            title: '【Mapp】多语文档翻译',
            type: 'item',
            url: '/grilfriend',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'thing',
            title: 'AIGC委员会事务',
            type: 'item',
            url: '/thing',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'score',
            title: 'AIGC委员会积分公示',
            type: 'item',
            url: '/score',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'apikey',
            title: 'API密匙',
            type: 'item',
            url: '/apikey',
            icon: icons.IconKey,
            breadcrumbs: true
        }
    ]
}

export default dashboard

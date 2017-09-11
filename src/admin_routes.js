import Home from './views/Home.vue'


import BasicSetting from './views/ohter/basic_setting'

export default [
    {
        path: '/admin',
        component: Home,
        name: '其它',
        iconCls: 'fa fa-address-card',
        children: [
            {path: 'basic_setting', component: BasicSetting, name: '基础设置', right: ['ADMIN']}
        ]
    }
]

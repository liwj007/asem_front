import Home from './views/Home.vue'

import FileCheck from './views/nav1/grade/file_check'
import FileCheckDetail from './views/nav1/grade/file_check_detail'
import AwardCheck from './views/nav1/grade/award_check'
import AwardCheckDetail from './views/nav1/grade/award_check_detail'

import WinningRecord from './views/nav1/grade/winning_record.vue'
import WinningRecordDetail from './views/nav1/grade/winning_record_detail.vue'

export default [
    {
        path: '/scholarship',
        component: Home,
        name: '奖学金评定',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            {path: 'application_check', name: '奖学金审核', redirect: {path: 'check/file'}, right: []},
            {path: 'check/file/detail/:id', component: FileCheckDetail, name: '材料审核明细', hidden: true},
            {path: 'check/file', component: FileCheck, name: '材料审核', hidden: true},
            {path: 'check/award', component: AwardCheck, name: '获奖审核', hidden: true},
            {path: 'check/award/detail/:id', component: AwardCheckDetail, name: '获奖审核明细', hidden: true}
        ]
    },
    {
        path: '/scholarship',
        component: Home,
        name: '其它',
        iconCls: 'fa fa-address-card',
        children: [
            {path: 'winning_record', component: WinningRecord, name: '获奖记录', right: []},
            {path: 'winning_record_detail/:id', component: WinningRecordDetail, name: '获奖记录详情', hidden: true}
        ]
    }
]

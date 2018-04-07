import Home from './views/Home.vue'

import ComprehensiveEvaluation from './views/nav3/comprehensive_evaluation_readonly.vue'
import ScholarshipApply from './views/nav1/student/scholarship_apply.vue'
import Publicity from './views/nav1/student/publicity.vue'
import PublicityScholarshipList from './views/nav1/student/publicity_scholarship_list.vue'
import PublicityObjection from  './views/nav1/student/publicity_objection.vue'
import WinningRecord from  './views/nav1/student/winning_record.vue'

export default [
    {
        path: '/student',
        component: Home,
        name: '奖学金评定',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            {path: 'apply', component: ScholarshipApply, name: '奖学金申请', right: []},
            {path: 'publicity_list', component: PublicityScholarshipList, name: '奖学金公示', right: []},
            {path: 'publicity_detail/:id', component: Publicity, name: '奖学金公示名单', hidden: true},
            {path: 'publicity_objection', component: PublicityObjection, name: '异议反馈', hidden: true}
        ]
    },
    {
        path: '/student',
        component: Home,
        name: '其它',
        iconCls: 'fa fa-address-card',
        children: [
            {path: 'evaluation', component: ComprehensiveEvaluation, name: '综合评测', right: []},
            {path: 'winning_record', component: WinningRecord, name: '获奖记录', right: []}
        ]
    }
]

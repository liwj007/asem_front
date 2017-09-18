import Home from './views/Home.vue'
import Manage from './views/nav2/school/manage.vue'

import Setting from './views/nav3/setting.vue'
import ComprehensiveEvaluation from './views/nav3/comprehensive_evaluation.vue'
import EvaluationTime from './views/nav2/school/evaluation_time.vue'



import FileCheck from './views/nav1/school/file_check'
import FileCheckDetail from './views/nav1/school/file_check_detail'
import AwardCheck from './views/nav1/school/award_check'
import AwardCheckDetail from './views/nav1/school/award_check_detail'
import AwardCheckCollegeList from './views/nav1/school/award_check_college_list'


import QuotaAllocation from './views/nav2/school/quota_allocation'
import QuotaApply from './views/nav2/school/quota_apply'
import QuotaBack from './views/nav2/school/quota_back'

import PublicityScholarshipList from './views/nav1/school/publicity_scholarship_list.vue'
import PublicityObjection from  './views/nav1/school/publicity_objection.vue'
import AwardCheckPublicity from './views/nav1/school/award_check_publicity'
import AwardCheckPublicityManage from './views/nav1/school/award_check_publicity_manage'
import Publicity from './views/nav1/school/publicity.vue'

import WinningRecord from './views/nav1/school/winning_record.vue'
import WinningRecordDetail from './views/nav1/school/winning_record_detail.vue'

export default [
    {
        path: '/school',
        component: Home,
        name: '奖学金评定',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            {path: 'application_check', name: '奖学金审核', redirect: {path: 'check/file'}, right: []},
            {path: 'check/file/detail/:id', component: FileCheckDetail, name: '材料审核明细', hidden: true},
            {path: 'check/file', component: FileCheck, name: '材料审核', hidden: true},
            {path: 'publicity_list', component: PublicityScholarshipList, name: '奖学金公示', right: []},
            {path: 'check/award', component: AwardCheck, name: '获奖审核', hidden: true},
            {path: 'publicity_detail/:id', component: Publicity, name: '奖学金公示名单', hidden: true},
            {path: 'check/award/publicity', component: AwardCheckPublicity, name: '公示名单确认', hidden: true},
            {path: 'check/award/publicity_manage', component: AwardCheckPublicityManage, name: '公示范围确认', hidden: true},
            {path: 'publicity_objection', component: PublicityObjection, name: '异议反馈', hidden: true},
            {path: 'check/award/college_list/:id', component: AwardCheckCollegeList, name: '获奖审核学院列表', hidden: true},
            {path: 'check/award/detail/:id/:unitId', component: AwardCheckDetail, name: '获奖审核明细', hidden: true}
        ]
    },
    {
        path: '/school',
        component: Home,
        name: '奖学金管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            {path: 'manage', component: Manage, name: '奖学金维护', right: ['SCHOOL']},
            {path: 'quota', redirect: {path: 'quota/allocation'}, name: '名额分配', right: ['SCHOOL']},
            {path: 'quota/allocation', component: QuotaAllocation, name: '名额分配', hidden: true},
            {path: 'quota/apply', component: QuotaApply, name: '名额申请', hidden: true},
            {path: 'quota/back', component: QuotaBack, name: '名额退回', hidden: true},
            {path: 'time', component: EvaluationTime, name: '评定时间', right: ['SCHOOL']}
        ]
    },
    {
        path: '/school',
        component: Home,
        name: '其它',
        iconCls: 'fa fa-address-card',
        children: [
            {path: 'evaluation', component: ComprehensiveEvaluation, name: '综合评测', right: []},
            {path: 'winning_record', component: WinningRecord, name: '获奖记录', right: []},
            {path: 'winning_record_detail/:id', component: WinningRecordDetail, name: '获奖记录详情', hidden: true},
            // {path: 'message', component: Page6, name: '消息提醒', right: []},
            {path: 'setting', component: Setting, name: '初始设置', right: ['SCHOOL']}
        ]
    }
]

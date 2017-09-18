import Home from './views/Home.vue'
import ManageForCollege from './views/nav2/college/manage_for_college.vue'
import QuotaAllocationCollege from './views/nav2/college/quota_allocation_college'
import QuotaApplyCollege from './views/nav2/college/quota_apply_college'
import QuotaBackCollege from './views/nav2/college/quota_back_college'
import EvaluationTimeCollege from './views/nav2/college/evaluation_time_college.vue'

import FileCheck from './views/nav1/college/file_check'
import FileCheckDetail from './views/nav1/college/file_check_detail'
import AwardCheck from './views/nav1/college/award_check'
import AwardCheckDetail from './views/nav1/college/award_check_detail'
import AwardCheckPublicity from './views/nav1/college/award_check_publicity'
import AwardCheckPublicityManage from './views/nav1/college/award_check_publicity_manage'
import Publicity from './views/nav1/college/publicity.vue'
import PublicityScholarshipList from './views/nav1/college/publicity_scholarship_list.vue'
import PublicityObjection from  './views/nav1/college/publicity_objection.vue'

import WinningRecord from './views/nav1/college/winning_record.vue'
import WinningRecordDetail from './views/nav1/college/winning_record_detail.vue'

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
            {path: 'publicity_list', component: PublicityScholarshipList, name: '奖学金公示', right: []},
            {path: 'check/award', component: AwardCheck, name: '获奖审核', hidden: true},
            {path: 'publicity_detail/:id', component: Publicity, name: '奖学金公示名单', hidden: true},
            {path: 'check/award/publicity', component: AwardCheckPublicity, name: '公示名单确认', hidden: true},
            {path: 'check/award/publicity_manage', component: AwardCheckPublicityManage, name: '公示范围确认', hidden: true},
            {path: 'check/award/detail/:id', component: AwardCheckDetail, name: '获奖审核明细', hidden: true},
            {path: 'publicity_objection', component: PublicityObjection, name: '异议反馈', hidden: true}
        ]
    },
    {
        path: '/college',
        component: Home,
        name: '奖学金管理',
        iconCls: 'fa fa-id-card-o',
        right: ['SPECIAL_INSTRUCTOR'],
        children: [
            {path: 'manage', component: ManageForCollege, name: '奖学金维护', right: ['SPECIAL_INSTRUCTOR']},
            {path: 'quota_college',  redirect: {path: 'quota_college/allocation'}, name: '名额分配', right: ['SPECIAL_INSTRUCTOR']},
            {path: 'quota_college/allocation', component: QuotaAllocationCollege, name: '名额分配', hidden: true},
            {path: 'quota_college/apply', component: QuotaApplyCollege, name: '名额申请', hidden: true},
            {path: 'quota_college/back', component: QuotaBackCollege, name: '名额退回', hidden: true},
            {path: 'time_college', component: EvaluationTimeCollege, name: '评定时间', right: ['SPECIAL_INSTRUCTOR']}
        ]
    },
    {
        path: '/college',
        component: Home,
        name: '其它',
        iconCls: 'fa fa-address-card',
        children: [
            {path: 'winning_record', component: WinningRecord, name: '获奖记录', right: []},
            {path: 'winning_record_detail/:id', component: WinningRecordDetail, name: '获奖记录详情', hidden: true}
        ]
    }
]
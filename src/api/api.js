import axios from 'axios'
import store from '../vuex/store'
import Bus from '../bus'

let base = 'http://127.0.0.1:8080/asem';

axios.defaults.withCredentials = true
axios.defaults.baseURL = base
axios.interceptors.request.use((config) => {
    if (config.params === undefined) {
        config['params'] = {}
    }
    var user = sessionStorage.getItem('user');
    if (user) {
        user = JSON.parse(user);
        config['params']['token'] = user.token
    }
    return config
}, function (error) {
    return Promise.reject(error)
})
axios.interceptors.response.use(
    response => {
        if (response.data.status !== true) {
            Bus.$emit('showError', response.data);
            return Promise.reject(response.data)
        } else {
            return response.data
        }
    },
    error => {
        if (error.response) {
            console.log(error)
        }
        return Promise.reject(error.response)
    })

let querystring = require('querystring')

export const uploadFileURL = 'http://127.0.0.1:8080/asem/files/upload'


export const createOrganization = params => {
    return axios.post(`organization/create`, querystring.stringify(params)).then(res => res.data);
};
export const getOrganization = params => {
    return axios.get(`organization/all`).then(res => res.data);
};
export const deleteOrganization = params => {
    return axios.delete(`organization/delete/` + params.id + '/' + params.type).then(res => res.data);
};
export const loadSelectMajors = params => {
    return axios.get(`organization/majors/` + params.collegeId + '/' + params.gradeId).then(res => res.data);
};

export const loadUsers = params => {
    return axios.get(`users/all`).then(res => res.data);
};
export const deleteUser = params => {
    return axios.delete(`users/delete/` + params.id).then(res => res.data);
};
export const getAllColleges = params => {
    return axios.get(`organization/colleges`).then(res => res.data);
};
export const getAllGrades = params => {
    return axios.get(`organization/grades`).then(res => res.data);
};
export const getUnitForAllocation = params => {
    return axios.get(`organization/allocation`, {params: params}).then(res => res.data);
};

export const userLogin = params => {
    return axios.post(`users/login`, querystring.stringify(params)).then(res => res.data);
};
export const getManageColleges = params => {
    return axios.get(`organization/manage_college`).then(res => res.data);
};


// 奖学金维护
export const createScholarship = params => {
    return axios.post(`scholarships/create`, params).then(res => res.data);
};

export const getPrizeListPage = params => {
    return axios.get(`prizes/list`, {params: params}).then(res => res.data);
};

export const openToStudent = params => {
    return axios.post(`scholarships/open_to_student`, querystring.stringify(params)).then(res => res.data);
};

export const getAllocatedNumberPrizeListPage = params => {
    return axios.get(`prizes/allocated_number_list`, {params: params}).then(res => res.data);
};

export const getAllocatedNumberDetail = params => {
    return axios.get(`prizes/allocated_number_detail`, {params: params}).then(res => res.data);
};

export const getAllocatedTimeDetail = params => {
    return axios.get(`prizes/allocated_time_detail`, {params: params}).then(res => res.data);
};

export const getScholarshipInfo = params => {
    return axios.get(`scholarships/info`, {params: params}).then(res => res.data);
};

export const getCollegeAwardInfo = params => {
    return axios.get(`prizes/college_award_info`, {params: params}).then(res => res.data);
};

export const downloadFile = filenam => {
    let user = JSON.parse(sessionStorage.getItem('user'))
    return window.open(base + '/files/download?token=' + user.token +'&file=' + filenam);
};

export const deleteScholarship = params => {
    return axios.delete(`scholarships/` + params.id).then(res => res.data);
};


export const updateScholarship = params => {
    return axios.post(`scholarships/update`, params).then(res => res.data);
};

export const getScholarshipsForSelect = params => {
    return axios.get(`prizes/selection_for_quota_feedback`, {params: params}).then(res => res.data);
};

export const getUnAllocationNumberPrizeForSelect = params => {
    return axios.get(`prizes/select_list_un_allocation_number`, {params: params}).then(res => res.data);
};


export const getSelectOfUnAllocationTime = params => {
    return axios.get(`prizes/select_list_un_allocation_time`, {params: params}).then(res => res.data);
};


export const allocationNumber = params => {
    return axios.post(`prizes/allocation_number`, params).then(res => res.data);
};

export const updateAllocationNumberAward = params => {
    return axios.post(`prizes/update_allocation_number`, params).then(res => res.data);
};

export const releaseToCollege = params => {
    return axios.post(`prizes/release_to_college`, params).then(res => res.data);
};

export const allocationNumberAwardInfo = params => {
    return axios.get(`prizes/allocation_number_info`, {params: params}).then(res => res.data);
};

export const allocationTime = params => {
    return axios.post(`prizes/allocation_time`, params).then(res => res.data);
};

export const updateAllocationTime = params => {
    return axios.post(`prizes/update_allocation_time`, params).then(res => res.data);
};

export const getAllocatedTimePrizeListPage = params => {
    return axios.get(`prizes/allocated_time_list`, {params: params}).then(res => res.data);
};


// 奖学金初始设置
export const createFlowTemplate = params => {
    return axios.post(`template/create`, querystring.stringify(params)).then(res => res.data);
};
export const getFlowTemplateListPage = params => {
    return axios.get(`template/flow_templates`, {params: params}).then(res => res.data);
};
export const deleteFlowTemplate = params => {
    return axios.delete(`template/` + params.id).then(res => res.data);
};
export const getFlowTemplateList = params => {
    return axios.get(`template/all`).then(res => res.data);
};


//名额反馈
export const applyQuota = params => {
    return axios.post(`prizes/quota_apply`, params).then(res => res.data);
};

export const getQuotaApplyList = params => {
    return axios.get(`prizes/quota_apply_list`, {params: params}).then(res => res.data);
};
export const backQuota = params => {
    return axios.post(`prizes/quota_back`, params).then(res => res.data);
};

export const getQuotaBackList = params => {
    return axios.get(`prizes/quota_back_list`, {params: params}).then(res => res.data);
};

export const getAllQuotaBackList = params => {
    return axios.get(`prizes/all_quota_back_list`, {params: params}).then(res => res.data);
};

export const getAllQuotaApplyList = params => {
    return axios.get(`prizes/all_quota_apply_list`, {params: params}).then(res => res.data);
};

export const checkQuotaApply = params => {
    return axios.post(`prizes/check_quota_apply`, querystring.stringify(params)).then(res => res.data);
};


//综合评测
export const getComprehensiveEvaluationList = params => {
    return axios.get(`setting/comprehensive_evaluation_list`, {params: params}).then(res => res.data);
};

export const uploadComprehensiveEvaluation = params => {
    return axios.post(`setting/upload_comprehensive_evaluation`, params).then(res => res.data);
};

//奖学金申请
export const getPrizeWhichCanSubmit = params => {
    return axios.get(`applications/prize_list`, {params: params}).then(res => res.data);
};

export const createApplication = params => {
    return axios.post(`applications/create`, params).then(res => res.data);
};

export const getMyselfEvaluation = params => {
    return axios.get(`applications/get_evaluation_template`).then(res => res.data);
};

export const getApplicationDetail = params => {
    return axios.get(`applications/info`, {params: params}).then(res => res.data);
};
export const updateApplicationFile = params => {
    return axios.post(`applications/update_file`, params).then(res => res.data);
};
//奖学金材料审核
export const getFileCheckList = params => {
    return axios.get(`applications/prize_for_file_check_list`, {params: params}).then(res => res.data);
};

export const getFileCheckDetailList = params => {
    return axios.get(`applications/prize_for_file_check_detail_list`, {params: params}).then(res => res.data);
};

export const checkFileStatus = params => {
    return axios.post(`applications/check_file_status`, querystring.stringify(params)).then(res => res.data);
};

//奖学金奖项审核
export const getAwardCheckList = params => {
    return axios.get(`applications/prize_for_award_check_list`, {params: params}).then(res => res.data);
};

export const getAwardCheckDetailList = params => {
    return axios.get(`applications/prize_for_award_check_detail_list`, {params: params}).then(res => res.data);
};

export const checkPrizeStatus = params => {
    return axios.post(`applications/check_prize_status`, querystring.stringify(params)).then(res => res.data);
};

export const getCollegePrizeForAwardCheck = params => {
    return axios.get(`applications/prize_for_award_check_college_list`, {params: params}).then(res => res.data);
};

export const getStudentWinningRecord = params => {
    return axios.get(`applications/student_winning_record`, {params: params}).then(res => res.data);
};

export const closeSubmit = params => {
    return axios.post(`applications/close_submit`, querystring.stringify(params)).then(res => res.data);
};

//公示
export const getCollegePublicityList = params => {
    return axios.get(`applications/college_publicity_list`, {params: params}).then(res => res.data);
};

export const getSchoolPublicityList = params => {
    return axios.get(`applications/school_publicity_list`, {params: params}).then(res => res.data);
};

export const getCollegePublicityScholarshipList = params => {
    return axios.get(`applications/college_publicity_scholarship_list`, {params: params}).then(res => res.data);
};

export const getSchoolPublicityScholarshipList = params => {
    return axios.get(`applications/school_publicity_scholarship_list`, {params: params}).then(res => res.data);
};

export const schoolPublicity = params => {
    return axios.post(`applications/school_publicity`, params).then(res => res.data);
};

export const getCollegeMangePublicityList = params => {
    return axios.get(`applications/college_manage_publicity_list`, {params: params}).then(res => res.data);
};

export const getSchoolMangePublicityList = params => {
    return axios.get(`applications/school_manage_publicity_list`, {params: params}).then(res => res.data);
};

export const getMangePublicityDetailList = params => {
    return axios.get(`applications/manage_publicity_detail_list`, {params: params}).then(res => res.data);
};

export const getStudentMangePublicityList = params => {
    return axios.get(`applications/student_manage_publicity_list`, {params: params}).then(res => res.data);
};

export const addObjection = params => {
    return axios.post(`applications/add_objection`, querystring.stringify(params)).then(res => res.data);
};

export const getAllStudentMangePublicityList = params => {
    return axios.get(`applications/all_student_manage_publicity_list`, {params: params}).then(res => res.data);
};

export const getStudentObjections = params => {
    return axios.get(`applications/student_objection`, {params: params}).then(res => res.data);
};

export const feedbackObjection = params => {
    return axios.post(`applications/feedback_objection`, querystring.stringify(params)).then(res => res.data);
};

export const getCollegeObjections = params => {
    return axios.get(`applications/college_objection`, {params: params}).then(res => res.data);
};

export const getSchoolObjections = params => {
    return axios.get(`applications/school_objection`, {params: params}).then(res => res.data);
};


//基础组件
export const getYearSelections = params => {
    return axios.get(`help/year_selection`, {params: params}).then(res => res.data);
};


export const getCollegeSelections = params => {
    return axios.get(`help/college_selection`, {params: params}).then(res => res.data);
};

export const getMajorSelections = params => {
    return axios.get(`help/major_selection`, {params: params}).then(res => res.data);
};

export const getGradeSelections = params => {
    return axios.get(`help/grade_selection`, {params: params}).then(res => res.data);
};




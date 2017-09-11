import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    count: 10,
    token: '',
    token: '',
    modalPageSize: 5,
    pageSize: 10,
    smallPageSize: 5,
    menus: [],
    manageUnit: '',
    manageUnits: []
}

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    SET_TOKEN (state, token) {
        state.token = token
    },
    SET_MENU (state, menus) {
        state.menus = menus
    },
    CLEAR_MENU (state){
        state.menus = []
    },
    SET_MANAGE_UNIT (state, unit) {
        state.manageUnit = unit
    },
    SET_MANAGE_UNITS (state, units) {
        state.manageUnits = units
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})
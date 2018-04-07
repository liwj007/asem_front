import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'

import routes from './routes'

import School from './school_routes'
import College from './college_routes'
import Student from './student_routes'
import Grade from './grade_routes'

import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)


const router = new VueRouter({
  routes
})

let user = JSON.parse(sessionStorage.getItem('user'))
if (user) {
    if (user.userType === 'SCHOOL') {
        store.commit('SET_MENU',School)
        router.addRoutes(School)
    } else if (user.userType === 'COLLEGE') {
        store.commit('SET_MENU',College)
        router.addRoutes(College)
    }else if (user.userType === 'STUDENT'){
        store.commit('SET_MENU',Student)
        router.addRoutes(Student)
    }else if (user.userType === 'GRADE'){
        store.commit('SET_MENU',Grade)
        router.addRoutes(Grade)
    }
}


router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})


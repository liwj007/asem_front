import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '欢迎',
        children: [
            {path: '/main', component: Main, hidden: true}
            ]
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    // ,
    // {
    //     path: '*',
    //     hidden: true,
    //     redirect: {path: '/404'}
    // }
];


export default routes;
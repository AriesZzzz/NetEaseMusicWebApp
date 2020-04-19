import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/home/Home'
import HelloMusic from '@/before-home/HelloMusic'
import BeforeHome from '@/before-home/BeforeHome'

Vue.use(VueRouter)
// 路由独享守卫
// 登录之后，session 中有token，无法查看注册登录页面
const beforeEnter = (to, from, next) => {

  const sessionValue = JSON.parse(window.sessionStorage.getItem('vue-session-key')) || {}
  if (sessionValue.token) {
    next({ path: '/find' })
  } else {
    next()
  }

}

const routes = [
  {
    path: '/',
    redirect: '/hellomusic'
  },
  {
    path: '/beforehome',
    name: 'beforehome',
    component: BeforeHome,
    children: [
      {
        path: '/hellomusic',
        name: 'hellomusic',
        component: HelloMusic,
        beforeEnter
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/before-home/Login'),
        beforeEnter
      },
      {
        path: '/password',
        name: 'password',
        component: () => import('@/before-home/Password'),
        beforeEnter
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@/before-home/Register'),
        beforeEnter
      }
    ]
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/find',
        name: 'find',
        component: () => import('@/home/Find')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/home/My')
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('@/home/Search')
      },
      {
        path: '/account',
        name: 'account',
        component: () => import('@/home/Account')
      },
      {
        path: '/recommendsongs',
        name: 'recommendsongs',
        component: () => import('@/home/RecommendSongs')
      },
      {
        path: '/songlist/:id',
        name: 'songlist',
        component: () => import('@/home/SongList')
      },
      {
        path: '/dragsort/:id',
        name: 'dragsort',
        component: () => import('@/home/DragSort')
      },
      {
        path: '/comment',
        name: 'comment',
        component: () => import('@/home/Comment')
      },
      {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import('@/home/UserInfo')
      },

    ]
  },
  {
    path: '*',
    redirect: '/hellomusic'
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import Empty from '@/views/empty-route-page/index.vue'
import catalogRoutes from './modules/catalog'
import config from '@/config/config'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    redirect: '/home'
  }
  // managementRoutes,
  // catalogRoutes,
  // {
  //   path: '*',
  //   redirect: '/404'
  // }
]

export default new VueRouter({
  mode: config.routerMode as any,
  base: process.env.BASE_URL,
  routes
})

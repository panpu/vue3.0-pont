import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import Empty from '@/views/empty-route-page/index.vue'
const catalogRoutes: RouteConfig = {
  path: '/catalog',
  redirect: '/catalog/catalog-management',
  component: Layout,
  meta: {
    title: '资源目录'
  },
  children: [
    {
      path: 'catalog-management',
      redirect: '/catalog/catalog-management/cataloging',
      component: Empty,
      meta: {
        title: '目录管理'
      },
      children: [
        {
          path: 'cataloging',
          component: () => import('@/views/catalog/catalog-management/cataloging.vue'),
          meta: {
            title: '目录编制'
          }
        },
        {
          path: 'published',
          component: () => import('@/views/catalog/catalog-management/published.vue'),
          meta: {
            title: '已发布目录'
          }
        },
        {
          path: 'revoked',
          component: () => import('@/views/catalog/catalog-management/revoked.vue'),
          meta: {
            title: '已撤销目录'
          }
        }
      ]
    },
    {
      path: 'review',
      component: () => import('@/views/catalog/review.vue'),
      meta: {
        title: '目录审核'
      }
    },
    {
      path: 'release',
      component: () => import('@/views/catalog/release.vue'),
      meta: {
        title: '目录发布'
      }
    },
    {
      path: 'release-review',
      component: () => import('@/views/catalog/release-review.vue'),
      meta: {
        title: '发布审核'
      }
    },
    {
      path: 'audit',
      component: () => import('@/views/catalog/audit.vue'),
      meta: {
        title: '目录审计'
      }
    }
  ]
}
export default catalogRoutes

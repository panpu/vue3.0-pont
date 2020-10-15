import router from '.'

import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import config from '@/config/config'

router.beforeEach(async (to: Route, _: Route, next: any) => {
  if (UserModule.token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (UserModule.roles.length === 0) {
        try {
          await UserModule.GetUserInfo()
          const roles = UserModule.roles
          await PermissionModule.GenerateRoutes(roles)
          const asyncRouter = PermissionModule.dynamicRoutes
          router.addRoutes(asyncRouter)
          next({ ...to, replace: true })
        } catch (err) {
          // Remove token and redirect to login page
          UserModule.REMOVE_TOKEN()
          Message.error(err || 'Has Error')
          if (config.recordRoute) {
            next(`/login?redirect=${to.path}`)
          } else {
            next(`/login`)
          }
        }
      } else {
        next()
      }
    }
  } else {
    if (config.routesWhiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (config.recordRoute) {
        next(`/login?redirect=${to.path}`)
      } else {
        next(`/login`)
      }
    }
  }
})

// router.afterEach((to: Route) => {
//   document.title = to.meta.title
// })

import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import Empty from '@/views/empty-route-page/index.vue'
import _ from 'lodash'
import { Message, MessageBox } from 'element-ui'
// import { asyncRoutes, constantRoutes } from '@/router'
// import routeData from '@/mock/routeData'
import store from '@/store'
// let formatRoute = (data, urlPath) => {
//   let routes: any[] = []
//   for (let item of data) {
//     const hasChild = _.isEmpty(item.children)
//     const path = urlPath + item.path
//     let currentPath = hasChild || path === '/home' ? path : path + '/'
//     let route: any = {
//       path: item.path,
//       children: hasChild ? [] : formatRoute(item.children, currentPath),
//       meta: item.meta
//     }
//     if (item.component === 'layout') {
//       Object.assign(route, {
//         path: path,
//         redirect: hasChild ? currentPath : currentPath + item.children[0].path,
//         component: Layout
//       })
//     } else if (item.component === 'empty') {
//       Object.assign(route, {
//         redirect: hasChild ? currentPath : currentPath + item.children[0].path,
//         component: Empty
//       })
//     } else {
//       Object.assign(route, {
//         component: () => import(`@/${item.component}.vue`)
//       })
//     }

//     routes.push(route)
//   }
//   return routes
// }
let codes: any[] = []
let formatRoute1 = (data, urlPath) => {
  let routes: any[] = []
  for (let item of data) {
    if (item.authorityType === 2) {
      continue
    }
    //判断模块是否有子目录
    const children = item.childrenList || []

    let roles: string[] = []
    for (const val of children) {
      //是否操作类型菜单
      if (val.authorityType === 2) {
        roles.push(val.url)
      }
    }

    const hasChild = item.authorityType === 1 && _.isEmpty(children)
    const path = urlPath + item.url
    let currentPath = hasChild || path + '/'

    let route: any = {
      path: item.url,
      children: hasChild ? [] : formatRoute1(children, currentPath),
      meta: {
        title: item.authorityName,
        icon: item.icon,
        roles: roles
        // hidden: item.state === 0 || true
      }
    }

    //判断是否为顶级模块
    if (!item.parentId && item.authorityType === 1) {
      Object.assign(route, {
        path: path,
        redirect: hasChild ? currentPath : currentPath + children[0].url,
        component: Layout
      })
    } else if (item.parentId && item.authorityType === 1) {
      Object.assign(route, {
        redirect: hasChild ? currentPath : currentPath + children[0].url,
        component: Empty
      })
    } else {
      Object.assign(route, {
        component: () => import(`@/${item.routing}.vue`)
      })
    }

    routes.push(route)
  }

  return routes
}

// const hasPermission = (roles: string[], route: RouteConfig) => {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

// export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[]) => {
//   const res: RouteConfig[] = []
//   routes.forEach(route => {
//     const r = { ...route }
//     if (hasPermission(roles, r)) {
//       if (r.children) {
//         r.children = filterAsyncRoutes(r.children, roles)
//       }
//       res.push(r)
//     }
//   })
//   return res
// }

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []
  public codeKeys: string[] = []

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = routes
    this.dynamicRoutes = routes
  }

  @Mutation
  private SET_KEYS(codeKeys: string[]) {
    this.codeKeys = codeKeys
  }

  @Action
  public GenerateRoutes(roles: string[]) {
    // const rt = formatRoute(routeData, '/')

    return API.manageCenterServer.authority.queryUserVisableList
      .request({})
      .then(result => {
        if (result.code) {
          if (result.data!.length > 0) {
            const routes = formatRoute1(result.data, '/')
            this.SET_ROUTES(routes)
            this.SET_KEYS(codes)
          } else {
            Message({ message: '请配置基础数据', type: 'error', duration: 3 * 1000 })
          }
        }
      })
      .catch(err => {})
    // return API.manageCenterServer.authority.queryAuthority
    //   .request({}, {})
    //   .then(result => {
    //     console.log(2, result)
    //     if (result.code) {
    //       if (result.data!.length > 0) {
    //         console.log(2, result.data, formatRoute1(result.data, '/'))
    //         this.SET_ROUTES(formatRoute1(result.data, '/'))
    //         // this.SET_ROUTES(formatRoute1(result.data, '/'))
    //       } else {
    //         Message({ message: '请配置基础数据', type: 'error', duration: 3 * 1000 })
    //       }
    //     }
    //   })
    //   .catch(err => {})

    //
  }
}

export const PermissionModule = getModule(Permission)

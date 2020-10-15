export default [
  {
    path: 'home',
    component: 'layout',
    meta: {
      title: '首页',
      icon: 'home',
      hidden: true
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: 'views/home/index',
        meta: {
          title: '首页',
          icon: 'home',
          hidden: true
        }
      }
    ]
  },
  {
    path: 'catalog',
    component: 'layout',
    meta: {
      title: '资源目录',
      icon: 'catalog',
      hidden: true
    },
    children: [
      {
        path: 'catalog-management',
        component: 'empty',
        meta: {
          title: '目录管理',
          icon: 'catalog-management',
          hidden: true
        },
        children: [
          {
            path: 'cataloging',
            component: 'views/catalog/catalog-management/cataloging',
            meta: {
              title: '目录编制',
              icon: 'cataloging',
              hidden: true
            }
          },
          {
            path: 'published',
            component: 'views/catalog/catalog-management/published',
            meta: {
              title: '已发布目录',
              icon: 'published',
              hidden: true
            }
          },
          {
            path: 'revoked',
            component: 'views/catalog/catalog-management/revoked',
            meta: {
              title: '已撤销目录',
              icon: 'revoked',
              hidden: true
            }
          }
        ]
      },
      {
        path: 'review',
        component: 'views/catalog/review/index',
        meta: {
          title: '目录审核',
          icon: 'review',
          hidden: true
        }
      },
      {
        path: 'release',
        component: 'views/catalog/release',
        meta: {
          title: '目录发布',
          icon: 'release',
          hidden: true
        }
      },
      {
        path: 'release-review',
        component: 'views/catalog/release-review',
        meta: {
          title: '发布审核',
          icon: 'release-review',
          hidden: true
        }
      },
      {
        path: 'audit',
        component: 'views/catalog/audit/index',
        meta: {
          title: '目录审计',
          icon: 'audit',
          hidden: true
        }
      }
    ]
  },
  {
    path: 'management',
    component: 'layout',
    meta: {
      title: '管理中心',
      icon: 'management',
      hidden: true
    },
    children: [
      {
        path: 'safety',
        component: 'empty',
        meta: {
          title: '安全管理',
          icon: 'safety',
          hidden: true
        },
        children: [
          {
            path: 'roles',
            component: 'views/management/safety/roles/index',
            name: 'Roles',
            meta: {
              title: '角色',
              icon: 'safety',
              hidden: false
            }
          },
          {
            path: 'department',
            component: 'views/management/safety/department/index',
            name: 'Department',
            meta: {
              title: '部门',
              icon: 'safety',
              hidden: true
            }
          },
          {
            path: 'users',
            component: 'views/management/safety/users/index',
            name: 'Users',
            meta: {
              title: '用户',
              icon: 'department',
              hidden: true
            }
          }
        ]
      },
      {
        path: 'system',
        component: 'views/management/system/index',
        meta: {
          title: '系统管理',
          icon: 'system',
          hidden: true
        }
      },
      {
        path: 'front-code',
        component: 'views/management/front-code/index',
        meta: {
          title: '前段码管理',
          icon: 'front-code',
          hidden: true
        }
      },
      {
        path: 'notice',
        component: 'empty',
        meta: {
          title: '通知管理',
          meta: {
            title: '前段码管理',
            icon: 'notice',
            hidden: true
          }
        },
        children: [
          {
            path: 'notice-group',
            component: 'views/management/notice/notice-group',
            name: 'NoticeGroup',
            meta: {
              title: '通知组',
              icon: 'notice-group',
              hidden: true
            }
          },
          {
            path: 'person-info',
            component: 'views/management/notice/person-info',
            name: 'PersonInfo',
            meta: {
              title: '人员信息',
              icon: 'person-info',
              hidden: true
            }
          }
        ]
      }
    ]
  },
  // 新增模块
  {
    path: 'recourse-center',
    component: 'layout',
    meta: {
      title: '资源中心',
      icon: 'management',
      hidden: true
    },
    children: [
      {
        path: 'manage',
        component: 'views/recourse-center/manage/index',
        name: 'manage',
        meta: {
          title: '资源管理',
          icon: 'recourse-center',
          hidden: false
        }
      },
      {
        path: 'audit',
        component: 'views/recourse-center/audit/index',
        name: 'audit',
        meta: {
          title: '资源审核',
          icon: 'recourse-center',
          hidden: false
        }
      },
      {
        path: 'release',
        component: 'views/recourse-center/release/index',
        name: 'release',
        meta: {
          title: '资源发布',
          icon: 'recourse-center',
          hidden: false
        }
      },
      {
        path: 'release-audit',
        component: 'views/recourse-center/release-audit/index',
        name: 'releaseAudit',
        meta: {
          title: '资源发布审核',
          icon: 'recourse-center',
          hidden: false
        }
      },
      {
        path: 'change',
        component: 'views/recourse-center/change/index',
        name: 'change',
        meta: {
          title: '资源变更',
          icon: 'recourse-center',
          hidden: false
        }
      },
      {
        path: 'released',
        component: 'views/recourse-center/released/index',
        name: 'released',
        meta: {
          title: '已发布资源',
          icon: 'recourse-center',
          hidden: false
        }
      },
      {
        path: 'removed',
        component: 'views/recourse-center/removed/index',
        name: 'removed',
        meta: {
          title: '已下架资源',
          icon: 'recourse-center',
          hidden: false
        }
      },
      {
        path: 'comptroller',
        component: 'views/recourse-center/comptroller/index',
        name: 'comptroller',
        meta: {
          title: '资源审计',
          icon: 'recourse-center',
          hidden: false
        }
      }
    ]
  }
]

// export default [
//   {
//     path: 'management',
//     name: 'management',
//     component: 'layout',
//     icon: 'management',
//     children: [
//       {
//         path: 'safety',
//         component: 'empty',
//         name: 'safety',
//         Title: '安全管理',
//         icon: 'icon',
//         children: [
//           {
//             path: 'roles',
//             component: 'views/management/safety/roles',
//             name: 'Roles',
//             title: '角色'
//           },
//           {
//             path: 'department',
//             component: 'views/management/safety/department',
//             name: 'Department',
//             title: '部门'
//           }
//         ]
//       },
//       {
//         path: 'front-code',
//         component: 'views/management/front-code/index',
//         name: 'FrontCode',
//         title: '前段码管理'
//       }
//     ]
//   }
// ]

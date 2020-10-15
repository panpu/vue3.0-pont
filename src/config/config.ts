export default {
  //标题
  title: '数据共享交换枢纽系统',
  // 路由模式，可选值为 history 或 hash
  routerMode: 'hash',
  //不经过token校验的路由
  routesWhiteList: ['/login', '/404', '/401'],
  //token失效回退到登录页时是否记录本次的路由
  recordRoute: true,
  // 默认的接口地址
  baseURL: process.env.VUE_APP_BASE_URL || 'http://124.70.22.19:8002/api/',
  //最长请求时间
  requestTimeout: 5000,
  //token名称
  tokenName: 'Authorization',
  //是否只保持一个子菜单的展开
  uniqueOpened: true,
  // 是否显示导航菜单
  isMenu: true,
  //缓存路由的最大数量
  //   keepAliveMaxNum: 99,

  // 是否提供系统管理删除功能
  isSystemDel: true,
  // 是否提供系统管理新增功能
  isSystemAdd: true,
  // 系统管理模块  是否编辑的字段名称
  isSystemFieldEdit: {
    parentId: true, //父级
    authorityType: true, //类别
    authorityName: true, //名称
    code: true, //编码
    url: true, //URL
    routing: true //路径
  }
}

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCompositionAPI from '@vue/composition-api'
import ElementUi from 'element-ui'

import { PermissionModule } from './store/modules/permission'

import './components'
import './services'
import '@/router/permission'
import '@/router/permission'

import 'normalize.css'
import './styles/element-variables.scss'
import './styles/index.scss'
import './icons/index.ts'

import constants from './config/constants'

Vue.use(VueCompositionAPI)
Vue.use(ElementUi, { size: 'medium' })
Vue.prototype.$constants = constants

//权限按钮
// 调用方法  v-auth="'key'"  key:string
Vue.directive('auth', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el, binding, vnode) {
    //获取当前route的权限code
    const roles = vnode.context?.$route.meta.roles
    console.log(roles, binding.value)
    if (roles.indexOf(binding.value) === -1) {
      el.remove()
    }
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

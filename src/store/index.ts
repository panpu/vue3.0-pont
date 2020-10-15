import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// import { Cataloging } from './modules/catalog/cataloging'
// Declare empty store first, dynamically register all modules later.
// import { LayoutStore } from './modules/layout'
const state = {
  client: {
    height: 0,
    width: 0
  }
}
const mutations = {
  SET_ClIENT_SIZE: (state, obj) => {
    state.client.height = obj.clientHeight
    state.client.width = obj.clientWidth
  }
}
const getters = {
  mainHeight: state => state.client.height - 88
}
export default new Vuex.Store({
  state,
  mutations,
  getters
})

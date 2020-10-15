import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import _ from 'lodash'
import store from '@/store'
function format(data, index) {
  for (let val of data) {
    val.levelKey = index
    if (val.childrenList) {
      const idx = index + 1
      format(val.childrenList, idx)
    }
  }
}
@Module({ dynamic: true, store, name: 'system' })
class System extends VuexModule {
  public menus: defs.manageCenterServer.AuthorityRespDomain[] = []

  get treeMenus() {
    format(this.menus, 0)
    return this.menus
  }

  @Mutation
  private SET_MENUS(data: defs.manageCenterServer.AuthorityRespDomain[]) {
    this.menus = data
  }

  @Action
  public GetMenus(query: defs.manageCenterServer.AuthorityRespDomain) {
    API.manageCenterServer.authority.queryAuthority.request({}, query).then(res => {
      if (res.code) {
        this.SET_MENUS(res.data!)
      }
    })
  }
}

export const SystemModule = getModule(System)

import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import config from '@/config/config'

@Module({ dynamic: true, store, name: 'layout' })
class Layout extends VuexModule {
  isCollapse = !config.isMenu

  @Mutation
  toggleCollaps() {
    this.isCollapse = !this.isCollapse
  }
}

export const LayoutStore = getModule(Layout)

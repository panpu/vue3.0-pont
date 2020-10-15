import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import router from '@/router'

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule {
  token = getStorage('access_token') || ''
  userInfo: defs.manageCenterServer.AddUserDomain = {}
  roles: any[] = []

  @Mutation
  SET_TOKEN(token: string, expires?: number) {
    setStorage('access_token', token, expires)
    this.token = token
  }
  @Mutation
  REMOVE_TOKEN() {
    removeStorage('access_token')
    this.token = ''
    this.roles = []
  }

  @Mutation
  SET_ROLES(roles: string[]) {
    this.roles = roles
  }
  @Mutation
  setUserInfo(info: defs.manageCenterServer.AddUserDomain) {
    this.userInfo = info
  }

  @Action
  async Login(userInfo: defs.oauthServer.LoginDomain) {
    const res: any = await API.oauthServer.oauth.login.request({}, userInfo)

    if (res.code) {
      this.SET_TOKEN(res.data.token_type + ' ' + res.data.access_token, res.data.expires_in)
      const info = await API.manageCenterServer.user.queryInfoById.request({ userId: res.data.userId })
      info.code && this.setUserInfo(info.data!)
      // router.push('/')
    }
    return res
  }

  @Action
  async GetUserInfo() {
    const roles = ['admin'] //模拟数据
    this.SET_ROLES(roles)
  }

  @Action
  async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await API.oauthServer.oauth.removeToken.request({})
    this.REMOVE_TOKEN()
    router.push('/')
  }
}

export const UserModule = getModule(User)

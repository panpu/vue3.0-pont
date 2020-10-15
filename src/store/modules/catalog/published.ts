import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators'
import store from '@/store'
import { Data } from '@/shims-global'

interface DataType {
  [key: string]: any[]
}

@Module({ dynamic: true, store, name: 'published', namespaced: true })
class Published extends VuexModule {
  public treeData: DataType = {
    '1': [],
    '2': [],
    '3': [],
    '4': []
  }
  public lists: any[] = []
  public pages: Data = {}

  @Mutation
  private SET_TREE([data, type]: [any[], string]) {
    this.treeData[type] = data
  }

  @Mutation
  private SET_LISTS(data: Data) {
    this.lists = data.records
    this.pages = {
      current: data.current,
      pages: data.pages,
      size: data.size,
      total: data.total
    }
  }
  //请求已发布目录
  @Action
  public GetTree([query, type]: [API.resourcesCenterServer.cataloging.publishedTree.Params, string]) {
    API.resourcesCenterServer.cataloging.publishedTree.request(query).then(res => {
      if (res.code) {
        this.SET_TREE([res.data as any, type])
      }
    })
  }

  //请求已发布目录列表
  @Action
  public GetCatalogLists(query: API.resourcesCenterServer.cataloging.queryCatalogListByParent.Params) {
    API.resourcesCenterServer.cataloging.queryCatalogListByParent.request(query).then(res => {
      if (res.code) {
        this.SET_LISTS(res.data!)
      }
    })
  }
}

export const PublishedStore = getModule(Published)

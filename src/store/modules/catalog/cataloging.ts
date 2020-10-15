/*
 * @Author: your name
 * @Date: 2020-10-10 09:26:23
 * @LastEditTime: 2020-10-12 16:02:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \exchange-management-web\src\store\modules\catalog\cataloging.ts
 */
import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators'
import store from '@/store'
import { Data } from '@/shims-global'
interface DataType {
  [key: string]: any[]
}

@Module({ dynamic: true, store, name: 'cataloging', namespaced: true })
class Cataloging extends VuexModule {
  public catalogStatusColor = {
    10: '#00BFB5', //已发布
    6: '#FEAD3A', //发布中
    7: '#FD5858', //驳回
    1: '#BDBDBD', //待提交
    2: '#4DA1FF', //审核中
    4: '#4DA1FF', //审核中
    5: '#4DA1FF', //审核中
    9: '#4DA1FF', //审核中
    11: '#4DA1FF', //审核中
    8: '#D06BE4' //发布审核中
  }
  public catalogStatus = {
    10: '已发布', //已发布
    6: '发布中', //发布中
    7: '驳回', //驳回
    1: '待提交', //待提交
    2: '审核中', //审核中
    4: '审核中', //审核中
    5: '审核中', //审核中
    9: '审核中', //审核中
    11: '审核中', //审核中
    8: '发布审核中' //发布审核中
  }
  public treeData: DataType = {
    '1': [],
    '2': [],
    '3': [],
    '4': []
  }
  public releasetreeData: DataType = {
    '1': [],
    '2': [],
    '3': [],
    '4': []
  }
  public lists: any[] = []
  public pages: Data = {
    total: 0
  }

  @Mutation
  private SET_TREE([data, type]: [any[], string]) {
    this.treeData[type] = data
  }
  @Mutation
  private SET_RELEASETREE([data, type]: [any[], string]) {
    this.releasetreeData[type] = data
  }
  @Mutation
  private SET_CATALOG_LISTS(data: Data) {
    this.lists = data.records
    this.pages = {
      current: data.current,
      pages: data.pages,
      size: data.size,
      total: data.total
    }
  }

  @Mutation
  public AddLists(data: Data) {
    this.lists.unshift(data)
  }

  //请求目录树
  @Action
  public GetTree([query, type]: [API.resourcesCenterServer.cataloging.publishedTree.Params, string]) {
    API.resourcesCenterServer.cataloging.queryCatalogingTree.request(query).then(res => {
      if (res.code) {
        this.SET_TREE([res.data as any, type])
      }
    })
  }
  //请求目录树
  @Action
  public releaseTreeList([query, type]: [API.resourcesCenterServer.catalogFlow.releaseTreeList.Params, string]) {
    API.resourcesCenterServer.catalogFlow.releaseTreeList.request({}, query).then(res => {
      if (res.code) {
        this.SET_TREE([res.data as any, type])
      }
    })
  }
  //请求目录列表
  @Action
  public GetLists(query: API.resourcesCenterServer.cataloging.queryCatalogListByParent.Params) {
    API.resourcesCenterServer.cataloging.queryCatalogListByParent.request(query).then(res => {
      if (res.code) {
        this.SET_CATALOG_LISTS(res.data!)
      }
    })
  }
}

export const CatalogStore = getModule(Cataloging)

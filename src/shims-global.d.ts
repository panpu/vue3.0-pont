import Vue from 'vue'
import store from './layout/store'

declare module 'vue/types/vue' {
  interface Vue {
    toggleEdit: typeof store.toggleEdit
  }
}

declare interface Data {
  [key: string]: any
}

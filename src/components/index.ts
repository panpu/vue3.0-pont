import Vue from 'vue'
import * as Vc from './components'

Object.values(Vc).forEach(v => Vue.component(v.name, v))

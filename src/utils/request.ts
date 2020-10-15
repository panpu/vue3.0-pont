import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { getStorage } from './storage'
import config from '@/config/config'
import { UserModule } from '@/store/modules/user'

const service = axios.create({
  baseURL: config.baseURL,
  timeout: config.requestTimeout
})

let token417: any = null

// Request interceptors
service.interceptors.request.use(
  cfg => {
    const token = getStorage('access_token')
    cfg.headers[config.tokenName] = token || 'Basic ' + btoa('web-app:uddCkEAIg46KKwTa2aQKU0zVRxI0r9aD')
    return cfg
  },
  error => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  response => {
    const { code, msg } = response.data
    if (code) {
      Message({ message: msg, type: 'error', duration: 3 * 1000 })
    }
    if (response.headers['content-disposition']) {
      return response
    } else {
      response.data.code = !code
      return response.data
    }
  },
  error => {
    if (error.response?.data?.code == 417) {
      if (!token417) {
        token417 = Message.warning('登录超时,请重新登录。')
        UserModule.REMOVE_TOKEN()
        setTimeout(() => {
          token417 = null
          location.reload()
        }, 500)
      }
    } else {
      Message({ message: error.message, type: 'error', duration: 3 * 1000 })
    }
    return Promise.reject(error)
  }
)

function getUrl(path: string, queryParams: any, method: string) {
  const params = Object.assign({}, queryParams || {})
  const url = path.replace(/\{([^\\}]*(?:\\.[^\\}]*)*)\}/gm, function(match, key) {
    // eslint-disable-next-line no-param-reassign
    key = key.trim()
    if (params[key] !== undefined) {
      const value = params[key]
      delete params[key]
      return value
    }
    console.warn('Please set value for template key: ', key)
    return ''
  })
  const paramStr = Object.keys(params)
    .map(function(key) {
      return params[key] === undefined ? '' : key + '=' + params[key]
    })
    .filter(function(id) {
      return id
    })
    .join('&')
  if (paramStr) {
    return url + '?' + paramStr
  }
  return url
}

const fetch = (url: string, { body, ...cfg }: any = {}) => {
  return service({ url, data: body, ...cfg })
}

export { fetch, getUrl }

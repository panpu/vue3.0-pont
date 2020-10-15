const tag = 'admin_'

type S = object | string | number | any[]

/**
 *
 * @param key 存储的字段名
 * @param value 存储值
 * @param expires 过期时间 ，以秒为单位(1=1s)
 */
export function setStorage(key: string, value: S, expires?: number) {
  if (typeof value !== 'string') {
    value = JSON.stringify({
      [key]: value,
      expires: expires ? Date.now() + expires * 1000 : null
    })
  }
  localStorage.setItem(tag + key, value)
}

/**
 *
 * @param key 字段名
 * @returns key对应的值 | undefined
 */
export function getStorage(key: string) {
  const value = localStorage.getItem(tag + key)
  try {
    if (value) {
      const v = JSON.parse(value)
      if (v.expires && v.expires < Date.now()) {
        removeStorage(key)
        console.error('已过期字段:' + key)
        return undefined
      }
      return v[key]
    }
  } catch (error) {
    return value
  }
}

/**
 * @param key 要删除的字段,
 * @description key 为数组时 删除数组中的每一项 为空时删除全部
 */
export function removeStorage(key?: string | string[]) {
  if (!key) {
    return localStorage.clear()
  }

  Array.isArray(key) ? key.forEach(k => localStorage.removeItem(tag + k)) : localStorage.removeItem(tag + key)
}

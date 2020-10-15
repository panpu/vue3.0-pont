export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validURL(url: string) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

export function validLowerCase(str: string) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

export function validUpperCase(str: string) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

export function validAlphabets(str: string) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function isEmail(email: string) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/* 手机号码正则表达式验证。 */
export function isPhone(phone: string) {
  return /^1[34578]\d{9}$/.test(phone)
}
/* 固定电话号码正则表达式 */
export function isTel(tel: string) {
  return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(tel)
}

/**
 * 提取信息中的网络链接:(h|H)(r|R)(e|E)(f|F) *= *('|")?(\w|\\|\/|\.)+('|"| *|>)?
  提取信息中的邮件地址:\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*
  提取信息中的图片链接:(s|S)(r|R)(c|C) *= *('|")?(\w|\\|\/|\.)+('|"| *|>)?
  提取信息中的IP地址:(\d+)\.(\d+)\.(\d+)\.(\d+)
  提取信息中的中国电话号码（包括移动和固定电话）:(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}
  提取信息中的中国邮政编码:[1-9]{1}(\d+){5}
  提取信息中的中国身份证号码:\d{18}|\d{15}
  提取信息中的整数：\d+
  提取信息中的浮点数（即小数）：(-?\d*)\.?\d+
  提取信息中的任何数字 ：(-?\d*)(\.\d+)?
  提取信息中的中文字符串：[\u4e00-\u9fa5]*
  提取信息中的双字节字符串 (汉字)：[^\x00-\xff]*
 */

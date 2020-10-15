import { JSEncrypt } from 'jsencrypt'

export default function encrypt(password: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(
    '-----BEGIN PUBLIC KEY-----\n' +
      'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCX43sEynn54oqPXmX8Uzuoc6s3u9mL7eoGJQY5\n' +
      'gXQhu58BgoOx6aaDSZgbEVjEGqt9Z9ABRNBjUVCtCM3tOSJqyXpD/MAXnZgsGvY6zUuWWyJcKDLf\n' +
      'V9ckj5AtyZ63ArXm4vDtPBTa2Ag86AaNmUzxeYXP56rkt7F5djVq8zqfOwIDAQAB\n' +
      '-----END PUBLIC KEY-----'
  )
  return encryptor.encrypt(password)
}

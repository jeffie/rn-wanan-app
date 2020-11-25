import Storage from '../storage'

export default class LoginData {
  static STORAGE_USER_INFO = 'LOGIN_USER_INFO'
  static STORAGE_TOKEN_KEY = 'LOGIN_TOKEN'

  static userInfo = null
  static token = null

  static async init() {
    Storage.get(LoginData.STORAGE_USER_INFO).then((userInfo) => {
      LoginData.userInfo = userInfo
    })
    Storage.get(LoginData.STORAGE_TOKEN_KEY).then((token) => {
      LoginData.token = token
    })
  }

  static updateUserInfo(user) {
    LoginData.userInfo = user
    Storage.saveOrUpdate(LoginData.STORAGE_USER_INFO, user)
  }

  static getUserInfo() {
    return LoginData.userInfo
  }

  static updateToken(token) {
    LoginData.token = token
    Storage.saveOrUpdate(LoginData.STORAGE_TOKEN_KEY, token)
  }

  static getToken() {
    return Storage.get(LoginData.STORAGE_TOKEN_KEY).then((token) => {
      token = !token ? LoginData.token : token
      return token
    })
  }

  static clear() {
    LoginData.userInfo = null
    LoginData.token = null
    Storage.delete(LoginData.STORAGE_USER_INFO)
    Storage.delete(LoginData.STORAGE_TOKEN_KEY)
  }
}
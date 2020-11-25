import Storage from '../storage'

export default class BootData {
  static STORAGE_TOKEN_KEY = 'BOOT_KEYSss'
  static hasInit = false

  static async init() {
    Storage.get(BootData.STORAGE_TOKEN_KEY).then((hasInit) => {
      BootData.hasInit = hasInit
    })
  }

  static update(init) {
    BootData.hasInit = init
    Storage.saveOrUpdate(BootData.STORAGE_TOKEN_KEY, init)
  }

  static getInit() {
    return Storage.get(BootData.STORAGE_TOKEN_KEY).then((hasInit) => {
      return hasInit
    })
  }
}
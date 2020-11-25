import Storage from '../storage'

export default class MessageData {
  static STORAGE_TOKEN_KEY = 'MESSAGE_KEY'
  static lastTime = null

  static async init() {
    Storage.get(MessageData.STORAGE_TOKEN_KEY).then((lastTime) => {
      MessageData.lastTime = lastTime
    })
  }

  static update(lastTime) {
    MessageData.lastTime = lastTime
    Storage.saveOrUpdate(MessageData.STORAGE_TOKEN_KEY, lastTime)
  }

  static getLastTime() {
    return Storage.get(MessageData.STORAGE_TOKEN_KEY).then((lastTime) => {
      return lastTime
    })
  }
}
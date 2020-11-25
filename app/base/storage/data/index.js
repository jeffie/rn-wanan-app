import LoginData from './login'
import BootData from './boot'
import MessageData from './message'
import UpgradeData from './upgrade'

export default class Data {

  static async init(callback) {
    await LoginData.init()
    await BootData.init()
    await UpgradeData.init()
    MessageData.init()

    if (callback) {
      callback()
    }
  }

}
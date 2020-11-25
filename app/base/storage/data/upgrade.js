import Storage from '../storage'
import DeviceInfo from 'react-native-device-info'

export default class UpgradeRecord {
  static STORAGE_VERSION_RECORD = 'APP_UPDATE_VERSION1s'

  static record = {
    version: DeviceInfo.getReadableVersion() || '',
    expireAt: 0
  }

  static async init() {
    await Storage.get(UpgradeRecord.STORAGE_VERSION_RECORD).then((record) => {
      if (record) {
        UpgradeRecord.record = record
      }
    })
  }

  static update(version) {
    UpgradeRecord.record = {
      version: version,
      expireAt: UpgradeRecord.getExpireDate()
    }

    Storage.saveOrUpdate(UpgradeRecord.STORAGE_VERSION_RECORD, UpgradeRecord.record)
  }

  static get() {
    const { expireAt } = UpgradeRecord.record.expireAt
    let now = new Date()

    if (expireAt && (new Date(expireAt)) < now) {
      UpgradeRecord.update(Device.getReadableVersion())
    }

    return UpgradeRecord.record
  }

  static getExpireDate() {
    const now = new Date()

    let year = now.getFullYear(),
        month = now.getMonth() + 1,//月份是从0开始的
        day = now.getDate() + 1,
        hour = 0,
        min = 0,
        sec = 0

    let newTime = year + '-' +
        month + '-' +
        day + ' ' +
        hour + ':' +
        min + ':' +
        sec

    return newTime
  }
}
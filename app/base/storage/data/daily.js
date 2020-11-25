import Storage from '../storage'

export default class DailyData {
  static STORAGE_TOKEN_KEY = 'DAILY_DATA1'

  static refreshCache(data) {
    Storage.saveOrUpdate(DailyData.STORAGE_TOKEN_KEY, data)
  }

  static getData() {
    return Storage.get(DailyData.STORAGE_TOKEN_KEY).then((data) => {
      return data
    })
  }
}
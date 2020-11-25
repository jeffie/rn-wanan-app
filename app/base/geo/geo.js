import Geolocation from '@react-native-community/geolocation'

export default class Geo {

  static requestAuth() {
    return Geolocation.requestAuthorization()
  }

  static getPositions() {
    return new Promise((resolve, reject) => {
      try {
        Geolocation.getCurrentPosition(location => {
              longitude = location.coords.longitude //经度
              latitude = location.coords.latitude //纬度

              const addr = latitude + ',' + longitude
              resolve(addr)
            }, error => {
              reject(error)
            },
            { timeout: 2000, maximumAge: 10000 }
        )
      } catch (e) {
        __DEV__ && console.log(e)
        reject(error)
      }
    })
  }
}
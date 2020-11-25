import {
  DeviceEventEmitter

} from 'react-native'

export default class Event {
  static SHOW_APP_TOAST = 'showAppToast'
  static SHOW_APP_LOADING = 'showAppLoading'
  static HOME_LOADING = 'homeLoading'
  static PROFILE_LOADING = 'profileLoading'
  static APP_UPGRADE = 'appUpgrade'


  static listeners = {}

  static addListener (key, eventName, listener) {
    Event.listeners[key] = DeviceEventEmitter.addListener(eventName, (data) => {
      listener(data)
    })
  }

  static removeListener (key) {
    if (Event.listeners[key]) {
      Event.listeners[key].remove()
    }
  }

  static trigger (eventName, param) {
    DeviceEventEmitter.emit(eventName, param)
  }
}
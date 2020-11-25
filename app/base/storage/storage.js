import AsyncStorage from '@react-native-community/async-storage'

export default class Storage {
  static get(key) {
    if (!Array.isArray(key)) {
      return AsyncStorage.getItem(key).then(value => {
        value = value ? JSON.parse(value) : null
        return value
      }).catch((e) => {
        return ''
      })
    } else {
      return AsyncStorage.multiGet(key).then(values => {
        return values.map(value => {
          let ret = value ? JSON.parse(value[1]) : null
          return ret
        })
      }).catch((e) => {
        return ''
      })
    }
  }

  static save(key, value) {
    if (!Array.isArray(key)) {
      return AsyncStorage.setItem(key, JSON.stringify(value))
    } else {
      let pairs = key.map(function(pair) {
        return [pair[0], JSON.stringify(pair[1])]
      })
      return AsyncStorage.multiSet(pairs)
    }
  }

  static update(key, value) {
    return Storage.get(key).then(item => {
      value = typeof value === 'string' ? value : Object.assign({}, item, value)
      return AsyncStorage.setItem(key, JSON.stringify(value))
    })
  }

  static delete(key) {
    if (Array.isArray(key)) {
      return AsyncStorage.multiRemove(key)
    } else {
      return AsyncStorage.removeItem(key)
    }
  }

  static keys() {
    return AsyncStorage.getAllKeys()
  }

  /**
   * Push a value onto an array stored in AsyncStorage by key or create a new array in AsyncStorage for a key if it's not yet defined.
   * @param {String} key They key
   * @param {Any} value The value to push onto the array
   * @return {Promise}
   */
  static push(key, value) {
    return storage.get(key).then((currentValue) => {
      if (currentValue === null) {
        // if there is no current value populate it with the new value
        return storage.save(key, [value])
      }
      if (Array.isArray(currentValue)) {
        return storage.save(key, [...currentValue, value])
      }
      throw new Error(
          `Existing value for key "${key}" must be of type null or Array, received ${typeof currentValue}.`)
    })
  }

  /**
   * save or update  如果key存在则update， 否则，save
   * @param key
   * @param value
   * @returns {Promise.<TResult>|*}
   */
  static saveOrUpdate(key, value) {
    return Storage.delete(key).then((res) => {
      if (value) {
        return Storage.save(key, value)
      }
    })
  }
}
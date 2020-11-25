import React from 'react'
import {
  View,
  Image,
  Text,
  RefreshControl,
  ActivityIndicator

} from 'react-native'
import { Variable } from '../res/style/variable'

export default class UI {
  static refreshControl(callback, parent) {
    return (
        <RefreshControl
            refreshing={(parent.state && parent.state._refreshControl) || false}
            onRefresh={() => UI._refreshControlCallback(callback, parent, true)}
            colors={['#27b5ff', '#1d8eff']}
            tintColor={'#27b5ff'}
            title="正在努力加载中..."
        />
    )
  }

  static refreshControlNoRefresh(callback, parent) {
    return (
        <RefreshControl
            refreshing={(parent.state && parent.state._refreshControl) || false}
            onRefresh={() => UI._refreshControlCallback(callback, parent, false)}
            colors={['#27b5ff', '#1d8eff']}
            tintColor={'#27b5ff'}
            title="正在努力加载中..."
        />
    )
  }

  static _refreshControlCallback(callback, parent, refresh) {
    if (refresh) {
      parent.setState({ _refreshControl: true })
      callback(() => {parent.setState({ _refreshControl: false })})
    } else {
      callback(() => {})
    }
  }

}

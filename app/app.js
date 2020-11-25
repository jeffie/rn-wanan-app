/**
 * wenbo appp by react-native
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { StyleSheet, StatusBar, Platform } from 'react-native'
import Navi from './base/navi/navi'
import { Provider } from 'mobx-react'
import AppToast from './component/toast/toast'
import store from './store/index'
import Storage from './base/storage/data/index'
import LoadingModal from './component/common/modal_loading'
import SplashScreen from 'react-native-splash-screen'

import NavigationService from './base/navi/navi_service'
import appleAuth from '@invertase/react-native-apple-authentication'
import UpgradeModal from './component/upgrade/upgrade_modal'

export default class App extends Component {
  constructor(props) {
    super(props)
    Storage.init()
    SplashScreen.hide()
  }

  componentDidMount() {
    if (appleAuth.isSupported) {
      this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
        NavigationService.naviReset('Login')
      })
    }
  }

  componentWillUnmount() {
    this.authCredentialListener && this.authCredentialListener()
  }

  render() {
    return (
        <Provider {...store}>
          <StatusBar barStyle={'dark-content'}
                     backgroundColor={'#fff'} />
          <Navi ref={(navi) => {NavigationService.setTopLevelNavigator(navi)}} />
          <AppToast />
          <LoadingModal />
          <UpgradeModal />
        </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

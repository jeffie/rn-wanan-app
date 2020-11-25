/**
 * @format
 */
import React, { Component } from 'react'
import 'react-native-gesture-handler'
import { AppRegistry, Platform, Text } from 'react-native'
import App from './app/app'
import { name as appName } from './app.json'
import { LogBox } from 'react-native'

const defaultFontFamily = {
  ...Platform.select({
    android: { fontFamily: '' }
  })
}

const oldRender = Text.render
Text.render = function(...args) {
  const origin = oldRender.call(this, ...args)
  return React.cloneElement(origin, {
    style: [defaultFontFamily, origin.props.style]
  })
}

AppRegistry.registerComponent(appName, () => App)

LogBox.ignoreLogs([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillUpdate is deprecated',
  'Warning: ViewPagerAndroid has been extracted'
])

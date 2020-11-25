import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native'

import { Variable } from '../../res/style/variable'
import BackButton from '../../component/button/back_btn'
import IconFont from '../../component/iconfont/iconfont'

export const BaseNaviHeader = (navigation, title) => {
  const header = {
    headerTransparent: false,
    headerTitleStyle: {
      color: '#333',
      fontSize: Variable.font20,
      fontWeight: '400',
      alignSelf: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    headerStyle: {
      backgroundColor: 'rgba(255,255,255,1)',
      elevation: 1
    },
    headerBackTitleStyle: {},
    headerBackTitle: null,
    title: title,
    headerLeft: () => (
        <BackButton color={'#262626'} onPress={() => {
          if (navigation.state.params && navigation.state.params.callback) {
            navigation.state.params.callback()
          }
          navigation.goBack()
        }} />
    ),
    headerRight: () => <View />
  }

  return header
}

export const MainNaviHeader = (navigation, title) => {
  return {
    ...BaseNaviHeader(navigation, title),
    headerLeft: () => <View />
  }
}

export const SubNaviHeader = (navigation, title) => {
  let nTitle = title
  if (navigation.state.params && navigation.state.params.title) {
    nTitle = navigation.state.params.title
  }

  return {
    ...BaseNaviHeader(navigation, nTitle)
  }
}

export const SubNaviHeaderWithBackHandler = (navigation, title, handler) => {
  return {
    ...SubNaviHeader(navigation, title),
    headerLeft: (
        <BackButton color={Variable.brownish_grey} onPress={() => {
          if (handler) {
            handler(navigation)
          }
        }} />
    )
  }
}

// 自定义右边导航
export const CustomRightNaviHeader = (navigation, title) => {
  let nTitle = title
  if (navigation.state.params && navigation.state.params.title) {
    nTitle = navigation.state.params.title
  }

  let header = {
    ...BaseNaviHeader(navigation, nTitle)
  }
  header.headerRight = () => CustomHeaderRight(navigation)

  return header
}

// 自定义右边导航,左边没有返回键
export const CustomRightNaviNoBackHeader = (navigation, title) => {
  let nTitle = title
  if (navigation.state.params && navigation.state.params.title) {
    nTitle = navigation.state.params.title
  }

  let header = {
    ...BaseNaviHeader(navigation, nTitle)
  }
  header.headerLeft = () => <View />
  header.headerRight = () => CustomHeaderRight(navigation)

  return header
}

const CustomHeaderRight = (navigation) => {
  let text = navigation.state.params.text
  let icon = navigation.state.params.icon
  let disable = navigation.state.params.disable || false

  return (
      <TouchableOpacity
          disabled={disable}
          onPress={() => {
            navigation.state.params.onPress()
          }}
          style={{
            flexDirection: 'row',
            marginRight: 15,
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: 44
          }}
          hitSlop={{ top: 10, left: 50, bottom: 10, right: 10 }}
      >
        {text && <Text style={[
          {
            color: '#333',
            fontSize: Variable.font20
          }, navigation.state.params.textStyle]}>{text}</Text>}
        {icon && <IconFont name={icon} size={Variable.font20}
                           color={disable ? Variable.light_grey : Variable.blue} />}
      </TouchableOpacity>
  )
}
//
export const CustomNaviHeader = (navigation, title) => {
  let nTitle = title
  if (navigation.state.params && navigation.state.params.title) {
    nTitle = navigation.state.params.title
  }

  let header = {
    ...BaseNaviHeader(navigation, nTitle)
  }

  if (!navigation.state.params.headerLeft) {
    header.headerLeft = <View />
  }

  header.headerRight = CustomHeaderRight(navigation)

  return header
}



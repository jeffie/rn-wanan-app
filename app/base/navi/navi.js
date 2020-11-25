import React from 'react'
import {
  StyleSheet
} from 'react-native'
import {
  createAppContainer
} from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { Variable } from '../../res/style/variable'
import TabBarItem from '../../component/tabbar/index'

import * as Router from '../../router'

// 底部tab 样式
const bottomBarStyle = {
  swipeEnabled: false,
  initialRoute: 'Main',
  lazy: true,
  backBehavior: 'none',
  tabBarPosition: 'bottom',
  tabBarOptions: {
    // tabbar上label的style
    labelStyle: {
      fontSize: Variable.font10,
      fontWeight: 'normal'
    },
    // tabbar的style
    style: {
      height: 55,
      paddingBottom: 3,
      backgroundColor: Variable.navi_bg,
      justifyContent: 'center',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#170A32'
    },
    // label和icon的背景色 活跃状态下
    activeBackgroundColor: Variable.navi_bg,
    // label和icon的背景色 不活跃状态下
    inactiveBackgroundColor: Variable.navi_bg,
    // label和icon的前景色 活跃状态下（选中）
    activeTintColor: Variable.white,
    // label和icon的前景色 不活跃状态下(未选中)
    inactiveTintColor: '#5874DC',
    showIcon: true,
    showLabel: true,
    pressOpacity: 0.3
  }
}

// 获取tab 内容
const _buildTabList = () => {
  let tabList = {}
  for (let i in Router.Tabs) {
    let stackName = Router.Tabs[i].Name
    tabList[stackName] = createStackNavigator({
      stackName: Router.Tabs[i].Screen
    })
  }

  return tabList
}

const TabNavigator = createBottomTabNavigator(_buildTabList(),
    {
      defaultNavigationOptions: ({ navigation }) => {
        const { routeName } = navigation.state
        const { Text, Icon, SelectedIcon } = Router.Tabs[routeName]
        return {
          tabBarVisible: routeName !== 'Explore',
          tabBarLabel: Text,
          tabBarIcon: ({ focused, tintColor }) => (
              <TabBarItem
                  name={routeName}
                  focused={focused}
                  icon={Icon}
                  selectedIcon={SelectedIcon}
                  style={{ height: 22, width: 22 }} />
          )
        }
      },
      ...bottomBarStyle
    }
)
// header相关配置需要在这里写
TabNavigator.navigationOptions = ({ navigation }) => {
  return {
    headerShown: false
  }
}

const createStackList = () => {
  const stackList = {
    Main: TabNavigator,
    ...Router.AppStacks
  }
  return stackList
}

const AppNavi = createStackNavigator(createStackList(), {
  initialRouteName: 'Main',
  headerMode: 'screen'
})

export default createAppContainer(AppNavi)


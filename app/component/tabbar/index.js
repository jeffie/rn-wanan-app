/**
 * Created by jeff on 2019/8/21.
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
} from 'react-native'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
import { connect } from 'mobx-react'
import { observer, inject } from 'mobx-react'

class TabBarItem extends Component {

  constructor(props) {
    super(props)
    this.store = this.props.tabBadgeStore //通过props来导入访问已注入的store
    this.state = {}
  }

  render() {
    const { name, focused, icon, selectedIcon } = this.props
    let count = 0
    if (this.store.tabInfo) {
      count = this.store.tabInfo[name] || 0
    }
    let showTips = count > 9 ? '··' : count
    return (
        <View>
          <IconFont
              name={icon} size={Variable.font26}
              color={focused ? '#fff' : '#5874DC'} />
          { count !== 0 &&
          <View style={{
            position: 'absolute',
            right: -7,
            bottom: -2,
            backgroundColor: '#E36B77',
            borderRadius: 7,
            width: 14,
            height: 14,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              color: 'white',
              fontSize: Variable.font9,
              fontWeight: '500'
            }}>{showTips}</Text>
          </View>
          }
        </View>
    )
  }
}

export default inject('tabBadgeStore')(observer(TabBarItem))
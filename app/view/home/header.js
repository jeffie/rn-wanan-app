import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
const hHeight = Platform.OS === 'ios' ? 24 + Variable.statusBarHeight : 60 +
    Variable.statusBarHeight

const emotionMap = [
  require('../../res/image/icon/icon_joy.png'),
  require('../../res/image/icon/icon_angry.png'),
  require('../../res/image/icon/icon_cry.png'),
  require('../../res/image/icon/icon_happy.png'),
  require('../../res/image/icon/icon_sad.png'),
  require('../../res/image/icon/icon_bitter.png')
]
export default class Header extends BaseComponent {
  top = 0

  constructor(props) {
    super(props)
    this.state = {
      iconName: 'DropDown',
      checkedEmotion: -1
    }
    this.handleEModal = this._handleEModal.bind(this)
    this.handleCModal = this._handleCModal.bind(this)
    this.handleAdd = this._handleAdd.bind(this)
  }

  _handleEModal() {
    this.props.onShowEModal(this.top)
    let show = this.state.iconName === 'DropDown'
    this.onSwitch(show, this.state.checkedEmotion)
  }

  _handleCModal() {
    this.props.onShowCModal(this.top)
  }

  _handleAdd() {
    const todayMarked = this.props.todayMarked
    if (todayMarked) {
      this.showMsg('今天的日记已经完成，明天再来记录吧~')
      return
    }

    this.naviTo('AddDaily')
  }

  onSwitch(show, checkedIndex) {
    let name = show ? 'DropUp' : 'DropDown'
    this.setState({
      iconName: name,
      checkedEmotion: checkedIndex
    })
  }

  render() {
    const { checkedEmotion } = this.state
    const emotion = emotionMap[checkedEmotion]

    return (
        <View style={[styles.header, this.props.headerStyle]}>
          <TouchableOpacity onPress={this.handleCModal}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <IconFont name="Calendar" size={Variable.font24} color="#E5E5E5" />
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={this.handleEModal}>
            {checkedEmotion === -1 ? <Text style={styles.title}>全部</Text>
                : <Image source={emotion} style={styles.icon} />
            }
            <IconFont name={this.state.iconName} size={Variable.font12} color="#E5E5E5"
                      onLayout={evt => {
                        let { y } = evt.nativeEvent.layout
                        this.top = y + hHeight
                      }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleAdd}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <IconFont name="Editor" size={Variable.font24} color="#E5E5E5" />
          </TouchableOpacity>
        </View>
    )
  }
}
const styles = StyleSheet.create({
  header: {
    height: hHeight,
    width: Variable.wWdith,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
    paddingTop: Platform.OS === 'ios' ? 0 : 20
  },
  title: {
    fontSize: Variable.font20,
    fontWeight: '400',
    fontFamily: 'PingFang-SC-Regular',
    color: '#E5E5E5',
    marginRight: 4
  },
  icon: {
    height: 26,
    width: 26,
    marginRight: 5
  }
})


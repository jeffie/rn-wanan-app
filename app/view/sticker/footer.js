import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import IconFont from '../../component/iconfont/iconfont'
import { Variable } from '../../res/style/variable'
import LinearGradient from 'react-native-linear-gradient'

export default class Footer extends BaseComponent {
  constructor(props) {
    super(props)
  }

  _onRedirect(target) {
    this.naviTo(target)
  }

  render() {
    return (
        <LinearGradient start={{ x: 1, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        colors={[
                          'rgba(18,18,18,0.7)',
                          'rgba(80,80,80,0.5)',
                          'rgba(223,223,223,0.2)']}
                        style={styles.footer}>
          <TouchableOpacity style={styles.item} onPress={() => this._onRedirect('Home')}>
            <IconFont name="Home" color="rgba(225,225,225,0.7)" size={Variable.font26} />
            <Text style={styles.text}>日记</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => this._onRedirect('Explore')}>
            <IconFont name="Picture" color="rgba(255,255,255,1)" size={Variable.font26} />
            <Text style={[styles.text, { color: 'rgba(255,255,255,1)' }]}>打卡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => this._onRedirect('Profile')}>
            <IconFont name="Profile" color="rgba(255,255,255,0.7)" size={Variable.font26} />
            <Text style={styles.text}>我的</Text>
          </TouchableOpacity>
        </LinearGradient>
    )
  }
}
const styles = StyleSheet.create({
  footer: {
    height: 55 + Variable.bottomSpace,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    width: Variable.wWdith / 3,
    alignItems: 'center'
  },
  text: {
    fontSize: Variable.font10,
    color: 'rgba(255,255,255,0.6)',
    paddingTop: 10
  }
})


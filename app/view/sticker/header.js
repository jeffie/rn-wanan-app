import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
import LinearGradient from 'react-native-linear-gradient'

export default class Header extends BaseComponent {

  constructor(props) {
    super(props)
    this.state = {
      headerStyle: null
    }
    this.showCalendar = this._showCalendar.bind(this)
  }

  _showCalendar() {
    this.props.onShowCalendar()
  }

  handleShare() {
    this.props.onShare()
  }

  componentWillUnmount() {
  }

  render() {
    return (
        <LinearGradient
            start={{ x: 1, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={['rgba(18,18,18,0)', 'rgba(81,80,80,0.3)', 'rgba(223,223,223,0.5)']}>
          <View style={[styles.header, this.props.headerStyle]}>
            <TouchableOpacity onPress={() => {this.naviTo('Home')}}
                              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <IconFont name="Back" size={Variable.font20} color="#E5E5E5" />
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                              onPress={this.showCalendar}>
              <IconFont name="Calendar1" size={Variable.font22} color="#E5E5E5" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleShare()}
                              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <IconFont name="Share" size={Variable.font22} color="#E5E5E5" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
    )
  }
}
const styles = StyleSheet.create({
  header: {
    ...Variable.headerStyle,
    justifyContent: 'space-between'
  }
})


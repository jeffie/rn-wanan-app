import React from 'react'

import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native'

import IconFont from '../iconfont/iconfont'
import { Variable } from '../../res/style/variable'

export default class Countdown extends React.Component {
  count = 60

  constructor(props) {
    super(props)
    this.state = {
      enabled: true
    }
  }

  sendSms() {
    this.props.onSendSms()
  }

  refresh() {
    this.timer = setInterval(() => {
      this.count--
      if (this.count === 0) {
        this.timer && clearInterval(this.timer)
        this.setState({
          enabled: true
        })
        this.count = 10
      } else {
        this.setState({
          enabled: false
        })
      }
    }, 1000)
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  render() {
    const enabled = this.state.enabled
    let text = enabled ? '验证码' : this.count + 's'
    return (
        <TouchableOpacity style={[this.props.style, !enabled && styles.disabled]}
                          onPress={() => this.sendSms()}
                          activeOpacity={!enabled ? 1 : 0.5}
                          disabled={!enabled}>
          <Text style={[this.props.textStyle, !enabled && styles.disabledText]}>{text}</Text>
        </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  disabled: {
    backgroundColor: 'rgba(255,255,255,0.24)'
  },
  disabledText: {
    fontSize: Variable.font16
  }
})
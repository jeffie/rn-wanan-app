import React, { Component } from 'react'

import Toast from './basic_toast'
import Event from '../../base/event/event'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'

export default class AppToast extends BaseComponent {
  position = 'center'
  positionValue = 120
  flag = false

  componentDidMount() {
    Event.addListener('AppToast', Event.SHOW_APP_TOAST, (data) => {
      if (data.msg.position) {
        this.flag = true
        this.position = data.msg.position
        if (data.msg.positionValue) {
          this.positionValue = data.msg.positionValue
        }
        this.refs.appToast.show(data.msg.msg, 3 * 1000)
      } else {
        if (this.flag) {
          this.position = 'bottom'
          this.positionValue = 120
          this.flag = false
        }
        this.refs.appToast.show(data.msg, data.time * 1000)
      }

    })
  }

  componentWillUnmount() {
    Event.removeListener('AppToast')
  }

  render() {
    return (
        <Toast ref="appToast"
               position={this.position}
               positionValue={this.positionValue}
               style={{
                 maxWidth: Variable.wWdith - 40,
                 backgroundColor: '#E5E5E5',
                 paddingHorizontal: 24,
                 paddingVertical: 16
               }}
               opacity={0.95}
               textStyle={{ fontSize: 14, color: '#333' }}
        />
    )
  }
}
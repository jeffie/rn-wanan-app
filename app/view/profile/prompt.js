import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
import Switch from '../../component/checkbox/switch'
import TimePicker from '../../component/picker/time_picker'
import Event from '../../base/event/event'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import XDate from 'xdate'

export default class Prompt extends BaseComponent {
  static navigationOptions = BaseComponent.CustomRightNaviHeader('设置提醒')

  constructor(props) {
    super(props)
    this.state = {
      time: '0:00',
      checked: false,
      loading: true
    }

    this.navi().setParams({
      icon: 'Submit',
      disable: false,
      onPress: this.onSubmit.bind(this)
    })
  }

  componentDidMount() {
    this.request('/member/setting').then(res => {
      if (res.code === 200) {
        let data = res.data || {}
        this.setState({
          id: data.id,
          time: data.time,
          checked: data.status === 1,
          loading: false
        })
      }
    })
  }

  onSwitch(checked) {
    this.setState({
      checked: checked
    })
  }

  onSettingTime() {
    this.TimePicker.open()
  }

  onCancel() {
    this.TimePicker.close()
  }

  onConfirm(hour, minute) {
    this.setState({
      time: hour + ':' + minute
    })
    this.TimePicker.close()
  }

  notification(time) {
    if (Platform.OS === 'ios') {
      this.cancelNotification()
      const date = new Date()
      const timeArr = time.split(':')
      const hours = parseInt(timeArr[0])
      const minutes = parseInt(timeArr[1])
      date.setHours(hours, minutes, 0)

      let notifyDate = date.toISOString()
      PushNotificationIOS.requestPermissions().then(
          (data) => {
            PushNotificationIOS.scheduleLocalNotification({
              alertBody: '小安提醒您记得记录今天的日记哟~',
              alertTitle: '晚安日记',
              fireDate: notifyDate,
              repeatInterval: 'day',
              userInfo: { method: 'wanan' }
            })
          },
          (data) => {
            this.showMsg('请打开应用通知权限，否则无法接受提醒通知')
          }
      )
    }
  }

  cancelNotification() {
    Platform.OS === 'ios' && PushNotificationIOS.cancelLocalNotifications({ method: 'wanan' })
  }

  onSubmit() {
    const { id, time, checked } = this.state
    if (checked) {
      this.notification(time)
    } else {
      this.cancelNotification()
    }

    this.post('/member/updateSetting', {
      id,
      time,
      status: checked ? 1 : 0
    }).then(res => {
      if (res.code === 200) {
        Event.trigger('refreshProfile')
        this.showMsg('设置成功')
        this.naviBack()
      }
    })
  }

  render() {
    const { time, checked, loading } = this.state
    if (loading) {
      return this.renderLoading()
    }

    return (
        <View style={styles.wrapper}>
          <StatusBar translucent={true}
                     backgroundColor="transparent"
                     barStyle="dark-content" />
          <View style={styles.item}>
            <Text style={styles.itemLeft}>提醒我写日记</Text>
            <View style={styles.itemRight}>
              <Switch onSwitch={this.onSwitch.bind(this)} checked={checked} />
            </View>
          </View>

          <TouchableOpacity style={styles.item} onPress={this.onSettingTime.bind(this)}>
            <Text style={styles.itemLeft}>提醒时间</Text>
            <View style={styles.itemRight}>
              <Text style={styles.time}>{time}</Text>
              <IconFont name="SmallArrow" color="#C2C4CA" size={Variable.font12} />
            </View>
          </TouchableOpacity>

          <Text style={styles.tips}>养成每天写晚安日记的习惯，也可以拥有健康作息哦～</Text>
          <TimePicker
              ref={ref => {
                this.TimePicker = ref
              }}
              onCancel={() => this.onCancel()}
              onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
          />
        </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 22
  },
  item: {
    height: 50,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Variable.border_color
  },
  itemLeft: {
    fontSize: Variable.font16,
    color: '#1E2432',
    fontWeight: '500'
  },
  itemRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    height: 32,
    resizeMode: 'contain'
  },
  switch: {
    position: 'relative',
    height: 32,
    width: 54,
    borderRadius: 16,
    backgroundColor: '#c4c4c4'
  },
  checked: {
    backgroundColor: Variable.blue
  },
  switchBtn: {
    position: 'absolute',
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    left: 2,
    bottom: 2
  },
  checkedBtn: {
    left: 'auto',
    right: 2
  },
  time: {
    fontSize: Variable.font16,
    color: '#1E2432',
    fontWeight: '500',
    marginRight: 24
  },
  tips: {
    marginTop: 15,
    fontSize: Variable.font12,
    color: '#666666'
  }
})


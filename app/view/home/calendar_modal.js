import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import Modal from 'react-native-modal'
import Calendar from '../../component/calendar'
import  { showDate }  from '../../component/calendar/dateutils'
import Toast from '../../component/toast/basic_toast'
import XDate from 'xdate'

export default class CalendarModal extends BaseComponent {
  todayMarked = true

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      markedDates: null
    }

    this.onDayPress = this.onDayPress.bind(this)
  }

  loadCalendarData(date) {
    let now = new XDate()
    now = now.toString('yyyy-MM-dd')
    date = date || now

    this.request('/daily/calendarDaily', { month: date }).then(res => {
      const data = res.data
      let mark = {}
      data.forEach(item => {
        mark[item.createTime] = {
          emotion: item.emotionType,
          marked: true
        }
      })

      const nowStr = now.slice(0, 7)
      const dateStr = date.slice(0, 7)
      this.todayMarked = !!mark[now] || nowStr !== dateStr
      this.setState({
        markedDates: mark
      })
    })
  }

  onDayPress(day) {
    const { timestamp, dateString } = day
    let now = new Date().getTime()

    let selectedTimestamp = new XDate(dateString).clearTime().getTime()
    if (selectedTimestamp > now) {
      this.refs.dayToast.show('还没到时间哦，当天再来记录吧～')
      return
    }

    let marked = this.state.markedDates[dateString]
    if (!marked) {
      this.refs.dayToast.show('当天没有写日记哟～')
      return
    }

    this.hide()
    this.naviTo('DailyDetail', { date: dateString })

  }

  onMonthChange(date) {
    this.loadCalendarData(date.dateString)
  }

  show() {
    this.loadCalendarData()
    this.setState({
      show: true
    })
  }

  hide() {
    this.setState({
      show: false
    })
  }

  toggle(top) {
    if (!this.state.show) {
      this.loadCalendarData()
    }
    this.setState({
      show: !this.state.show,
      top: top
    })
  }

  add() {
    this.hide()
    this.naviTo('AddDaily')
  }

  render() {
    let now = new XDate()
    now = now.toString('yyyy-MM-dd')
    const { day, month, year } = showDate(now)
    const offset = Platform.OS === 'ios' ? 15 : -25
    return (
        <Modal style={[styles.wrapper, { top: this.state.top + offset }]}
               isVisible={this.state.show}
               animationIn='fadeInDown'
               animationOut='fadeOut'
               useNativeDriver={true}
               hasBackdrop={false}
               coverScreen={false}>
          <ScrollView style={[styles.box, { height: Variable.wHeight - this.state.top }]}
                      showsVerticalScrollIndicator={false}>
            <Calendar
                onDayPress={(day) => this.onDayPress(day)}
                onMonthChange={(date) => this.onMonthChange(date)}
                markedDates={this.state.markedDates} />
            {!this.todayMarked &&
            <TouchableOpacity style={styles.addTag} onPress={() => this.add()}>
              <View style={styles.textBox}>
                <Text style={styles.bigDate}>{day}</Text>
                <Text style={styles.normalDate}>{month}{year}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image source={require('../../res/image/icon/add.png')}
                       style={styles.addTagBtn} />
              </View>
            </TouchableOpacity>
            }
          </ScrollView>
          <Toast ref="dayToast"
                 position='center'
                 style={styles.toastBox}
                 opacity={0.94}
                 textStyle={{ fontSize: 14, color: '#333' }}
          />
        </Modal>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    margin: 0,
    zIndex: 100
  },
  box: {
    width: Variable.wWdith,
    backgroundColor: Variable.main_bg
  },
  addTag: {
    marginTop: 30,
    marginBottom: 200,
    marginHorizontal: 20,
    flexDirection: 'row',
    height: 112,
    alignItems: 'center',
    backgroundColor: Variable.blue,
    borderRadius: 8
  },
  textBox: {
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: '#7B93EC'
  },
  bigDate: {
    fontSize: Variable.font28,
    color: '#fff',
    fontWeight: '900'
  },
  normalDate: {
    fontSize: Variable.font12,
    color: '#fff',
    fontWeight: '400'
  },
  addTagBtn: {
    height: 64,
    width: 64
  },
  toastBox: {
    zIndex: 10003,
    maxWidth: Variable.wWdith - 40,
    backgroundColor: '#E5E5E5',
    padding: 16
  }
})


import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import Modal from 'react-native-modal'
import Header from './header'
import Calendar from '../../component/calendar'
import Toast from '../../component/toast/basic_toast'
import XDate from 'xdate'

export default class CalendarModal extends BaseComponent {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      marked: null
    }

    this.onDayPress = this.onDayPress.bind(this)
  }

  loadCalendarData(date) {
    let now = new XDate()
    now = now.toString('yyyy-MM-dd')
    date = date || now

    this.request('/sign/filterByMonth', { month: date }).then(res => {
      const data = res.data
      let mark = {}
      data.forEach(item => {
        mark[item.signDay] = {
          marked: true
        }
      })
      this.setState({
        marked: mark
      })
    })
  }

  onDayPress(date) {
    const { timestamp, dateString } = date
    let nowTimestamp = new Date().getTime()
    let selectedTimestamp = new XDate(dateString).clearTime().getTime()

    if (selectedTimestamp > nowTimestamp) {
      this.refs.dayToast.show('时间尚早，等等再来吧～')
      return
    }

    const { marked } = this.state
    if (!marked[date.dateString]) {
      this.refs.dayToast.show('今天没有打卡哟～')
    }
    this.props.onShowCalendar()
    this.props.onChange(date.dateString)
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

  toggle(callback) {
    if (!this.state.show) {
      this.loadCalendarData()
    }
    this.setState({
      show: !this.state.show
    }, () => {
      callback && callback()
    })
  }

  onShow() {
    this.props.parent.isShow = true
  }

  onHide() {
    this.props.parent.isShow = false
  }

  render() {
    return (
        <Modal style={[styles.wrapper, { top: 0 }]}
               isVisible={this.state.show}
               animationIn='fadeInDown'
               animationOut='fadeOut'
               useNativeDriver={true}
               onModalShow={() => this.onShow()}
               onModalHide={() => this.onHide()}
               hasBackdrop={false}
               coverScreen={false}>
          <Header ref="header" onShowCalendar={() => this.hide()}
                  onShare={this.props.onShare}
                  data={this.props.data}
                  headerStyle={{ backgroundColor: Variable.main_bg }} />
          <ScrollView style={[styles.box, { height: Variable.wHeight }]}
                      showsVerticalScrollIndicator={false}>
            <Calendar
                enableSwipeMonths={true}
                disableAllTouchEventsForDisabledDays={true}
                onDayPress={(day) => this.onDayPress(day)}
                onMonthChange={(date) => this.onMonthChange(date)}
                markedDates={this.state.marked} />
          </ScrollView>
          <TouchableOpacity style={styles.line}
                            hitSlop={{ top: 30, bottom: 10, left: 30, right: 30 }}
                            onPress={() => this.props.onShowCalendar()} />
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
    height: 480
  },
  box: {
    width: Variable.wWdith,
    backgroundColor: Variable.main_bg
  },
  line: {
    position: 'absolute',
    bottom: 3,
    height: 5,
    width: 56,
    borderRadius: 3,
    backgroundColor: '#333',
    alignSelf: 'center'
  },
  toastBox: {
    zIndex: 10003,
    maxWidth: Variable.wWdith - 40,
    backgroundColor: '#E5E5E5',
    padding: 16
  }

})


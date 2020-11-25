import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
import Header from './header'
import CalendarModal from './calendar_modal'
import  { showDate }  from '../../component/calendar/dateutils'
import XDate from 'xdate'
import FastImage from 'react-native-fast-image'

export default class Sticker extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()
  isShow = false

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      loading: true,
      liked: false,
      likedNum: 0,
      disabled: false
    }
    this.handleCalendar = this._handleCalendar.bind(this)
  }

  componentDidMount() {
    this.loadData(this._now())
  }

  loadData(date) {
    //this.showLoading()
    this.request('/sticker/filterByDate', { date }).then(res => {
      if (res.code === 200) {
        this.hideLoading()
        const data = res.data || {}
        this.setState({
          data: data,
          loading: false,
          liked: data.liked || false,
          likedNum: data.likedNum || 0
        })
      }
    })
  }

  _now() {
    let date = new XDate()
    date = date.toString('yyyy-MM-dd')
    return date
  }

  _handleCalendar() {
    this.cModal.toggle()
  }

  _handleLike(id) {
    this.setState({
      disabled: true
    })
    let url = ''
    let likedNum = 0
    if (this.state.liked) {
      url = '/sticker/unliked'
      likedNum = this.state.likedNum - 1
    } else {
      url = '/sticker/liked'
      likedNum = this.state.likedNum + 1
    }

    this.post(url, { id }).then(res => {
      if (res.code === 200) {
        this.setState({
          liked: !this.state.liked,
          likedNum: likedNum,
          disabled: false
        })
      }
    })
  }

  render() {
    const { data, liked, likedNum, disabled } = this.state
    if (!this.state.data) {
      return <View style={{ flex: 1, backgroundColor: Variable.main_bg }} />
    }

    let uri = data.bgImg ? { uri: data.bgImg } : require('../../res/image/temp1.png')
    const { day, month, year } = showDate(data.date || this._now())

    return (
        <FastImage source={uri} style={styles.wrapper}>
          <Header ref="header" onShowCalendar={this.handleCalendar} data={data} />
          <View style={styles.box}>
            <Text style={styles.bigDate}>{day}</Text>
            <Text style={styles.normalDate}>{month}{year}</Text>
            <View style={{
              marginTop: 23,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={styles.content}>
                {data.content || '你似乎来到了未知夜晚~'}
              </Text>
              {data.id &&
              <TouchableOpacity style={{ alignItems: 'center' }}
                                onPress={() => this._handleLike(data.id)} disabled={disabled}>
                <View style={styles.likeBox}>
                  <IconFont name={liked ? 'Liked' : 'Like'} size={Variable.font18}
                            color={liked ? '#E7512E' : '#fff'} />
                </View>
                <Text style={styles.numText}>{likedNum || 0}</Text>
              </TouchableOpacity>
              }
            </View>
          </View>
          <CalendarModal ref={(ref) => this.cModal = ref} parent={this}
                         data={data}
                         onChange={(date) => this.loadData(date)}
                         onShowCalendar={this.handleCalendar} />
        </FastImage>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  title: {
    fontSize: Variable.font20,
    fontWeight: '400',
    fontFamily: 'SourceHanSerifCN-Regular',
    color: '#E5E5E5',
    marginRight: 4
  },
  box: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 75,
    paddingHorizontal: 20
  },
  bigDate: {
    fontSize: Variable.font48,
    fontWeight: '900',
    color: '#fff'
  },
  normalDate: {
    fontFamily: 'SourceHanSerifCN-Regular',
    fontSize: Variable.font14,
    color: '#fff'
  },
  content: {
    maxWidth: Variable.wWdith - 86,
    fontSize: Variable.font20,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 28
  },
  numText: {
    fontSize: Variable.font12,
    color: '#E5E5E5',
    marginTop: 6
  },
  likeBox: {
    height: 42,
    width: 42,
    paddingTop: 1,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
})


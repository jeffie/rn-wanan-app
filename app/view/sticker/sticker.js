import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Platform,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
import Header from './header'
import CalendarModal from './calendar_modal'
import CustomModal from './custom_modal'
import ShareModal from './share_modal'
import  { showDate }  from '../../component/calendar/dateutils'
import XDate from 'xdate'
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-crop-picker'
import  { timeTrim }  from '../../component/calendar/dateutils'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures'
import Footer from './footer'
const swipeConfig = {
  velocityThreshold: 0.1,
  directionalOffsetThreshold: 600
}

export default class Sticker extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  currDate = null

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      loading: true,
      liked: false,
      likedNum: 0,
      disabled: false,
      signTime: 0,
      hasSigned: false
    }
    this.handleCalendar = this._handleCalendar.bind(this)
    this.handleCard = this._handleCard.bind(this)
    this.handleShare = this._handleShare.bind(this)
  }

  componentDidMount() {
    this.loadData(this._now())
  }

  loadData(date, showSignCard) {
    this.currDate = date
    // this.showLoading()
    this.request('/sticker/filterByDate', { date }).then(res => {
      if (res.code === 200) {
        this.hideLoading()
        const data = res.data || {}
        const sign = data.sign || {}
        let signTime = 0
        if (sign.signTime) {
          signTime = timeTrim(sign.signTime)
        }

        data.date = date
        this.setState({
          data: data,
          loading: false,
          liked: data.liked || false,
          likedNum: data.likedNum || 0,
          signTime: signTime,
          hasSigned: data.hasSign
        })

        showSignCard && this.shareModal.show(data)
      }
    }).catch(e => {
      this.hideLoading()
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

  _handleCard() {
    this.post('/sign/add').then(resp => {
      if (resp.code === 200) {
        this.showMsg('打卡成功')
        this.loadData(this._now(), true)
      } else {
        this.showMsg(resp.msg)
      }
    })
  }

  _handleCustomText() {
    const { data } = this.state
    this.customModal.show(data)
  }

  _handleCustomBgImg() {
    ImagePicker.openPicker({
      height: Variable.wHeight - Variable.bottomSpace - Variable.statusBarHeight,
      width: Variable.wWdith,
      compressImageQuality: 0.9,
      cropping: true,
      mediaType: 'photo',
      forceJpg: true,
      cropperChooseText: '选择',
      cropperCancelText: '取消'
    }).then(image => {
      if (image.size / 1048576 > 5) {
        Alert.alert('提示', '图片大小不能超过5M')
      } else {
        let path = image.sourceURL || image.path
        this._handleUpload(path)
      }
    }).catch(e => {})
  }

  _handleUpload(path) {
    const { data } = this.state
    let formData = new FormData()
    let name = 'img.jpg'
    if (Platform.OS === 'android' && path) {
      let index = path.lastIndexOf('\/')
      name = name || path.substr(index + 1, path.length)
    }

    formData.append('file', {
      uri: path,
      type: 'multipart/form-data',
      name: name
    })
    return this.post('/sticker_custom/upload', formData, {
      'Content-Type': 'multipart/form-data'
    }).then(res => {
      let url = res.data.url
      this.post('/sticker_custom/custom', {
        id: data.customId || null,
        date: data.date,
        bgImg: url
      }).then(resp => {
        if (resp.code === 200) {
          data.bgImg = path
          this.loadData(data.date)
        }
      })
    })
  }

  _handleShare() {
    const { data } = this.state
    this.shareModal.show(data)
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

  onSwipe(gestureName, gestureState) {
    let date = new XDate(this.currDate)
    if (!gestureName) {
      return
    }
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections
    this.setState({ gestureName: gestureName })
    switch (gestureName) {
      case SWIPE_DOWN:
        break
      case SWIPE_RIGHT:
        date = date.addDays(-1)
        break
      case SWIPE_UP:
        break
      case SWIPE_LEFT:
        date = date.addDays(1)
        break
    }

    let nowTimestamp = new XDate().getTime()
    if (date.getTime() > nowTimestamp) {
      this.showMsg('时间尚早，等等再来吧~')
      return
    }
    this.currDate = date.toString('yyyy-MM-dd')
    this.loadData(this.currDate)
  }

  render() {
    const {
      data,
      signTime,
      hasSigned,
      liked,
      likedNum,
      disabled
    } = this.state

    if (!this.state.data) {
      return <View style={{ flex: 1, backgroundColor: Variable.main_bg }} />
    }

    let uri = data.bgImg ? { uri: data.bgImg } : require('../../res/image/temp1.png')
    const { day, month } = showDate(data.date || this._now(), true)
    const isNow = data.date === this._now()

    let signStatus = false
    if (isNow) {
      const nowTime = new Date().getTime()
      const signTime = new Date(data.date + ' 20:00').getTime()
      if (nowTime >= signTime) {
        signStatus = true
      }
    }

    return (
        <GestureRecognizer
            onSwipe={(direction, state) => this.onSwipe(direction, state)}
            config={swipeConfig}
            style={{
              flex: 1,
              backgroundColor: Variable.main_bg
            }}
        >
          <FastImage source={uri} style={styles.wrapper}>
            <Header ref="header"
                    onShowCalendar={this.handleCalendar}
                    onShare={this.handleShare}
                    data={data} />
            <View style={styles.box}>
              <View style={styles.dateBox}>
                <Text style={styles.bigDate}>{day}</Text>
                <Text style={styles.normalDate}>/ {month.toUpperCase()}</Text>
              </View>
              <View>
                <View style={styles.bottomBox}>
                  <View style={styles.contentBox}>
                    <Text style={styles.content}>
                      {data.content || '你似乎来到了茫茫未知的夜晚~'}
                    </Text>
                    {data.id &&
                    <TouchableOpacity style={{ alignItems: 'center' }}
                                      onPress={() => this._handleLike(data.id)} disabled={disabled}>
                      <View style={styles.likeBox}>
                        <IconFont name={liked ? 'Liked' : 'Like'} size={Variable.font22}
                                  color={liked ? '#E7512E' : '#fff'} />
                      </View>
                      <Text style={styles.numText}>{likedNum || 0}</Text>
                    </TouchableOpacity>
                    }
                  </View>
                  {!hasSigned && isNow &&
                  <TouchableOpacity style={[styles.cardBtn, !signStatus && styles.disabled]}
                                    onPress={this.handleCard}>
                    <Text style={styles.cardBtnTitle}>今日晚安打卡</Text>
                    <Text style={styles.cardBtnTips}>打卡时间：20:00-00:00</Text>
                  </TouchableOpacity>
                  }

                  {!hasSigned && !isNow &&
                  <View style={[styles.cardBtn, styles.disabled]}>
                    <Text style={styles.cardBtnTitle}>今日未打卡</Text>
                    <Text style={styles.cardBtnTips}>打卡时间：20:00-00:00</Text>
                  </View>
                  }

                  {hasSigned &&
                  <View style={styles.signDateBox}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.signTitle, styles.mgb20]}>连续打卡</Text>
                        <Text style={styles.signTitle}><Text
                            style={styles.signBigText}>{data.sign.serialTimes}</Text> 天</Text>
                      </View>
                      <View style={{ marginLeft: 30, alignItems: 'center' }}>
                        <Text style={[styles.signTitle, styles.mgb20]}>今日入睡</Text>
                        <Text style={styles.signBigText}>{signTime}</Text>
                      </View>
                    </View>
                  </View>
                  }

                  <View style={styles.iconGroup}>
                    <View style={styles.iconBox}>
                      <TouchableOpacity style={styles.imgIcon}
                                        onPress={() => this._handleCustomText()}>
                        <IconFont name="Edit" size={Variable.font20} color={'#e5e5e5'} />
                      </TouchableOpacity>
                      <Text style={styles.iconText}>换金句</Text>
                    </View>
                    <View style={styles.iconBox}>
                      <TouchableOpacity style={styles.imgIcon}
                                        onPress={() => this._handleCustomBgImg()}>
                        <IconFont name="Img" size={Variable.font20} color={'#e5e5e5'} />
                      </TouchableOpacity>
                      <Text style={styles.iconText}>换背景</Text>
                    </View>
                  </View>

                </View>
              </View>
            </View>

            <Footer />

            <CalendarModal ref={(ref) => this.cModal = ref} parent={this}
                           data={data}
                           onChange={(date) => this.loadData(date)}
                           onShare={this.handleShare}
                           onShowCalendar={this.handleCalendar} />
            <CustomModal ref={(ref) => this.customModal = ref} parent={this} />
            <ShareModal ref={(ref) => this.shareModal = ref} />
          </FastImage>
        </GestureRecognizer>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Variable.main_bg
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
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 20
  },
  dateBox: {
    alignItems: 'flex-end',
    marginRight: 20
  },
  bigDate: {
    fontSize: Variable.font48,
    letterSpacing: 3,
    fontWeight: '800',
    color: '#fff'
  },
  normalDate: {
    fontSize: Variable.font14,
    fontWeight: '600',
    color: '#fff'
  },
  bottomBox: {
    marginTop: 23,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentBox: {
    width: Variable.wWdith - 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  content: {
    maxWidth: Variable.wWdith - 120,
    fontSize: Variable.font18,
    textAlign: 'justify',
    color: '#fff',
    lineHeight: 28,
    fontWeight: '600',
    textShadowColor: Variable.black,
    textShadowRadius: 3,
    textShadowOffset: { width: 1, height: 1 }
  },
  numText: {
    fontSize: Variable.font12,
    color: '#E5E5E5',
    marginTop: 6
  },
  likeBox: {
    height: 42,
    width: 42,
    paddingTop: 2,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)'
  },
  cardBtn: {
    marginTop: 40,
    width: Variable.wWdith - 120,
    height: 55,
    borderRadius: 16,
    backgroundColor: 'rgba(250,204,1,0.95)',
    opacity: 0.92,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardBtnTitle: {
    fontSize: Variable.font16,
    color: Variable.black,
    fontWeight: '500'
  },
  cardBtnTips: {
    marginTop: 5,
    fontSize: Variable.font12,
    color: Variable.grey
  },
  iconGroup: {
    marginTop: 30,
    width: Variable.wWdith - 180,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iconBox: {
    alignItems: 'center'
  },
  imgIcon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    opacity: 0.8,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconText: {
    fontSize: Variable.font14,
    color: '#e5e5e5',
    marginTop: 10,
    textShadowColor: Variable.grey,
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 0 }
  },
  signDateBox: {
    marginTop: 40,
    width: Variable.wWdith - 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  signTitle: {
    fontSize: Variable.font12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    textShadowColor: Variable.black,
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 }
  },
  mgb20: {
    marginBottom: 10
  },
  signBigText: {
    fontSize: Variable.font18,
    fontWeight: '600',
    color: 'rgba(255,255,255,1)',
    textShadowColor: Variable.black,
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 }
  },
  disabled: {
    backgroundColor: 'rgba(250,214,80,0.7)'
  }
})


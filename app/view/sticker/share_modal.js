import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import Modal from 'react-native-modal'
import { showDate, timeTrim } from '../../component/calendar/dateutils'
import FastImage from 'react-native-fast-image'
import ViewShot from 'react-native-view-shot'
import CameraRoll from '@react-native-community/cameraroll'

export default class ShareModal extends BaseComponent {

  item = null
  sticker = null

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }

    this.qrcode = BaseComponent.SYS_SETTING.qrcode
    this.handleCapture = this._handleCapture.bind(this)
  }

  componentDidMount() {
  }

  show(data) {
    this.sticker = data
    this.setState({
      show: true
    })
  }

  onModalShow() {
  }

  hide() {
    this.setState({
      show: false
    })
  }

  toggle() {
    this.setState({
      show: !this.state.show
    })
  }

  async _handleCapture() {
    this.refs.viewShot.capture().then(uri => {
      this._checkPermission().then(async (auth) => {
        if (auth) {
          CameraRoll.save(uri).then(res => {
            Alert.alert('成功', '打卡已保存到您相册')
          })
        } else {
          Alert.alert('失败', '请在系统设置中授权应用使用相册权限')
        }
      })
    })
  }

  _checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true)
    }

    const rationale = {
      'title': '请求相册权限',
      'message': '授权使用您的相册权限，才能将图片保存到本地~'
    }

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        rationale).
        then((result) => {
          return (result === true || result === PermissionsAndroid.RESULTS.GRANTED)
        })
  }

  componentWillUnmount() {
  }

  render() {
    if (!this.sticker) {
      return <View />
    }

    const { sign = {}, nickname, avatar, hasSign } = this.sticker
    const sticker = this.sticker
    const img = (sticker && sticker.bgImg) ? { uri: sticker.bgImg } : require(
        '../../res/image/temp1.png')
    const avatarImg = avatar ? { uri: avatar } : require('../../res/image/avatar_def.jpg')
    const { day, month } = showDate(sticker.date || this._now(), true)
    let signTime = '未打卡'
    if (hasSign) {
      signTime = timeTrim(sign.signTime)
    }

    return (
        <Modal style={styles.wrapper}
               isVisible={this.state.show}

               onModalShow={() => this.onModalShow()}
               coverScreen={true}
               hasBackdrop={true}>
          <View style={styles.box}>
            <TouchableOpacity style={styles.closeBtn}
                              onPress={() => this.hide()}
                              hitSlop={{ top: 30, bottom: 30, left: 30, right: 20 }}>
              <Image source={require('../../res/image/icon/close_icon.png')}
                     style={styles.closeImg} />
            </TouchableOpacity>
            <ViewShot ref="viewShot" style={styles.container}>
              <TouchableOpacity activeOpacity={1} onLongPress={this.handleCapture}>
                <FastImage source={img} style={styles.img}>
                  <View style={styles.header}>
                    <View style={styles.headerLeft}>
                      <FastImage source={avatarImg} style={styles.avatar} />
                      <Text style={styles.nickname}>晚安，{nickname || '神秘人'}</Text>
                    </View>
                    <View style={styles.headerRight}>
                      <Text style={styles.day}>{day}</Text>
                      <View style={styles.monthBox}>
                        <Text style={styles.split}>{'/'}</Text>
                        <Text style={styles.month}>{month.toUpperCase()}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginBottom: 40 }}>
                    <Text style={styles.imgText}>{sticker.content || '请收好今晚的月光和我爱你，晚安~'}</Text>
                    {hasSign &&
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.signTitle, styles.mgb20]}>连续打卡</Text>
                        <Text style={styles.signTitle}><Text
                            style={styles.signBigText}>{sign.serialTimes || 0}</Text> 天</Text>
                      </View>
                      <View style={{ marginLeft: 30, alignItems: 'center' }}>
                        <Text style={[styles.signTitle, styles.mgb20]}>今日入睡</Text>
                        <Text style={styles.signBigText}>{signTime}</Text>
                      </View>
                    </View>
                    }
                  </View>
                </FastImage>
              </TouchableOpacity>

              <View style={styles.bottom}>
                <Image source={require('../../res/image/bottom-banner.png')}
                       style={styles.bottomImg} />
                <FastImage source={{ uri: this.qrcode }}
                           style={styles.qrcode} />
              </View>
            </ViewShot>
          </View>

          <TouchableOpacity style={styles.footer}>
            <Text>长按图片保存到相册</Text>
          </TouchableOpacity>
        </Modal>
    )
  }
}
const imgWidth = Variable.wWdith - 30
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 0,
    padding: 0
  },
  box: {
    paddingHorizontal: 15
  },
  closeBtn: {
    position: 'absolute',
    top: -20,
    right: 5,
    zIndex: 100
  },
  closeImg: {
    height: 40,
    width: 40
  },
  container: {
    // marginTop: 60 + Variable.statusBarHeight,
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: Variable.wWdith - 30
  },
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 4
  },
  nickname: {
    fontSize: Variable.font14,
    fontWeight: '400',
    color: '#fff',
    marginLeft: 8,
    textShadowColor: Variable.black,
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 }
  },
  headerRight: {
    alignItems: 'flex-end'
  },
  day: {
    fontFamily: 'SourceHanSerifCN-Regular',
    fontSize: Variable.font50,
    lineHeight: 60,
    textAlign: 'right',
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 5,
    textShadowColor: Variable.black,
    textShadowRadius: 3,
    textShadowOffset: { width: 1, height: 1 }
  },
  monthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  month: {
    fontFamily: 'SourceHanSerifCN-Regular',
    fontSize: Variable.font12,
    lineHeight: 16,
    color: '#fff',
    fontWeight: '400',
    textShadowColor: Variable.black,
    textShadowRadius: 3,
    textShadowOffset: { width: 1, height: 1 }
  },
  split: {
    fontSize: Variable.font12,
    lineHeight: 14,
    color: '#fff',
    marginRight: 5,
    textShadowColor: Variable.black,
    textShadowRadius: 3,
    textShadowOffset: { width: 1, height: 1 }
  },
  img: {
    paddingHorizontal: 15,
    width: imgWidth,
    height: Variable.wHeight - Variable.statusBarHeight - 220,
    resizeMode: 'cover',
    justifyContent: 'space-between'
  },
  imgText: {
    marginBottom: 30,
    width: Variable.wWdith - 120,
    fontSize: Variable.font18,
    textAlign: 'justify',
    color: '#fff',
    fontWeight: '600',
    lineHeight: 28,
    textShadowColor: Variable.black,
    textShadowRadius: 3,
    textShadowOffset: { width: 1, height: 1 }
  },
  signTitle: {
    fontSize: Variable.font14,
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
    fontSize: Variable.font20,
    fontWeight: '600',
    color: 'rgba(255,255,255,1)',
    textShadowColor: Variable.black,
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 }
  },
  bottom: {
    marginVertical: 10,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomImg: {
    width: Variable.wWdith - 180,
    height: 70,
    resizeMode: 'cover',
    marginLeft: 15
  },
  qrcode: {
    height: 60,
    width: 60
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,1)',
    height: 45,
    width: Variable.wWdith,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    fontSize: Variable.font16,
    color: '#666'
  }
})


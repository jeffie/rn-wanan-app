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
import { showDate } from '../../component/calendar/dateutils'
import FastImage from 'react-native-fast-image'
import ViewShot from 'react-native-view-shot'
import CameraRoll from '@react-native-community/cameraroll'

export default class MarkModal extends BaseComponent {

  item = null

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      day: null,
      show: false
    }

    this.qrcode = BaseComponent.SYS_SETTING.qrcode
    this.handleCapture = this._handleCapture.bind(this)
  }

  componentDidMount() {
  }

  show(item) {
    this.request('/mark/detail', { id: item.markId }).then(resp => {
      if (resp.code === 200) {
        let markDate = showDate(item.createTime, true)
        this.setState({
          show: true,
          data: resp.data,
          day: markDate.day,
          month: markDate.month
        })
      }
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

  skip() {
    this.hide()
    this.naviTo('Home')
  }

  async _handleCapture() {
    this.refs.viewShot.capture().then(uri => {
      this._checkPermission().then(async (auth) => {
        if (auth) {
          CameraRoll.save(uri).then(res => {
            Alert.alert('成功', '夜签已保存到您相册')
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
    if (!this.state.data) {
      return <View />
    }

    const { content, bgImg, nickname, avatar } = this.state.data
    const { day, month = '' } = this.state
    const img = bgImg ? { uri: bgImg } : require('../../res/image/sticker_bg.png')
    const avatarImg = avatar ? { uri: avatar } : require('../../res/image/avatar_def.jpg')

    return (
        <Modal style={styles.wrapper}
               isVisible={this.state.show}

               onModalShow={() => this.onModalShow()}
               coverScreen={true}
               hasBackdrop={true}>
          <View style={styles.box}>
            <TouchableOpacity style={styles.closeBtn}
                              onPress={() => this.skip()}
                              hitSlop={{ top: 30, bottom: 30, left: 30, right: 20 }}>
              <Image source={require('../../res/image/icon/close_icon.png')}
                     style={styles.closeImg} />
            </TouchableOpacity>
            <ViewShot ref="viewShot" style={styles.container}>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <FastImage source={avatarImg} style={styles.avatar} />
                  <Text style={styles.nickname}>{nickname || '神秘人'}的今夜签</Text>
                </View>
                <View style={styles.headerRight}>
                  <Text style={styles.day}>{day}</Text>
                  <View style={styles.monthBox}>
                    <Text style={styles.split}>{'/'}</Text>
                    <Text style={styles.month}>{month.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity activeOpacity={1} onLongPress={this.handleCapture}>
                <FastImage source={img} style={styles.img}>
                  <Text style={styles.imgText}>{content}</Text>
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
const imgWidth = Variable.wWdith - 50
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 0,
    padding: 0
  },
  box: {},
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
    marginHorizontal: 15,
    width: Variable.wWdith - 30
  },
  header: {
    marginTop: 20,
    marginHorizontal: 15,
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
    fontFamily: 'SourceHanSerifCN-Regular',
    fontSize: Variable.font14,
    fontWeight: '500',
    color: '#1f1f1f'
  },
  headerRight: {
    alignItems: 'flex-end'
  },
  day: {
    fontFamily: 'SourceHanSerifCN-Regular',
    fontSize: Variable.font50,
    textAlign: 'right',
    lineHeight: 53,
    color: '#000',
    fontWeight: '600'
  },
  monthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  month: {
    fontFamily: 'SourceHanSerifCN-Regular',
    fontSize: Variable.font10,
    lineHeight: 12,
    color: '#676768',
    fontWeight: '400'
  },
  split: {
    fontSize: Variable.font12,
    lineHeight: 12,
    color: '#676768',
    marginRight: 10
  },
  img: {
    marginTop: 10,
    marginHorizontal: 10,
    width: imgWidth,
    height: imgWidth * 1.1,
    resizeMode: 'cover',
    justifyContent: 'flex-end'
  },
  imgText: {
    marginLeft: 15,
    marginBottom: 20,
    width: '80%',
    fontSize: Variable.font16,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 28
  },
  bottom: {
    marginVertical: 10,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomImg: {
    width: Variable.wWdith - 160,
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


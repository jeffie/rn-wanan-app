import React, { Component } from 'react'
import {
  PermissionsAndroid,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
import  { showDate }  from '../../component/calendar/dateutils'
import ViewShot from 'react-native-view-shot'
import CameraRoll from '@react-native-community/cameraroll'
import XDate from 'xdate'

export default class StickerShare extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  constructor(props) {
    super(props)
    this.state = {
      hideHeader: false
    }
    this.handleCapture = this._handleCapture.bind(this)
    this.data = this.getRouterParams().data || {}
    this.qrcode = BaseComponent.SYS_SETTING.qrcode
  }

  _now() {
    let date = new XDate()
    date = date.toString('yyyy-MM-dd')
    return date
  }

  async _handleCapture() {
    if (Platform.OS === 'android' && !(await this.hasAndroidPermission())) {
      return
    }

    this.refs.viewShot.capture().then(uri => {
      CameraRoll.save(uri, 'photo').then(res => {
        this.showMsg('保存成功')
        this.setState({
          hideHeader: false
        })
      })
    })
  }

  async hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE

    const hasPermission = await PermissionsAndroid.check(permission)
    if (hasPermission) {
      return true
    }

    const status = await PermissionsAndroid.request(permission)
    return status === 'granted'
  }

  render() {
    let data = this.data || {}
    let uri = data.bgImg ? { uri: data.bgImg } : require('../../res/image/temp1.png')
    const { day, month, year } = showDate(data.date || this._now())
    return (
        <TouchableOpacity style={styles.wrapper} activeOpacity={1} onLongPress={this.handleCapture}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {this.naviBack()}}
                              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <IconFont name="Back" size={Variable.font20} color="#E5E5E5" />
            </TouchableOpacity>
          </View>
          <ViewShot ref="viewShot" style={styles.wrapper}>
            <ImageBackground source={uri} style={styles.wrapper}>
              <Image source={require('../../res/image/logo_pure.png')} style={styles.logo} />
              <View style={styles.box}>
                <Text style={styles.bigDate}>{day}</Text>
                <Text style={styles.normalDate}>{month}{year}</Text>
                <View
                    style={{
                      marginTop: 23,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end'
                    }}>
                  <Text style={styles.content}>
                    {data.content || '你似乎来到了未知夜晚~'}
                  </Text>
                  {/*<View style={{ alignItems: 'center' }}>*/}
                  {/*<View style={styles.likeBox}>*/}
                  {/*<IconFont name="Like" size={Variable.font18} color="#fff" />*/}
                  {/*</View>*/}
                  {/*<Text style={styles.numText}>{data.likedNum || 0}</Text>*/}
                  {/*</View>*/}
                </View>

                <View style={styles.shareBox}>
                  <View>
                    <Text style={styles.shareTitle}>扫描打开晚安日记</Text>
                    <Text style={styles.shareContent}>
                      每天100字，{'\n'}记录心情，疗愈自我～
                    </Text>
                    <View style={styles.shareBtn}>
                      <Text style={styles.shareBtnText}>长按图片保存到相册</Text>
                      <View style={styles.shareTag}>
                        <IconFont name="SmallArrow" size={Variable.font6} color="#333" />
                      </View>
                    </View>
                  </View>
                  <Image source={{ uri: this.qrcode }}
                         style={styles.qrcode} />
                </View>
              </View>
            </ImageBackground>
          </ViewShot>
        </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  header: {
    ...Variable.headerStyle,
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0
  },
  title: {
    fontSize: Variable.font20,
    fontWeight: '400',
    color: '#E5E5E5',
    marginRight: 4
  },
  box: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
    paddingHorizontal: 20
  },
  logo: {
    height: 90,
    width: 90,
    position: 'absolute',
    left: (Variable.wWdith - 90) / 2,
    top: Variable.wHeight / 5
  },
  bigDate: {
    fontSize: Variable.font48,
    fontWeight: '900',
    color: '#fff'
  },
  normalDate: {
    fontSize: Variable.font14,
    color: '#fff'
  },
  content: {
    fontSize: Variable.font20,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 35
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
  },
  shareBox: {
    padding: 20,
    marginTop: 17,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  shareTitle: {
    fontSize: Variable.font20,
    fontWeight: '400',
    color: '#333'
  },
  shareContent: {
    marginTop: 8,
    lineHeight: 20,
    fontSize: Variable.font14,
    color: '#999'
  },
  shareBtn: {
    marginTop: 10,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#FACC01',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  shareBtnText: {
    fontSize: Variable.font14,
    color: '#333'
  },
  shareTag: {
    width: 14,
    height: 14,
    backgroundColor: '#fff',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qrcode: {
    height: 98,
    width: 98
  }
})


import React, { Component } from 'react'
import {
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
import ViewShot from 'react-native-view-shot'
import CameraRoll from '@react-native-community/cameraroll'
import XDate from 'xdate'

export default class StickerShare extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  constructor(props) {
    super(props)
    this.state = {
      hideHeader: false,
      data: {}
    }
    this.handleCapture = this._handleCapture.bind(this)

    this.markId = this.getRouterParams().markId
    this.qrcode = BaseComponent.SYS_SETTING.qrcode
  }

  componentDidMount() {
    this.request('/mark/detail', { id: this.markId }).then(resp => {
      if (resp.code === 200) {
        this.setState({
          data: resp.data || {}
        })
      }
    })
  }

  _handleCapture() {
    this.setState({
      hideHeader: true
    })
    this.refs.viewShot.capture().then(uri => {
      CameraRoll.save(uri).then(res => {
        this.showMsg('保存成功')
        this.setState({
          hideHeader: false
        })
      })
    })
  }

  render() {
    const { content, bgImg } = this.state.data
    let date = new XDate()
    date = date.toString('yyyy-MM-dd')
    let uri = bgImg ? { uri: bgImg } : require('../../res/image/temp1.png')
    return (
        <TouchableOpacity style={styles.wrapper} activeOpacity={1} onLongPress={this.handleCapture}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {this.naviTo('Home')}}
                              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <IconFont name="Back" size={Variable.font22} color="#E5E5E5" />
            </TouchableOpacity>
          </View>
          <ViewShot ref="viewShot" style={styles.wrapper}>
            <ImageBackground source={uri} style={styles.wrapper}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={styles.mask}>
                  <IconFont name="MarkPure" color="#FACC01" size={Variable.font24}
                            style={styles.maskTag} />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.maskTitle}>{date} 夜签</Text>
                  </View>
                </View>
                <Image source={require('../../res/image/logo_pure.png')} style={styles.logo} />
              </View>
              <View style={styles.box}>
                <View style={styles.content}>
                  <Text style={styles.contentText}>
                    {content || '今夜我们一起探索浩瀚未知的星空吧~'}
                  </Text>
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
                  <Image source={{uri: this.qrcode}} style={styles.qrcode} />
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
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100
  },
  mask: {
    position: 'relative',
    width: Variable.wWdith - 40,
    height: 48,
    marginTop: Variable.headerStyle.height + 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8
  },
  maskTag: {
    position: 'absolute',
    left: 20
  },
  maskTitle: {
    fontSize: Variable.font16,
    color: '#fff',
    fontWeight: '600'
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
    marginTop: 24
  },
  content: {
    backgroundColor: 'rgba(255,255,255,1)',
    padding: 15,
    borderRadius: 8
  },
  contentText: {
    fontSize: Variable.font14,
    color: '#666',
    lineHeight: 20
  },
  shareBox: {
    padding: 20,
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,1)',
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


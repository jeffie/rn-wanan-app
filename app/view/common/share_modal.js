import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import Modal from 'react-native-modal'
import { BoxShadow } from 'react-native-shadow'
import Wechat from '../../base/wechat/wechat'
import { SHARE_ICON, SHARE_DAILY } from '../../config/conf'

const shadowOpt = {
  width: Variable.wWdith - 100,
  height: 113,
  color: '#240E8B',
  opacity: 0.08,
  border: 20,
  radius: 8,
  x: 0,
  y: 3,
  style: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    paddingVertical: 20
  }
}

export default class ShareModal extends BaseComponent {

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
    this.item = {}
  }

  componentDidMount() {

  }

  show(item) {
    this.item = item
    this.setState({
      show: true
    })
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

  onShareSession() {
    Wechat.shareToSession({
      title: '晚安日记',
      type: 'news',
      thumbImageUrl: this.item.imgUrl || SHARE_ICON,
      description: '每日睡前一篇，记录心情，疗愈自我~',
      webpageUrl: SHARE_DAILY + this.item.id
    }).then(res => {
      this.hide()
      this.showMsg(res.msg)
    })
  }

  onShareTimeline() {
    Wechat.shareToTimeline({
      title: '晚安日记',
      type: 'news',
      thumbImageUrl: this.item.imgUrl || SHARE_ICON,
      description: '每日睡前一篇，记录心情，疗愈自我~',
      webpageUrl: SHARE_DAILY + this.item.id
    }).then(res => {
      this.hide()
      this.showMsg(res.msg)
    })
  }

  render() {
    return (
        <Modal style={styles.wrapper}
               isVisible={this.state.show}
               animationIn='lightSpeedIn'
               animationOut='lightSpeedOut'
               onBackdropPress={() => this.hide()}
               hasBackdrop={true}
               coverScreen={true}>
          <BoxShadow setting={shadowOpt}>
            <View style={styles.box}>
              <TouchableOpacity style={styles.item} onPress={() => this.onShareSession()}>
                <Image source={require('../../res/image/weixin_logo.png')} style={styles.img}
                />
                <Text style={styles.title}>分享给好友</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.item} onPress={() => this.onShareTimeline()}>
                <Image source={require('../../res/image/pengyouquan.png')} style={styles.img}
                />
                <Text style={styles.title}>分享到朋友圈</Text>
              </TouchableOpacity>
            </View>
          </BoxShadow>
        </Modal>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: Variable.font10,
    color: '#1E2432',
    marginTop: 5
  },
  img: {
    width: 56,
    height: 56
  }

})


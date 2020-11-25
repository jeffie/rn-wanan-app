import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
import ImagePicker from 'react-native-image-crop-picker'
import Event from '../../base/event/event'

export default class  extends BaseComponent {
  static navigationOptions = BaseComponent.CustomRightNaviHeader('基础资料')

  constructor(props) {
    super(props)
    const member = this.getRouterParams().member
    this.state = {
      id: member.id,
      nickname: member.nickname,
      avatar: member.avatar,
      bgImg: member.bgImg
    }

    this.navi().setParams({
      icon: 'Submit',
      disable: false,
      onPress: this.onSubmit.bind(this)
    })
  }

  _handleAvatarUpload() {
    ImagePicker.openPicker({
      width: 60,
      height: 60,
      cropping: true,
      mediaType: 'photo',
      forceJpg: true,
      cropperChooseText: '选择',
      cropperCancelText: '取消'
    }).then(image => {
      let path = image.sourceURL || image.path
      this.setState({
        avatar: path
      })
    }).catch(e => {})
  }

  _handleBgUpload() {
    ImagePicker.openPicker({
      height: 238,
      width: Variable.wWdith,
      compressImageQuality: 0.7,
      cropping: true,
      mediaType: 'photo',
      forceJpg: true,
      cropperChooseText: '选择',
      cropperCancelText: '取消'
    }).then(image => {
      let path = image.sourceURL || image.path
      this.setState({
        bgImg: path
      })
    }).catch(e => {})
  }

  _handleInput(text) {
    this.setState({
      nickname: text
    })
  }

  _uploadImg(imgUrl) {
    let formData = new FormData()
    formData.append('file', {
      uri: imgUrl,
      type: 'multipart/form-data',
      name: 'img.jpg'
    })
    return this.post('/member/upload', formData, {
      'Content-Type': 'multipart/form-data'
    }).then(res => {
      return res.data.url
    })
  }

  async onSubmit() {
    this.showLoading()

    let { avatar, bgImg, nickname, id } = this.state
    if (avatar && avatar.indexOf('http') < 0) {
      avatar = this._uploadImg(avatar)
    }
    if (bgImg && bgImg.indexOf('http') < 0) {
      bgImg = this._uploadImg(bgImg)
    }
    avatar = await avatar
    bgImg = await bgImg

    this.post('/member/update', { avatar, bgImg, nickname, id }).then(res => {
      this.hideLoading()
      if (res.code === 200) {
        Event.trigger('refreshProfile')
        this.showMsg('资料更新成功')
        this.naviBack()
      }
    })
  }

  render() {
    const { avatar, nickname } = this.state
    let avatarUri = avatar ? { uri: avatar } : require('../../res/image/avatar_def.jpg')
    return (
        <View style={styles.wrapper}>
          <StatusBar translucent={true}
                     backgroundColor="transparent"
                     barStyle="dark-content" />
          <TouchableOpacity style={styles.item} onPress={() => this._handleAvatarUpload()}>
            <Text style={styles.itemLeft}>头像</Text>
            <View style={styles.itemRight}>
              <Image source={avatarUri} style={styles.avatar} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => this._handleBgUpload()}>
            <Text style={styles.itemLeft}>背景</Text>
            <View style={styles.itemRight}>
              <IconFont name="SmallArrow" color="#C2C4CA" size={Variable.font12} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => this.refs.input.focus()}
                            activeOpacity={1}>
            <Text style={styles.itemLeft}>昵称</Text>
            <TextInput
                ref="input"
                placeholder='请输入昵称'
                style={styles.input}
                maxLength={40}
                value={nickname}
                onChangeText={(text) => this._handleInput(text)} />
            <View style={styles.itemRight}>
              <IconFont name="Edit" color="#C2C4CA" size={Variable.font16} />
            </View>
          </TouchableOpacity>
        </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 22
  },
  item: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Variable.border_color
  },
  itemLeft: {
    width: 50,
    fontSize: Variable.font14,
    color: '#1E2432',
    fontWeight: '500'
  },
  itemRight: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  input: {
    flex: 1,
    color: '#999999',
    fontSize: Variable.font14
  },
  btn: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: Variable.wWdith - 60,
    borderRadius: 23,
    alignSelf: 'center',
    backgroundColor: Variable.yellow
  },
  btnText: {
    fontSize: Variable.font14,
    color: '#262626'
  },
  headerIcon: {
    height: 44,
    width: 40,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }

})


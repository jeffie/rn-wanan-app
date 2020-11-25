import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Alert,
  ImageBackground,
  Image,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import ImagePicker from 'react-native-image-crop-picker'

export default class  extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      imgUrl: this.props.value,
      imgSize: null
    }
    this.handleImgUpload = this._handleImgUpload.bind(this)
    this.handleCancelImg = this._handleCancelImg.bind(this)
  }

  _handleImgUpload() {
    ImagePicker.openPicker({
      compressImageQuality: 0.8,
      cropping: false,
      mediaType: 'photo',
      forceJpg: true,
      loadingLabelText: '图片加载中...',
      cropperChooseText: '选择',
      cropperCancelText: '取消'
    }).then(image => {
      if (image.size / 1048576 > 5) {
        Alert.alert('提示', '图片大小不能超过5M')
      } else {
        let size = (image.width && image.height) ? image.width + ',' + image.height : null
        this.setState({
          imgUrl: image.path
        })
        let path = image.sourceURL || image.path
        this.props.onImgUploaded(path, size)
      }
    })
  }

  _handleCancelImg() {
    ImagePicker.clean()
    this.setState({
      imgUrl: null
    })
    this.props.onImgUploaded(null)
  }

  componentWillUnmount() {
    ImagePicker.clean()
  }

  render() {
    if (!this.state.imgUrl) {
      return <View />
    }
    return (
        <View>
          <View style={[styles.line, { marginHorizontal: 20 }]} />
          <View style={styles.imgPreviewBox}>
            <TouchableOpacity onPress={() => this.props.onImgClick()}>
              <ImageBackground source={{ uri: this.state.imgUrl }} style={styles.imgPreview}>
                <TouchableOpacity onPress={this.handleCancelImg}
                                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                  <Image source={require('../../res/image/icon/close_icon.png')}
                         style={styles.closeBtn} />
                </TouchableOpacity>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
}
const styles = StyleSheet.create({
  imgPreviewBox: {
    paddingHorizontal: 20,
    marginTop: 30
  },
  imgPreview: {
    height: 110,
    width: 110
  },
  closeBtn: {
    width: 28,
    height: 28,
    position: 'absolute',
    right: -12,
    top: -12
  },
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#3A4A84'
  }
})


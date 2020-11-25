import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import Modal from 'react-native-modal'
import ImageViewer from 'react-native-image-zoom-viewer'

export default class ImageModal extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  show(url) {
    this.url = url
    this.setState({
      show: true
    })
  }

  hide() {
    this.setState({
      show: false
    })
  }

  render() {
    return (
        <Modal style={styles.wrapper}
               isVisible={this.state.show}
               animationIn='fadeInDown'
               animationOut='fadeOut'
               onBackdropPress={() => this.hide()}
               hasBackdrop={false}
               coverScreen={true}>
          <TouchableOpacity onPress={() => this.hide()} style={styles.closeBtn}>
            <Image source={require('../../res/image/icon/close_icon.png')}
                   style={styles.closeImg} />
          </TouchableOpacity>
          <ImageViewer imageUrls={[{ url: this.url }]}
                       saveToLocalByLongPress={false}
                       backgroundColor={'rgba(0,0,0,0.85)'}
                       renderIndicator={() => <View />}
                       onClick={() => this.hide()}
                       onSwipeDown={() => this.hide()} enableSwipeDown />
        </Modal>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 0
  },
  closeBtn: {
    position: 'absolute',
    top: 10 + Variable.statusBarHeight,
    right: 10,
    zIndex: 100
  },
  closeImg: {
    height: 38,
    width: 38,
  }
})


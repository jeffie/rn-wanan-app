import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import { Variable } from '../../res/style/variable'
import Modal from 'react-native-modal'

export default class ModalToast extends Component {
  msg = ''
  timer = null

  constructor (props) {
    super(props)
    this.state = {
      tipsVisible: false
    }
  }

  show (msg, duration = 2000) {
    this.msg = msg

    this.setState({
      tipsVisible: true
    }, () => {
      this.timer = setTimeout(() => {
        this.setState({
          tipsVisible: false
        })
      }, duration)
    })
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
  }

  render () {
    return (
        <Modal isVisible={this.state.tipsVisible} hasBackdrop={false} style={styles.toast}
               coverScreen={false}>
          <View style={styles.toastBox}>
            <Text style={styles.toastText}>{this.msg}</Text>
          </View>
        </Modal>
    )
  }
}
const styles = StyleSheet.create({
  toast: {
    margin: 0,
    padding: 0,
    position: 'absolute',
    width: Variable.wWdith,
    alignItems: 'center',
    bottom: 120
  },
  toastBox: {
    maxWidth: Variable.wWdith - 40,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#000',
    opacity: 0.8
  },
  toastText: {
    color: '#fff',
    fontSize: Variable.font14,
    paddingHorizontal: 15,
    paddingVertical: 10
  }
})


import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import BaseComponent from '../../base/base'
import Modal from 'react-native-modal'
import LottieView from 'lottie-react-native'
import Event from '../../base/event/event'

export default class LoadingModal extends BaseComponent {
  callback = null

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    Event.addListener('AppLoading', Event.SHOW_APP_LOADING, ({ show, callback }) => {
      show ? this.show() : this.hide(callback)
    })
  }

  show() {
    this.setState({
      show: true
    })
  }

  hide(callback) {
    this.setState({
      show: false
    })
    this.callback = callback
  }

  toggle() {
    this.setState({
      show: !this.state.show
    })
  }

  onHide() {
    this.callback && this.callback()
  }

  componentWillUnmount() {
    Event.removeListener('AppLoading')
  }

  render() {
    return (
        <Modal style={styles.wrapper}
               isVisible={this.state.show}
               useNativeDriver={true}
               coverScreen={true}
               hasBackdrop={true}
               onModalHide={this.onHide.bind(this)}>
          <View style={styles.box}>
            <LottieView source={require('../../res/data/loading.json')}
                        style={styles.voiceAnimal}
                        autoPlay loop />
          </View>
        </Modal>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 0,
    padding: 0
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  voiceAnimal: {
    height: 150
  }
})


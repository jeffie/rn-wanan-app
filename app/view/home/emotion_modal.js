import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Platform
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import Modal from 'react-native-modal'
import { BoxShadow } from 'react-native-shadow'
import Emotion from '../common/emotion'

const shadowOpt = {
  width: Variable.wWdith - 40,
  height: 60,
  color: '#fff',
  border: 2,
  radius: 3,
  x: 0,
  y: 0,
  style: { backgroundColor: '#fff' }
}

export default class EModal extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      top: 0,
      checkedIndex: -1
    }
  }

  show() {
    this.setState({
      show: true
    })
  }

  hide() {
    this.setState({
      show: false
    })
  }

  toggle(top) {
    this.setState({
      show: !this.state.show,
      top: top
    })
  }

  handleSelect(index) {
    this.timer = setTimeout(() => {
      this.setState({
        show: false,
        checkedIndex: index
      })

      this.props.onSwitch(false, index)
    }, 100)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    let offset = Platform.OS === 'ios' ? 10 : 50
    return (
        <Modal style={[styles.wrapper, { top: this.state.top - offset }]}
               isVisible={this.state.show}
               animationIn='flipInX'
               animationOut='flipOutX'
               useNativeDriver={true}
               coverScreen={false}
               hasBackdrop={false}>
          <View style={[styles.arrow]} />
          <BoxShadow setting={shadowOpt}>
            <Emotion onSelected={(index) => this.handleSelect(index)}
                     checkedIndex={this.state.checkedIndex} />
          </BoxShadow>
        </Modal>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    zIndex: 999
  },
  arrow: {
    marginTop: 0,
    marginLeft: (Variable.wWdith - 40) / 2 + 15,
    backgroundColor: 'transparent',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 10,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: '#fff',
    borderRightColor: 'transparent'
  }

})


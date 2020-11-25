import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import Modal from 'react-native-modal'
import { BoxShadow } from 'react-native-shadow'
import XDate from 'xdate'
import Event from '../../base/event/event'

const shadowBtn = {
  width: 124,
  height: 36,
  radius: 18,
  color: '#FFE265',
  opacity: 0.3,
  border: 8,
  x: 1,
  y: 5,
  style: { borderRadius: 22 }
}

export default class RecordModal extends BaseComponent {

  isSkip = false

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      markId: null
    }
  }

  componentDidMount() {
  }

  show(id, emotionType) {
    this.request('/mark/roll', { dailyId: id, emotionType }).then(res => {
      if (res.code === 200) {
        this.setState({
          show: true,
          markId: res.data.id
        })

        Event.trigger(Event.HOME_LOADING)
      }
    })
  }

  hide(skip) {
    this.isSkip = skip
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
    this.hide(true)
    this.naviBack()
  }

  onModalHide() {
    if (this.isSkip) {
      return
    }

    let date = new XDate().toString('yyyy-MM-dd hh:mm:ss')
    this.props.onShowMarkShare({
      markId: this.state.markId,
      createTime: date
    })
  }

  componentWillUnmount() {
  }

  render() {
    return (
        <Modal style={styles.wrapper}
               isVisible={this.state.show}
               useNativeDriver={true}
               coverScreen={true}
               hasBackdrop={true}
               onModalHide={() => this.onModalHide()}
        >
          <View style={styles.box}>
            <View style={styles.line} />
            <View style={styles.card}>
              <View style={styles.dot} />
              <Text style={styles.title}>写完日记抽取今夜签</Text>
              <Image source={require('../../res/image/mark_icon.png')} style={styles.img} />
              <View style={styles.footer}>
                <TouchableOpacity style={styles.skipBtn} onPress={this.skip.bind(this)}>
                  <Text style={styles.skipText}>跳过</Text>
                </TouchableOpacity>
                <BoxShadow setting={shadowBtn}>
                  <TouchableOpacity style={styles.openBtn} onPress={() => this.hide()}>
                    <Text>开启夜签</Text>
                  </TouchableOpacity>
                </BoxShadow>
              </View>
            </View>

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
    position: 'absolute',
    top: 0,
    zIndex: 200,
    width: Variable.wWdith,
    alignItems: 'center'
  },
  card: {
    zIndex: 1,
    marginTop: -10,
    width: Variable.wWdith - 96,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center'
  },
  line: {
    width: 2,
    height: Variable.wHeight / 4,
    opacity: 0.9,
    borderRadius: 2,
    backgroundColor: '#fff',
    zIndex: 10
  },
  dot: {
    marginTop: 8,
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#333'
  },
  title: {
    marginTop: 22,
    fontSize: Variable.font14,
    fontWeight: '500',
    color: Variable.blue
  },
  img: {
    height: 189,
    width: 189,
    marginTop: 30
  },
  footer: {
    paddingVertical: 18,
    width: Variable.wWdith - 96,
    backgroundColor: '#5874DC',
    marginTop: 30,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  skipBtn: {
    zIndex: 100,
    minWidth: 77,
    height: 36,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20
  },
  openBtn: {
    minWidth: 124,
    height: 36,
    borderRadius: 22,
    backgroundColor: '#FACC01',
    justifyContent: 'center',
    alignItems: 'center'
  },
  skipText: {
    fontSize: Variable.font14,
    color: Variable.blue
  },
  openText: {
    fontSize: Variable.font14,
    color: '#262626'
  }
})


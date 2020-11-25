import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import Modal from 'react-native-modal'

export default class CustomModal extends BaseComponent {

  sticker = null
  id = null

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      count: 0,
      val: ''
    }
  }

  componentDidMount() {
  }

  show(data) {
    this.sticker = data
    this.id = data.customId
    this.setState({
      show: true
    })
  }

  onModalShow() {
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

  _handleInput(text) {
    this.setState({
      count: text.length,
      val: text
    })
  }

  _handleSubmit() {
    if (!this.state.val) {
      Alert.alert('提示', '文字内容不能为空')
      return
    }
    this.post('/sticker_custom/custom', {
      id: this.id || null,
      date: this.sticker.date,
      bgImg: this.sticker.bgImg,
      content: this.state.val
    }).then(resp => {
      this.hide()
      if (resp.code === 200) {
        this.props.parent.loadData(this.sticker.date)
      }
    }).catch(e => {
      this.hide()
    })
  }

  render() {
    return (
        <Modal style={styles.wrapper}
               isVisible={this.state.show}
               onModalShow={() => this.onModalShow()}
               coverScreen={true}
               hasBackdrop={false}>
          <View style={styles.box}>
            <TouchableOpacity style={styles.closeBtn}
                              onPress={() => this.hide()}
                              hitSlop={{ top: 30, bottom: 30, left: 30, right: 20 }}>
              <Image source={require('../../res/image/icon/close_icon.png')}
                     style={styles.closeImg} />
            </TouchableOpacity>
            <View style={styles.container}>
              <Text style={styles.headerTitle}>编辑文字</Text>
              <View style={styles.inputBox}>
                <TextInput style={styles.input} placeholder="写下自己喜欢的文字，生成专属打卡图"
                           placeholderTextColor="#ddd" multiline
                           maxLength={100}
                           onChangeText={this._handleInput.bind(this)}
                           textAlignVertical="top" />
                <Text style={styles.countTips}>{this.state.count}/100</Text>
              </View>
              <TouchableOpacity style={styles.btn} onPress={this._handleSubmit.bind(this)}>
                <Text>确 定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    margin: 0,
    padding: 0
  },
  box: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    width: Variable.wWdith - 40,
    borderRadius: 15
  },
  closeBtn: {
    position: 'absolute',
    top: -20,
    right: -15,
    zIndex: 100
  },
  closeImg: {
    height: 40,
    width: 40
  },
  container: {
    // marginTop: 60 + Variable.statusBarHeight,
    marginHorizontal: 20,
    marginVertical: 20
  },
  headerTitle: {
    fontSize: Variable.font16,
    color: Variable.black,
    fontWeight: '700',
    alignSelf: 'center'
  },
  inputBox: {
    marginTop: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d8d8d8'
  },
  input: {
    minHeight: 100,
    padding: 15
  },
  countTips: {
    alignSelf: 'flex-end',
    marginBottom: 5,
    marginRight: 10,
    fontSize: Variable.font12,
    color: Variable.grey
  },
  btn: {
    marginTop: 20,
    alignSelf: 'center',
    width: 180,
    height: 42,
    borderRadius: 25,
    backgroundColor: '#FACC01',
    justifyContent: 'center',
    alignItems: 'center'
  }
})


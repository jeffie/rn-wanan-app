import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import Modal from 'react-native-modal'
import Circle from '../../component/circle/circle'
import IconFont from '../../component/iconfont/iconfont'
import { AudioRecorder, AudioUtils } from 'react-native-audio'

export default class RecordModal extends BaseComponent {

  constructor(props) {
    super(props)
    this.audioPath = AudioUtils.DocumentDirectoryPath + '/' + Date.now() + '.aac'
    this.state = {
      show: false,
      recording: false,
      stop: false,
      currentTime: 0
    }
    this.handleRecording = this._handleRecording.bind(this)
    this.handleCancelRecording = this._handleCancelRecording.bind(this)
    this.startTime = 0
  }

  componentDidMount() {

  }

  show() {
    this.setState({
      show: true
    })
  }

  hide() {
    this.setState({
      show: false,
      currentTime: 0
    })
  }

  toggle() {
    this.setState({
      show: !this.state.show,
      currentTime: 0
    })
  }

  async _handleRecording() {
    try {
      this._checkPermission().then(async (auth) => {
        if (auth) {
          AudioRecorder.removeListeners()
          AudioRecorder.prepareRecordingAtPath(this.audioPath, {
            SampleRate: 16000,
            Channels: 1,
            AudioQuality: 'Low',
            AudioEncoding: 'aac',
            MeteringEnabled: true,
            AudioEncodingBitRate: 16000,
            OutputFormat: 'aac_adts'
          })

          AudioRecorder.onProgress = (data) => {
            let currentTime = Math.floor(data.currentTime)
            if (currentTime >= 60) {
              this._handleCancelRecording()
            } else {
              this.setState({ currentTime: currentTime })
            }
          }

          // 完成录音
          AudioRecorder.onFinished = (data) => {
            // data 返回需要上传到后台的录音数据
            if (data.status === 'OK') {
              let endTime = new Date().getTime()
              let cost = (endTime - this.startTime) / 1000
              this.hide()
              //this.showMsg('录音已完成')
              const duration = !data.duration ? Math.floor(cost) : Math.floor(data.duration)
              const path = data.audioFileURL
              this.props.onPreviewAudio(duration, path)
            } else {
              this.showMsg('录音失败，请重试')
            }
          }

          await AudioRecorder.startRecording()
          this.startTime = new Date().getTime()
        } else {
          this.showMsg('请先在系统设置里授权应用使用录音权限')
        }
      })
    } catch (error) {
      __DEV__ && console.log(error)
      this.showMsg('录音发生错误')
    }
  }

  async _handleCancelRecording() {
    try {
      await AudioRecorder.stopRecording()
    } catch (error) {
      this.showMsg('停止录音失败')
    }
    this.setState({ stop: true })
  }

  componentWillUnmount() {
    AudioRecorder.removeListeners()
  }

  _checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true)
    }

    const rationale = {
      'title': '请求录音权限',
      'message': '只有通过才能记录日记哦~'
    }

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale).
        then((result) => {
          return (result === true || result === PermissionsAndroid.RESULTS.GRANTED)
        })
  }

  render() {
    return (
        <Modal style={styles.wrapper}
               isVisible={this.state.show}
               useNativeDriver={true}
               coverScreen={false}
               hasBackdrop={false}>
          <View style={styles.box}>
            <Text style={styles.time}>{this.state.currentTime}''/60''</Text>
            <Text style={styles.tips}>长按话筒录音，松手结束录音</Text>
            <TouchableOpacity onPressIn={this.handleRecording}
                              onPressOut={this.handleCancelRecording} activeOpacity={0.8}>
              <Circle radius={36} percent={this.state.currentTime / 60 * 100}
                      color={Variable.yellow}
                      borderWidth={3}>
                <IconFont name="Voice" size={Variable.font38} color={Variable.yellow} />
              </Circle>
            </TouchableOpacity>
          </View>
        </Modal>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 160,
    zIndex: 200,
    width: Variable.wWdith,
    alignItems: 'center',
    margin: 0,
    padding: 0
  },
  box: {
    backgroundColor: '#25124C',
    width: Variable.wWdith - 120,
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center'
  },
  time: {
    marginBottom: 10,
    fontSize: Variable.font14,
    color: '#E36B77'
  },
  tips: {
    fontSize: Variable.font14,
    color: '#3A4A84',
    marginBottom: 24
  }

})


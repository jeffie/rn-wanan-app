import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Platform
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import Sound from 'react-native-sound'
import LottieView from 'lottie-react-native'
import FS from 'react-native-fs'

export default class AudioPlayer extends BaseComponent {
  soundPlayer = null
  playing = false
  static currentId = 0

  constructor(props) {
    super(props)
    this.state = {
      playing: false,
      time: 0
    }
    this.onPressAudio = this._onPressAudio.bind(this)
  }

  componentDidMount() {
    if (this.props.navigation) {
      this.blurSubscription = this.props.navigation.addListener('willBlur', () => {
        this._onStopPlay()
        this.soundPlayer && this.soundPlayer.release()
        this.clearTemp()
      })
    }
  }

  _onPressAudio(id) {
    // 不相等且处于playing状态，先停止，再播放
    if (id !== AudioPlayer.currentId) {
      this._onStopPlay(this._init(id))
    } else {
      if (!this.state.playing) {
        this._init(id)
      } else {
        this._onStopPlay()
      }
    }
  }

  _init(id) {
    let audioUrl = this.props.audioUrl
    if (audioUrl && audioUrl.indexOf('file://') > -1 && Platform.OS === 'android') {
      audioUrl = audioUrl.replace('file://', '')
    }
    this.soundPlayer = new Sound(audioUrl, '', (error) => {
      if (error) {
        __DEV__ && console.log(audioUrl, error)
        this.showMsg('failed to load the sound')
        return
      }
      AudioPlayer.currentId = id
      // start
      this._onStartPlay()
    })
  }

  _onStartPlay() {
    this.processInterval = setInterval(() => {
      this.soundPlayer && this.soundPlayer.getCurrentTime((seconds) => {
        const current = Math.floor(seconds)
        let leftTime = parseInt(this.props.duration) - current
        leftTime = leftTime < 0 ? 0 : leftTime
        this.setState({
          time: leftTime,
          playing: true
        })
      })
    }, 500)
    // Play the sound with an onEnd callback
    this.soundPlayer.play((success) => {
      this.processInterval && clearInterval(this.processInterval)
      this.setState({
        playing: false,
        time: this.props.duration
      })
      if (!success) {
        this.showMsg('播放失败')
      }
    })

    this.props.pauseOtherPlay && this.props.pauseOtherPlay(this, this.props.itemId)
    this.props.onAudioClick && this.props.onAudioClick(this)
  }

  _onStopPlay(callback) {
    this.processInterval && clearInterval(this.processInterval)
    this.setState({
      playing: false,
      time: 0
    }, () => {
      this.soundPlayer && this.soundPlayer.stop(() => {
        callback && callback()
      })
    })
  }

  _handleCancelVoice() {
    this.setState({
      playing: false,
      time: 0
    })
    this.props.onAudioCancel()
    this.clearTemp()
  }

  componentWillUnmount() {
    this._onStopPlay()
    this.blurSubscription && this.blurSubscription.remove()
    this.clearTemp()
  }

  clearTemp() {
    if (this.props.audioUrl && this.props.audioUrl.indexOf('http') < 0) {
      let url = this.props.audioUrl
      FS.exists(url).then((exists) => {
        exists && FS.unlink(url).catch((e) => {})
      })
    }
  }

  render() {
    if (!this.props.audioUrl) {
      return <View />
    }
    this.playing = this.state.playing
    let duration = this.state.time === 0 ? this.props.duration : this.state.time
    // duration = !this.playing ? this.props.duration : duration
    this.playing = AudioPlayer.currentId === this.props.itemId ? this.playing : false

    return (
        <TouchableOpacity style={[styles.voiceBox, this.props.style]}
                          onPress={() => this._onPressAudio(this.props.itemId)} activeOpacity={1}>
          <Text style={styles.voiceTime}>{duration}S''</Text>
          {!this.playing ?
              <Image source={require('../../res/image/voice.png')} style={styles.voiceImg} />
              : this.renderAnimal()
          }
          {this.renderClose()}
        </TouchableOpacity>
    )
  }

  renderClose() {
    if (!this.props.onAudioCancel) {
      return <View />
    }
    return (
        <TouchableOpacity onPress={() => this._handleCancelVoice()}
                          style={{ zIndex: 100 }}
                          hitSlop={{
                            top: 30,
                            bottom: 30,
                            left: 30,
                            right: 20
                          }}>
          <Image source={require('../../res/image/icon/close_icon.png')}
                 style={styles.closeBtn} />
        </TouchableOpacity>
    )
  }

  renderAnimal() {
    return (
        <View style={{ flexDirection: 'row' }}>
          <LottieView source={require('../../res/data/wave.json')}
                      style={styles.voiceAnimal}
                      autoPlay loop />
          <LottieView source={require('../../res/data/wave.json')}
                      style={styles.voiceAnimal}
                      progress={0.3}
                      autoPlay loop />
        </View>
    )
  }
}
const styles = StyleSheet.create({
  voiceBox: {
    marginVertical: 32,
    marginHorizontal: 20,
    height: 48,
    borderRadius: 8,
    backgroundColor: Variable.blue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20
  },
  voiceTime: {
    fontSize: Variable.font12,
    color: '#fff'
  },
  voiceImg: {
    flex: 1,
    height: 32,
    resizeMode: 'contain'
  },
  closeBtn: {
    width: 28,
    height: 28,
    position: 'absolute',
    right: -12,
    top: -32,
    zIndex: 10
  },
  voiceAnimal: {
    height: 25
  }
})


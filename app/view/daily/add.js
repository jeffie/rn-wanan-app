import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  Keyboard
} from 'react-native'
import BaseComponent from '../../base/base'
import Geo from '../../base/geo/geo'
import IconFont from '../../component/iconfont/iconfont'
import { Variable } from '../../res/style/variable'
import Emotion from '../common/emotion'
import { AudioRecorder } from 'react-native-audio'
import RecordModal from './record_modal'
import AudioPlayer from './audio_player'
import ImageUpload from './image_upload'
import MarkTipsModal from './mark_tips_modal'
import ImageModal from '../common/image_modal'
import MarkShareModal from '../mark/mark_modal'
import Event from '../../base/event/event'
import XDate from 'xdate'

export default class AddDaily extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      num: 500,
      imgUrl: null,
      imgSize: null,
      duration: 0,
      audioUrl: null,
      checkedIndex: 0,
      content: null
    }

    this.id = this.getRouterParams().id

    this.handleInput = this._handleInput.bind(this)
    this.handleImgUpload = this._handleImgUpload.bind(this)
    this.handleRecord = this._handleRecord.bind(this)

    this.onImgUploaded = this._onImgUploaded.bind(this)
    this.onPreviewAudio = this._onPreviewAudio.bind(this)
    this.onAudioCancel = this._onAudioCancel.bind(this)
  }

  componentDidMount() {
    if (this.id) {
      this.request('/daily/detail', { id: this.id }).then(res => {
        if (res.code === 200) {
          const data = res.data
          let len = data.content ? data.content.length : 0
          this.setState({
            data: data,
            num: 500 - len,
            duration: data.audioTime,
            imgUrl: data.imgUrl,
            audioUrl: data.audioUrl,
            checkedIndex: data.emotionType - 1,
            content: data.content
          })
        }
      })
    }
  }

  handleSelect(index) {
    this.setState({
      checkedIndex: index
    })
  }

  _handleInput(text) {
    let len = text.length
    let num = 500 - len > 0 ? 500 - len : 0
    this.setState({
      num: num,
      content: text
    })
  }

  _handleImgUpload() {
    this.refs.imgUpload._handleImgUpload()
  }

  _handleRecord() {
    AudioRecorder.requestAuthorization().then(isAuthor => {
      if (!isAuthor) {
        alert('请前往设置中开启录音权限')
        return
      }
      this.refs.record.toggle()
    })
  }

  _onImgUploaded(imgUrl, imgSize) {
    this.setState({
      imgUrl: imgUrl,
      imgSize: imgSize
    })

    this.timer = setTimeout(() => {
      this.scroll.scrollToEnd()
    }, 0)
  }

  _onImgClick() {
    this.imgModal.show(this.state.imgUrl)
  }

  _onPreviewAudio(duration, path) {
    this.setState({
      duration: duration,
      audioUrl: path
    })
  }

  _onAudioCancel() {
    this.setState({
      duration: 0,
      audioUrl: null
    })
  }

  _onShowMarkShare(data) {
    this.markShare && this.markShare.show(data)
  }

  getDate() {
    let date = new XDate()
    date = date.toString('yyyy-MM-dd')
    return date
  }

  async onSubmit() {
    Keyboard.dismiss()
    let { checkedIndex, imgUrl, imgSize, audioUrl, duration, content } = this.state
    if (checkedIndex === -1) {
      this.showMsg('请选择你今天的心情')
      return
    }

    this.showLoading()

    let addr = ''
    try {
      const geo = Geo.getPositions()
      addr = await geo
    } catch (e) {
      __DEV__ && console.log(e)
    }

    if (imgUrl && imgUrl.indexOf('http') < 0) {
      imgUrl = this.uploadImg()
    }
    if (audioUrl && audioUrl.indexOf('http') < 0) {
      audioUrl = this.uploadAudio()
    }

    try {
      imgUrl = imgUrl && await imgUrl
      audioUrl = audioUrl && await audioUrl
    } catch (e) {
      this.hideLoading()
      this.showMsg('上传失败，请重试')
      return
    }

    if (!content && !imgUrl && !audioUrl) {
      this.hideLoading()
      this.showMsg('日记内容不能为空哟~')
      return
    }

    if (this.id) {
      this.post('/daily/update', {
        id: this.id,
        content: content,
        imgUrl,
        imgSize,
        audioUrl,
        audioTime: duration,
        emotionType: checkedIndex + 1
      }).then(res => {
        if (res.code === 200) {
          this.hideLoading()
          Event.trigger(Event.HOME_LOADING)
          this.naviTo('Home')
        } else {
          this.hideLoading()
          this.showMsg(res.msg)
        }
      }).catch(e => {
        this.hideLoading()
      })
    } else {
      this.post('/daily/add', {
        content: content,
        imgUrl,
        imgSize,
        audioUrl,
        audioTime: duration,
        emotionType: checkedIndex + 1,
        location: addr
      }).then(res => {
        if (res.code === 200) {
          this.hideLoading(() => {
            // 显示抽取夜签
            this.markTips.show(res.data.id, checkedIndex + 1)
          })
        } else {
          this.hideLoading()
          this.showMsg(res.msg)
        }
      }).catch(e => {
        this.hideLoading()
      })
    }

  }

  uploadImg() {
    let formData = new FormData()
    const { imgUrl } = this.state
    let name = 'img.jpg'
    if (Platform.OS === 'android' && imgUrl) {
      let index = imgUrl.lastIndexOf('\/')
      name = name || imgUrl.substr(index + 1, imgUrl.length)
    }

    formData.append('file', {
      uri: imgUrl,
      type: 'multipart/form-data',
      name: name
    })
    return this.post('/daily/upload', formData, {
      'Content-Type': 'multipart/form-data'
    }).then(res => {
      return res.data.url
    }).catch(e => {
      return Promise.reject(e)
    })
  }

  uploadAudio() {
    let formData = new FormData()
    const { audioUrl } = this.state

    formData.append('file', {
      uri: audioUrl,
      type: 'multipart/form-data',
      name: 'audio.aac'
    })
    return this.post('/daily/uploadAudio', formData, {
      'Content-Type': 'multipart/form-data'
    }).then(res => {
      return res.data.url
    }).catch(e => {
      __DEV__ && console.log(e)
      return Promise.reject(e)
    })
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
    AudioRecorder.removeListeners()
    //Event.removeListener(Event.HOME_LOADING)
  }

  render() {
    if (this.id && !this.state.data) {
      return <View />
    }
    const hasImg = !!this.state.imgUrl
    const hasAudio = !!this.state.audioUrl

    return (
        <SafeAreaView style={styles.wrapper}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => {this.naviBack()}}
                              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <IconFont name="Back" size={Variable.font20} color="#E5E5E5" />
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                              onPress={this.showCalendar}>
              <Text style={styles.title}>{this.getDate()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {this.onSubmit()}}
                              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <IconFont name="Submit" size={Variable.font20} color="#E5E5E5" />
            </TouchableOpacity>
          </View>
          <View style={styles.scrollBox}>
            <ScrollView ref={(ref) => this.scroll = ref} showsVerticalScrollIndicator={false}>
              <View style={styles.emotionBox}>
                <Text style={styles.emotionText}>今天你的心情是</Text>
                <Emotion style={{ marginTop: 25 }} onSelected={(index) => this.handleSelect(index)}
                         checkedIndex={this.state.checkedIndex} />
              </View>

              <View style={styles.editorBox}>
                <View style={styles.line} />
                <TextInput style={styles.input} maxLength={500} multiline
                           placeholderTextColor="#3A4A84"
                           placeholder="记录每日心情，疗愈自我…"
                           onChangeText={this.handleInput}
                           value={this.state.content}
                           returnKeyType="send"
                />
                <Text style={styles.inputNum}>{this.state.num}/500</Text>
                <View style={styles.line} />
              </View>

              <AudioPlayer audioUrl={this.state.audioUrl}
                           duration={this.state.duration}
                           onAudioCancel={this.onAudioCancel} />

              <ImageUpload ref="imgUpload"
                           onImgUploaded={this.onImgUploaded}
                           onImgClick={() => this._onImgClick()}
                           value={this.state.imgUrl} />

              <View style={{ height: 300 }} />
            </ScrollView>
          </View>

          <View style={styles.btnBox}>
            <TouchableOpacity onPress={this.handleImgUpload} disabled={hasImg}
                              style={[styles.imgIcon, hasImg && styles.disabled]}>
              <IconFont name="Img" size={Variable.font30} color={hasImg ? '#3A4A84' : '#e5e5e5'} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.imgIcon, hasAudio && styles.disabled]}
                              onPress={this.handleRecord} disabled={hasAudio}>
              <IconFont name="Voice" size={Variable.font30}
                        color={hasAudio ? '#3A4A84' : '#e5e5e5'} />
            </TouchableOpacity>
          </View>

          <RecordModal ref="record" onPreviewAudio={this.onPreviewAudio} />
          <MarkTipsModal ref={(ref) => this.markTips = ref}
                         onShowMarkShare={(data) => this._onShowMarkShare(data)} />
          <ImageModal ref={(ref) => this.imgModal = ref} />
          <MarkShareModal ref={(ref) => this.markShare = ref} />
        </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Variable.main_bg
  },
  header: {
    ...Variable.headerStyle,
    ...Platform.select({
      ios: {
        height: 60
      }
    }),
    justifyContent: 'space-between'
  },
  title: {
    fontSize: Variable.font16,
    color: '#E5E5E5',
    fontWeight: '600'
  },
  scrollBox: {},
  emotionBox: {
    marginTop: 17,
    paddingHorizontal: 20
  },
  emotionText: {
    fontSize: Variable.font14,
    color: '#e5e5e5',
    fontWeight: '400'
  },
  editorBox: {
    paddingHorizontal: 17,
    marginTop: 23
  },
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#3A4A84'
  },
  input: {
    minHeight: 110,
    marginVertical: 15,
    textAlignVertical: 'top',
    color: '#e5e5e5',
    fontSize: Variable.font14,
    lineHeight: 24
  },
  inputNum: {
    alignSelf: 'flex-end',
    fontSize: Variable.font14,
    color: '#3A4A84',
    marginBottom: 5
  },
  imgIcon: {
    height: 64,
    width: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabled: {
    borderColor: '#3A4A84'
  },
  btnBox: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 30,
    width: Variable.wWdith,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
    backgroundColor: Variable.main_bg
  }

})


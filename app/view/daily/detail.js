import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Alert,
  TextInput,
  Platform,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import IconFont from '../../component/iconfont/iconfont'
import { Variable } from '../../res/style/variable'
import Emotion from '../common/emotion'
import AudioPlayer from './audio_player'
import Event from '../../base/event/event'
import FastImage from 'react-native-fast-image'
import ShareModal from '../common/share_modal'
import ImageModal from '../common/image_modal'

import XDate from 'xdate'

export default class AddDaily extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    const { id, from, date } = this.getRouterParams()
    let url = ''
    let params = {}
    if (from === 'list') {
      url = '/daily/detail'
      params = { id: id }
    } else {
      url = '/daily/detailByDate'
      params = { date: date }
    }
    this.request(url, params).then(res => {
      if (res.code === 200) {
        this.setState({
          data: res.data
        })
      } else {
        this.showMsg(res.msg)
      }
    })
  }

  handleDelete(id) {
    Alert.alert('删除', '确定删除清爽告别这一天吗？', [
      {
        text: '取消',
        style: 'cancel'
      },
      {
        text: '确定',
        onPress: () => {
          this.post('/daily/delete', { id }).then(res => {
            if (res.code === 200) {
              Event.trigger(Event.HOME_LOADING)
              this.showMsg('删除成功')
              this.naviTo('Home')
            } else {
              this.showMsg(res.msg)
            }
          })
        }
      }
    ])
  }

  handleEdit(id) {
    this.naviTo('AddDaily', { id })
  }

  handleShare(data) {
    this.shareModal.show(data)
  }

  componentWillUnmount() {
    //Event.removeListener(Event.HOME_LOADING)
  }

  render() {
    const { data } = this.state

    const hasImg = !!data.imgUrl
    const hasAudio = !!data.audioUrl
    let date = null
    if (data.createTime) {
      data.createTime = data.createTime && data.createTime.replace('T', ' ')
      date = new XDate(data.createTime)
      date = date.toString('yyyy-MM-dd')
    }

    return (
        <SafeAreaView style={styles.wrapper}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => {this.naviBack()}}>
              <IconFont name="Back" size={Variable.font20} color="#E5E5E5" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerTitle}
                              onPress={this.showCalendar}>
              <Text style={styles.title}>{date}</Text>
            </TouchableOpacity>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <TouchableOpacity onPress={() => this.handleDelete(data.id)} style={styles.options}
                                hitSlop={{ top: 20, bottom: 20 }}>
                <IconFont name="Delete" size={Variable.font18} color="#E5E5E5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleEdit(data.id)} style={styles.options}
                                hitSlop={{ top: 20, bottom: 20 }}>
                <IconFont name="Editor" size={Variable.font18} color="#E5E5E5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleShare(data)}
                                style={[styles.options, { alignItems: 'flex-end' }]}
                                hitSlop={{ top: 20, bottom: 20 }}>
                <IconFont name="Share" size={Variable.font18} color="#E5E5E5" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.scrollBox}>
            <ScrollView >
              <View style={styles.emotionBox}>
                <Text style={styles.emotionText}>今天你的心情是</Text>
                <Emotion style={{ marginTop: 25 }} checkedIndex={data.emotionType - 1} />
              </View>

              <View style={styles.editorBox}>
                <View style={styles.line} />
                <TextInput style={styles.input} autoFocus maxLength={100} multiline
                           placeholderTextColor="#3A4A84"
                           placeholder="记录每日心情，疗愈自我…"
                           onChangeText={this.handleInput}
                           editable={false}
                           value={data.content}
                />
                <View style={styles.line} />
              </View>

              <AudioPlayer audioUrl={data.audioUrl}
                           duration={data.audioTime} />

              {hasImg &&
              <TouchableOpacity onPress={() => this.imgModal.show(data.imgUrl)}>
                <View style={[styles.line, { marginHorizontal: 20 }]} />
                <FastImage source={{ uri: data.imgUrl }} style={styles.imgPreview} />
              </TouchableOpacity>
              }

              <View style={{ height: 120 }} />
            </ScrollView>
          </View>
          <ShareModal ref={(ref) => this.shareModal = ref} />
          <ImageModal ref={(ref) => this.imgModal = ref} />
        </SafeAreaView>
    )
  }
}

const imgWidth = Variable.wWdith - 40
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
  headerTitle: {
    marginLeft: 20
  },
  title: {
    fontSize: Variable.font16,
    color: '#E5E5E5',
    fontWeight: '600'
  },
  scrollBox: {
    height: Variable.wHeight
  },
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
  },
  imgPreview: {
    marginHorizontal: 20,
    marginTop: 30,
    width: imgWidth,
    height: imgWidth / 233 * 177,
    borderRadius: 4
  },
  options: {
    width: 40,
    alignItems: 'center'
  }

})


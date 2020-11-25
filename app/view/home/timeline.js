'use strict'

import React, { Component } from 'react'
import {
  StyleSheet,
  FlatList,
  Image,
  View,
  Text,
  RefreshControl,
  TouchableOpacity
} from 'react-native'
import { Variable } from '../../res/style/variable'
import BaseComponent from '../../base/base'
import IconFont from '../../component/iconfont/iconfont'
import FastImage from 'react-native-fast-image'
import AudioPlayer from '../daily/audio_player'

const defaultCircleSize = 10
const defaultCircleColor = '#170A32'
const defaultLineWidth = 1
const defaultLineColor = '#3A4A84'
const defaultDotColor = '#3A4A84'

const emotionMap = [
  require('../../res/image/icon/icon_joy.png'),
  require('../../res/image/icon/icon_angry.png'),
  require('../../res/image/icon/icon_cry.png'),
  require('../../res/image/icon/icon_happy.png'),
  require('../../res/image/icon/icon_sad.png'),
  require('../../res/image/icon/icon_bitter.png')
]

export default class Timeline extends BaseComponent {

  playingItem = null
  currentId = null

  constructor(props, context) {
    super(props, context)

    this._renderRow = this._renderRow.bind(this)
    this.renderTime = this._renderTime.bind(this)
    this.renderDetail = this._renderDetail.bind(this)
    this.renderCircle = this._renderCircle.bind(this)
    this.renderEvent = this._renderEvent.bind(this)
    this.renderArrow = this._renderArrow.bind(this)
    this.renderEmotion = this._renderEmotion.bind(this)

    this.state = {
      x: 0,
      y: 0,
      width: 0
    }
  }

  onPullRefresh() {
    this.props.onPullRefresh()
  }

  loadMore() {
    this.props.onLoadMore()
  }

  onItemClick(id) {
    this.naviTo('DailyDetail', { id: id, from: 'list' })
  }

  onShare(item) {
    this.props.onShare(item)
  }

  onImgClick(url) {
    this.props.onImgClick(url)
  }

  pauseOtherPlay(item, id) {
    this.playingItem && this.playingItem.playing && this.playingItem !== item &&
    this.playingItem._onPressAudio(id)
  }

  onAudioClick(item) {
    this.playingItem = item
  }

  componentWillUnmount() {
  }

  render() {
    return (
        <View style={[styles.container, this.props.style]}>
          <FlatList
              ref="listView"
              style={[styles.listview, this.props.listViewStyle]}
              data={this.props.data}
              showsVerticalScrollIndicator={false}
              renderItem={this._renderRow}
              keyExtractor={item => item.id + ''}
              refreshControl={this._renderRefresh()}
              onEndReached={() => {this.loadMore()}}
              onEndReachedThreshold={0.3}
              {...this.props.options}
          />
        </View>
    )
  }

  _renderRefresh() {
    return (
        <RefreshControl
            refreshing={this.props.refreshing || false}
            onRefresh={() => this.onPullRefresh()}
            colors={['#27b5ff', '#1d8eff']}
            tintColor={'#27b5ff'}
            titleColor='#1d8eff'
            title="小安正在帮你努力加载哟..."
        />
    )
  }

  _renderRow({ item, index }) {
    return (
        <View key={index}>
          <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
            {this.renderTime(item, index)}
            {this.renderEvent(item, index)}
            {this.renderCircle(item, index)}
            {this.renderArrow()}
            {this.renderEmotion(item)}
          </View>
        </View>
    )
  }

  _renderTime(item, rowID) {
    return (
        <View style={[styles.timeContainer, this.props.timeContainerStyle]}>
          <Text style={[styles.time, { color: '#666' }]}>
            <Text style={styles.bigTime}>{item.day} </Text>
            {item.week}
          </Text>
          <Text style={[styles.time, this.props.timeStyle]}>
            {item.year}.{item.month}
          </Text>
        </View>
    )
  }

  _renderEvent(rowData, rowID) {

    let opStyle = {
      borderLeftColor: defaultLineColor,
      borderLeftWidth: defaultLineWidth,
      marginLeft: 10,
      paddingLeft: 15
    }

    return (
        <View
            style={[styles.details, opStyle]}
            onLayout={evt => {
              if (!this.state.x && !this.state.width) {
                const { x, y, width } = evt.nativeEvent.layout
                this.setState({ x, y, width })
              }
            }}
        >
          <TouchableOpacity
              disabled={this.props.onEventPress == null}
              style={[this.props.detailContainerStyle]}
              onPress={() =>
                  this.props.onEventPress ? this.props.onEventPress(rowData) : null
              }
          >
            {this.renderDetail(rowData, rowID)}
          </TouchableOpacity>
        </View>
    )
  }

  _renderDetail(item, rowID) {
    let boxWidth = this.state.width - 44
    let text = null, img = null, audio = null
    if (item.content) {
      text = (
          <Text style={[styles.content, this.props.contentStyle]}>
            {item.content}
          </Text>
      )
    }
    if (item.audioUrl) {
      audio = (
          <AudioPlayer
              ref={(ref) => this.audioPlayer = ref}
              style={styles.audioBox}
              navigation={this.props.navigation}
              itemId={item.id}
              audioUrl={item.audioUrl}
              duration={item.audioTime}
              pauseOtherPlay={(target, id) => this.pauseOtherPlay(target, id)}
              onAudioClick={(target) => this.onAudioClick(target)}
          />
      )
    }
    if (item.imgUrl) {
      let relativeH = 177
      if (item.imgSize) {
        let imgSizeArr = item.imgSize.split(',')
        const width = imgSizeArr[0]
        const height = imgSizeArr[1]
        relativeH = height / width * boxWidth
      }

      img = (
          <TouchableOpacity onPress={() => this.onImgClick(item.imgUrl)} activeOpacity={1}>
            <FastImage source={{ uri: item.imgUrl }}
                       style={[styles.detailImg, { width: boxWidth, height: relativeH }]} />
          </TouchableOpacity>
      )
    }

    let height1 = 0, height2 = 0
    if (text && (audio || img)) {
      height1 = 15
    }
    if (audio && img) {
      height2 = 15
    }

    return (
        <TouchableOpacity style={styles.detail} onPress={() => this.onItemClick(item.id)}>
          {text}
          <View style={{ height: height1 }} />
          {audio}
          <View style={{ height: height2 }} />
          {img}
          <View style={styles.detailFooter}>
            <Text style={styles.footerText}>{item.time}{'  '} {item.location || ''}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 15 }}
                                onPress={() => this.props.onMark(item)}>
                <IconFont name="Mark" color="#5874DC" size={Variable.font16} />
              </TouchableOpacity>

              <TouchableOpacity hitSlop={{ top: 20, bottom: 20, right: 15 }}
                                onPress={() => this.onShare(item)}>
                <IconFont name="Share" color="#5874DC" size={Variable.font16}
                          style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
    )
  }

  _renderCircle(item, rowID) {
    let circleSize = defaultCircleSize

    let circleStyle = {
      width: this.state.x ? circleSize : 0,
      height: this.state.x ? circleSize : 0,
      borderRadius: circleSize / 2,
      backgroundColor: defaultCircleColor,
      left: this.state.x - circleSize / 2 + (defaultLineWidth - 1) / 2,
      top: this.state.y + 20
    }
    return (
        <View style={[styles.circle, circleStyle, this.props.circleStyle]} />
    )
  }

  _renderArrow() {
    let arrowStyle = {
      left: this.state.x,
      top: this.state.y + 16
    }
    return (
        <View style={[styles.arrow, arrowStyle]} />
    )
  }

  _renderEmotion(item) {
    let emotionStyle = {
      left: this.state.x - 10,
      top: this.state.y + 44
    }

    const url = emotionMap[item.emotionType - 1]
    return (
        <Image style={[styles.emotion, emotionStyle]}
               source={url} />
    )
  }
}

Timeline.defaultProps = {
  circleSize: defaultCircleSize,
  circleColor: defaultCircleColor
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 10
  },
  listview: {
    flex: 1,
    paddingTop: 10
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center'
  },
  timeContainer: {},
  time: {
    textAlign: 'justify',
    color: Variable.light_grey,
    fontSize: Variable.font12,
    fontWeight: '400'
  },
  bigTime: {
    fontVariant: ['tabular-nums'],
    fontSize: Variable.font20,
    color: '#E5E5E5',
    fontWeight: '500'
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    borderWidth: 1,
    borderColor: defaultDotColor
  },
  details: {
    borderLeftWidth: defaultLineWidth,
    flexDirection: 'column',
    flex: 1
  },
  detail: {
    minHeight: 30,
    marginBottom: 8,
    padding: 14,
    borderRadius: 4,
    backgroundColor: Variable.content_bg
  },
  content: {
    fontSize: Variable.font14,
    lineHeight: 22,
    color: '#E5E5E5'
  },
  audioBox: {
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: Variable.blue,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  duration: {
    fontSize: Variable.font12,
    fontWeight: '400',
    color: '#fff'
  },
  voiceImg: {
    height: 20,
    flex: 1
  },
  detailImg: {
    resizeMode: 'cover'
  },
  arrow: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 8,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: Variable.content_bg
  },
  emotion: {
    position: 'absolute',
    width: 20,
    height: 20
  },
  detailFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerText: {
    fontSize: Variable.font10,
    color: '#c4c4c4'
  }
})

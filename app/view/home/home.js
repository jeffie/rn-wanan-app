import React from 'react'
import {
  StyleSheet,
  StatusBar,
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView
} from 'react-native'
import { Variable } from '../../res/style/variable'
import { observer, inject } from 'mobx-react'
import BaseComponent from '../../base/base'
import MessageData from '../../base/storage/data/message'
import Event from '../../base/event/event'
import { dateTrim } from '../../component/calendar/dateutils'
import Header from './header'
import TimeLine from './timeline'
import EModal from './emotion_modal'
import CModal from './calendar_modal'
import ShareModal from '../common/share_modal'
import Init from './init'
import ImageModal from '../common/image_modal'
import MarkModal from '../mark/mark_modal'
import BootData from '../../base/storage/data/boot'
import DailyData from '../../base/storage/data/daily'

@inject(['tabBadgeStore'])
@observer
export default class Home extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  query = {
    pageNum: 1,
    pageSize: 10
  }

  newData = []
  currentData = []

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      init: false,
      refreshing: false,
      todayMarked: false
    }

    this.store = this.props.tabBadgeStore || {}
    this.hideCModal = this.hideCModal.bind(this)

    this.navi().setParams({ callback: this.hideCModal })
  }

  hideCModal() {
    this.cModal && this.cModal.hide()
  }

  async loadData(params = {}, loadMore = false) {
    if (!loadMore) {
      this.newData = []
    }

    this.query.lastTime = await MessageData.getLastTime()

    this.query = Object.assign(this.query, params)
    this.request('/daily/list', this.query).then(res => {
      if (res.msg === 'uninit') {
        this.isInit()
        DailyData.refreshCache(null)
      } else if (res.code === 200) {
        const { list, msgNum, todayMarked } = res.data
        this.currentData = this._buildData(list)
        this.newData = this.newData.concat(this.currentData)
        this.setState({
          data: this.newData,
          refreshing: false,
          init: false,
          todayMarked
        })

        if (!loadMore) {
          DailyData.refreshCache(this.newData)
        }
        // 新消息显示
        msgNum > 0 && this.store.add('Profile', msgNum)
      } else {
        this.showMsg(res.msg)
      }
    })
  }

  async componentDidMount() {
    // 数据初始化
    let init = await BootData.getInit()
    if (init) {
      let cacheData = await DailyData.getData()
      if (cacheData) {
        this.setState({
          data: cacheData
        })
      }
      this.loadData()
    } else {
      this.naviTo('Boot')
    }

    Event.addListener(Event.HOME_LOADING, 'homeLoading', () => {
      this.query.pageNum = 1
      this.loadData()
    })

    this.blurSubscription = this.props.navigation.addListener('willBlur', () => {
      this.cModal && this.cModal.hide()
    })

    this.checkUpdate()
  }

  async checkUpdate() {
    Event.trigger(Event.APP_UPGRADE)
  }

  handleEModalShow(top) {
    this.eModal.toggle(top)
  }

  handleEModalSwitch(hide, index) {
    this.cModal.hide()
    this.refs.header.onSwitch(hide, index)
    const emotionType = index + 1
    this.loadData({ emotionType, pageNum: 1 })
  }

  handleCalendarShow(top) {
    this.cModal.toggle(top)
  }

  onPullRefresh() {
    this.setState({
      refreshing: true
    })
    this.query.pageNum = 1
    this.loadData()
  }

  onLoadMore() {
    if (!this.isLastPage()) {
      this.query.pageNum += 1
      this.loadData(null, true)
    }
  }

  isLastPage() {
    return this.currentData.length < this.query.pageSize
  }

  isInit() {
    this.setState({
      init: true
    })
  }

  onItemShare(item) {
    this.shareModal.show(item)
  }

  onImgClick(url) {
    this.imgModal.show(url)
  }

  onAddClick() {
    if (!this.state.todayMarked) {
      this.naviTo('AddDaily')
    } else {
      this.showMsg('今天的日记已经完成，明天再来记录吧~')
    }
  }

  onMark(item) {
    this.markModal.show(item)
  }

  _buildData(list) {
    let newData = []
    list.forEach(item => {
      // 时间处理
      item = dateTrim(item)
      newData.push(item)
    })

    return newData
  }

  componentWillUnmount() {
    this.blurSubscription && this.blurSubscription.remove()
  }

  render() {
    if (this.state.init) {
      return this.renderInit()
    }

    const { data } = this.state
    let showView = null
    if (data == null) {
      showView = this.renderLoading()
    } else if (data && data.length > 0) {
      showView = this.renderMain()
    } else {
      showView = this.renderEmpty()
    }

    return (
        <SafeAreaView style={styles.container}>
          <StatusBar translucent={true}
                     backgroundColor="transparent"
                     barStyle="light-content" />
          <Header ref="header"
                  todayMarked={this.state.todayMarked}
                  onShowCModal={this.handleCalendarShow.bind(this)}
                  onShowEModal={this.handleEModalShow.bind(this)} />
          {showView}
          <ImageModal ref={(ref) => this.imgModal = ref} />
          <CModal ref={(ref) => this.cModal = ref} />
          <EModal ref={(ref) => this.eModal = ref}
                  onSwitch={(show, index) => this.handleEModalSwitch(show, index)} />
          <ShareModal ref={(ref) => this.shareModal = ref} />
          <MarkModal ref={(ref) => this.markModal = ref} />
          <TouchableOpacity style={styles.editor} onPress={() => this.onAddClick()}>
            <Image source={require('../../res/image/edit_hover.png')} style={styles.img} />
          </TouchableOpacity>
        </SafeAreaView>
    )
  }

  renderInit() {
    return (
        <Init />
    )
  }

  renderEmpty() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>暂无数据</Text>
        </View>
    )
  }

  renderMain() {
    return (
        <TimeLine
            ref={(ref) => this.timeline = ref}
            innerCircle={'dot'}
            data={this.state.data}
            navigation={this.props.navigation}
            onPullRefresh={() => this.onPullRefresh()}
            onLoadMore={() => this.onLoadMore()}
            onShare={(item) => this.onItemShare(item)}
            onMark={(item) => this.onMark(item)}
            onImgClick={(url) => this.onImgClick(url)}
        />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Variable.main_bg
  },
  editor: {
    position: 'absolute',
    bottom: 24,
    right: 8
  },
  img: {
    height: 72,
    width: 72
  }

})
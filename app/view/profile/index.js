import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
import { BoxShadow } from 'react-native-shadow'
import Event from '../../base/event/event'
import LoginData from '../../base/storage/data/login'
import FastImage from 'react-native-fast-image'
import { observer, inject } from 'mobx-react'
import ShareModal from '../common/share_modal'
import * as StoreReview from 'react-native-store-review'

const shadowOpt = {
  width: Variable.wWdith - 40,
  height: 147,
  color: '#3C4CAC',
  opacity: 0.08,
  border: 20,
  radius: 8,
  x: 0,
  y: 8,
  style: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 20
  }
}

const shadowOpt2 = {
  ...shadowOpt,
  height: 196,
  style: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10
  }
}

@inject(['tabBadgeStore'])
@observer
export default class Profile extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  constructor(props) {
    super(props)
    this.itemBox1 = [
      {
        text: '提醒写日记',
        icon: 'Clock',
        tips: '未设置',
        onPress: () => this.naviTo('ProfilePrompt')
      },
      {
        text: '系统通知',
        icon: 'Message',
        hasMsg: true,
        onPress: () => this.naviTo('Message')
      },
      {
        text: 'VIP 会员',
        icon: 'Vip',
        onPress: () => this.showMsg('功能开发中')
      }
    ]

    this.itemBox2 = [
      {
        text: '意见反馈',
        icon: 'Feedback',
        onPress: () => this.naviTo('Report')
      },
      {
        text: '分享给好友',
        icon: 'ShareFriend',
        onPress: () => this.handleShare()
      },
      {
        text: '关于我们',
        icon: 'AboutUs',
        onPress: () => this.naviTo('AboutUs')
      },
      {
        text: '退出登录',
        icon: 'Logout',
        onPress: () => this.logout()
      }
    ]

    this.state = {
      data: {},
      refreshing: false
    }

    this.store = this.props.tabBadgeStore || {}
  }

  componentDidMount() {
    this.loadData(true)
    Event.addListener(Event.PROFILE_LOADING, 'refreshProfile', () => {
      this.loadData()
    })
  }

  loadData(showLoading) {
    showLoading && this.showLoading()
    this.request('/member/info').then(res => {
      showLoading && this.hideLoading()
      if (res.code === 200) {
        this.setState({
          data: res.data,
          refreshing: false
        })
      }
    })
  }

  logout() {
    LoginData.clear()
    this.naviToLogin()
  }

  handleShare() {
    this.shareModal.show({})
  }

  onPullRefresh() {
    this.setState({
      refreshing: true
    })
    this.loadData()
  }

  onReview() {
    if (StoreReview.isAvailable) {
      StoreReview.requestReview()
    } else {
      this.showMsg('感谢您的支持~')
    }
  }

  render() {
    let member = this.state.data || {}
    let items1 = []
    this.itemBox1.forEach(item => {
      if (item.tips) {
        item.tips = member.settingStatus === 1 ? member.settingTime : '未开启'
      }
      let itemView = this.renderItem(item)
      items1.push(itemView)
    })

    let items2 = []
    this.itemBox2.forEach(item => {
      let itemView = this.renderItem(item)
      items2.push(itemView)
    })

    let avatar = member.avatar ? { uri: member.avatar } : require('../../res/image/avatar_def.jpg')
    let bgImg = member.bgImg ? { uri: member.bgImg } : require('../../res/image/info_bg.jpg')

    return (
        <ScrollView style={styles.wrapper} refreshControl={this._renderRefresh()}
                    showsVerticalScrollIndicator={false}>
          <FastImage style={styles.header} source={bgImg}>
            <TouchableOpacity style={styles.avatarBox}
                              onPress={() => this.naviTo('ProfileInfo', { member })}>
              <FastImage source={avatar} style={styles.avatar} />
              {/*<View style={styles.vip}>*/}
              {/*<Text style={styles.vipText}>VIP</Text>*/}
              {/*</View>*/}
              <Text style={styles.nickname}>{member.nickname}</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.signTitle, styles.mgb20]}>连续打卡</Text>
                <Text style={styles.signTitle}><Text
                    style={styles.signBigText}>{member.serialTimes || 0}</Text> 天</Text>
              </View>
              <View style={{ marginLeft: 50, alignItems: 'center' }}>
                <Text style={[styles.signTitle, styles.mgb20]}>累计打卡</Text>
                <Text style={styles.signTitle}><Text
                    style={styles.signBigText}>{member.totalTimes || 0}</Text> 天</Text>
              </View>
            </View>
          </FastImage>
          <BoxShadow setting={shadowOpt}>
            <View style={styles.box}>
              {items1}
            </View>
          </BoxShadow>

          <BoxShadow setting={shadowOpt2}>
            <View style={[styles.box, { height: 196 }]}>
              {items2}
            </View>
          </BoxShadow>

          <TouchableOpacity style={styles.btnBox} onPress={() => this.onReview()}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>鼓励一下我们吧～</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.tips}>你的生活将就此改变！</Text>
          <Text style={[
            styles.tips,
            { marginBottom: 50 }]}>当前版本号：v{this.getCurrentVersion()}</Text>
          <ShareModal ref={(ref) => this.shareModal = ref} />
        </ScrollView>
    )
  }

  renderItem(item) {
    let count = 0
    if (this.store.tabInfo) {
      count = this.store.tabInfo['Profile'] || 0
    }
    count = count > 9 ? '··' : count
    const showTips = item.hasMsg && count > 0

    return (
        <TouchableOpacity style={styles.item} key={item.text} onPress={item.onPress}>
          <View style={styles.itemLeft}>
            <IconFont name={item.icon} color={Variable.blue} size={Variable.font18}
                      style={{ marginRight: 14 }} />
            <Text style={styles.itemText}>{item.text}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={[styles.itemText, { marginRight: 15 }]}>{item.tips}</Text>
            {showTips &&
            <View style={styles.msgBox}>
              <Text style={styles.msgText}>{count}</Text>
            </View>
            }
            <IconFont name="SmallArrow" color="#C2C4CA" size={Variable.font12} />
          </View>
        </TouchableOpacity>
    )
  }

  _renderRefresh() {
    return (
        <RefreshControl
            refreshing={this.state.refreshing || false}
            onRefresh={() => this.onPullRefresh()}
            colors={['#27b5ff', '#1d8eff']}
            tintColor={'#27b5ff'}
            titleColor='#1d8eff'
            title="小安正在帮你努力加载哟..."
        />
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F7F8FA'
  },
  header: {
    height: 238,
    width: Variable.wWdith,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarBox: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    height: 80,
    width: 80,
    resizeMode: 'contain',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff'
  },
  vip: {
    marginTop: -10,
    backgroundColor: Variable.yellow,
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  vipText: {
    fontSize: Variable.font10,
    color: '#333333'
  },
  nickname: {
    fontSize: Variable.font20,
    color: '#fff',
    fontWeight: '500',
    marginTop: 10
  },
  box: {
    width: Variable.wWdith - 40,
    height: 147,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  item: {
    height: 49,
    paddingLeft: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Variable.border_color,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 13
  },
  itemText: {
    fontSize: Variable.font14,
    color: '#1E2432',
    fontWeight: '500'
  },
  btnBox: {
    flex: 1,
    alignItems: 'center'
  },
  btn: {
    marginTop: 18,
    height: 44,
    borderRadius: 23,
    paddingHorizontal: 28,
    justifyContent: 'center',
    backgroundColor: Variable.yellow
  },
  btnText: {
    fontSize: Variable.font14,
    color: '#262626'
  },
  tips: {
    alignSelf: 'center',
    marginTop: 8,
    fontSize: Variable.font10,
    color: '#C4C4C4'
  },
  msgBox: {
    backgroundColor: '#E36B77',
    borderRadius: 7,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  msgText: {
    color: 'white',
    fontSize: Variable.font9,
    fontWeight: '500'
  },
  signTitle: {
    fontSize: Variable.font12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    textShadowColor: Variable.black,
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 }
  },
  mgb20: {
    marginBottom: 5
  },
  signBigText: {
    fontSize: Variable.font18,
    fontWeight: '600',
    color: 'rgba(255,255,255,1)',
    textShadowColor: Variable.black,
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 }
  }

})


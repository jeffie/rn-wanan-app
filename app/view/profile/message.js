import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  StatusBar
} from 'react-native'
import BaseComponent from '../../base/base'
import { connect } from 'mobx-react'
import { observer, inject } from 'mobx-react'
import { Variable } from '../../res/style/variable'
import MessageData from '../../base/storage/data/message'
import XDate from 'xdate'

@inject(['tabBadgeStore'])
@observer
export default class Message extends BaseComponent {
  static navigationOptions = BaseComponent.SubNaviHeader('系统通知')
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
      loading: true,
      refreshing: false
    }
    this.store = this.props.tabBadgeStore || {}
  }

  componentDidMount() {
    this.loadData()
    let date = new XDate()
    date = date.toString('yyyy-MM-dd HH:mm:ss')
    MessageData.update(date)
    this.store.clear('Profile')
  }

  loadData(params = {}, loadMore = false) {
    if (!loadMore) {
      this.newData = []
    }
    this.query = Object.assign(this.query, params)
    this.request('/message/list', this.query).then(res => {
      if (res.code === 200) {
        const { list } = res.data
        this.currentData = list
        this.newData = this.newData.concat(this.currentData)

        this.setState({
          data: this.newData,
          refreshing: false,
          loading: false
        })
      }
    })
  }

  onPullRefresh() {
    this.setState({
      refreshing: true
    })
    this.query.pageNum = 1
    this.loadData()
  }

  loadMore() {
    if (!this.isLastPage()) {
      this.query.pageNum += 1
      this.loadData(null, true)
    }
  }

  isLastPage() {
    return this.currentData.length < this.query.pageSize
  }

  render() {
    if (this.state.loading) {
      return this.renderLoading()
    }
    return (
        <View>
          <StatusBar translucent={true}
                     backgroundColor="transparent"
                     barStyle="dark-content" />
          <FlatList
              style={styles.list}
              data={this.state.data}
              ListEmptyComponent={this.renderEmpty}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.id + ''}
              onRefresh={() => this.onPullRefresh()}
              refreshing={this.state.refreshing}
              onEndReached={() => {this.loadMore()}}
              onEndReachedThreshold={0.3}
          />
        </View>
    )
  }

  renderEmpty() {
    return (
        <View style={styles.empty}>
          <Image source={require('../../res/image/empty.png')} style={styles.img} />
          <Text style={styles.emptyText}>消息空空如也~</Text>
        </View>
    )
  }

  renderItem({ item }) {
    let time = item.createTime && item.createTime.replace('T', ' ')
    return (
        <View style={styles.item}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text style={styles.content}>{item.content}</Text>
        </View>
    )
  }
}
const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fff'
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Variable.border_color
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: Variable.font16,
    color: '#333',
    fontWeight: '400'
  },
  time: {
    fontSize: Variable.font14,
    color: '#bcbcbc',
    fontWeight: '300'
  },
  content: {
    marginTop: 8,
    lineHeight: 20,
    fontSize: Variable.font14,
    color: '#666',
    fontWeight: '300'
  },
  img: {
    height: 120,
    width: 120
  },
  empty: {
    marginTop: -60,
    height: Variable.wHeight,
    width: Variable.wWdith,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Variable.background_normal
  },
  emptyText: {
    marginTop: 20,
    fontSize: Variable.font14,
    color: '#cdcdcd'
  }
})


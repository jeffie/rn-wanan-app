import React, { Component } from 'react'
import Http from './http/request'
import { Variable } from '../res/style/variable'
import Event from '../base/event/event'
import Loading from '../component/common/loading'
import Empty from '../component/common/empty'
import DeviceInfo from 'react-native-device-info'
import {
  BaseNaviHeader,
  MainNaviHeader,
  SubNaviHeader,
  SubNaviHeaderWithBackHandler,
  CustomRightNaviHeader
} from './navi/header'
import LoginData from './storage/data/login'

export default class Base {
  static Navi = null
  static SUCCESS = '000'

  static getUserId() {
    if (LoginData.getUserInfo() === null) {
      return null
    }
    return LoginData.getUserInfo().id
  }

  static isVip() {
    if (LoginData.getUserInfo() === null) {
      return null
    }
    return LoginData.getUserInfo().isVip
  }

  /**
   * 操作系统名称
   * 0表示未知，1表示ios，2表示android，3表示macos，4表示windows，5表示linux
   * @returns {string}
   */
  static getOS() {
    let os = DeviceInfo.getSystemName().toLowerCase()
    switch (os) {
      case 'ios':
        return 1
      case 'iphone os':
        return 1
      case 'android':
        return 2
      default:
        return 0
    }
  }

  /**
   * 网络请求
   * url: 请求地址
   * params: {a:1, b:2} 请求参数
   * return promise
   */
  static async request(url, params = {}, headers = {}, timeout) {
    params.os = Base.getOS()
    // params.device = DeviceInfo.getDeviceName()
    headers['Authorization'] = await LoginData.getToken()
    return Http.request(url, params, headers, timeout)
  }

  static async post(url, params = {}, headers = {}, timeout) {
    params.os = Base.getOS()
    //params.device = DeviceInfo.getDeviceName()
    headers['Authorization'] = await LoginData.getToken()
    return Http.post(url, params, headers, timeout)
  }

  /**
   * 消息提示
   * @param msg
   * @param showTimeSeconds 延迟时间，默认2s
   */
  static showMsg(msg, showTimeSeconds = 2) {
    msg &&
    Event.trigger(Event.SHOW_APP_TOAST, { msg: msg, time: showTimeSeconds })
  }

  static showLoading() {
    Event.trigger(Event.SHOW_APP_LOADING, { show: true })
  }

  static hideLoading(callback) {
    let params = { show: false }
    if (callback) {
      params.callback = callback
    }
    Event.trigger(Event.SHOW_APP_LOADING, params)
  }

  /**
   * 工具方法，获取屏幕宽高
   * @returns {number}
   */
  static width() {
    return Math.min(Variable.wWdith, Variable.wHeight)
  }

  static height() {
    return Math.max(Variable.wWdith, Variable.wHeight)
  }

  /**
   * 加载页面
   * @returns {XML}
   */
  static renderLoading() {
    return <Loading />
  }

  static renderEmpty() {
    return <Empty />
  }

  /**
   * 导航header 封装
   * @param title
   * @returns {function({navigation?: *}): {}}
   * @constructor
   */
  static CustomNaviHeader(navigation, title) {
    return BaseNaviHeader(navigation, title)
  }

  static SubNaviHeader(title) {
    return ({ navigation }) => SubNaviHeader(navigation, title)
  }

  static SubNaviHeaderWithBackHandler(title, handler) {
    return ({ navigation }) => SubNaviHeaderWithBackHandler(navigation, title,
        handler)
  }

  static MainNaviHeader(title) {
    return () => MainNaviHeader(null, title)
  }

  static NoneNaviHeader() {
    return { headerShown: false }
  }

  static CustomRightNaviHeader(title) {
    return ({ navigation }) => CustomRightNaviHeader(navigation, title)
  }

  static _getNaviName(target) {
    if (typeof target === 'string') {
      return target
    }

    for (let i in Router) {
      if (Router[i] == target) {
        return i
      }
    }
  }

}

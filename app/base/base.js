import React, { Component } from 'react'
import DeviceInfo from 'react-native-device-info'
import NavigationService from '../base/navi/navi_service'
import  Base from './_base'
import setting from '../res/data/setting.json'
import BootData from '../base/storage/data/boot'

export default class BaseComponent extends Component {
  static SYS_SETTING = {
    qrcode: 'https://wanan.topjplus.com/qrcode.png',
    tips: setting.intro
  }

  getUserId() {
    return Base.getUserId()
  }

  isVip() {
    return Base.isVip()
  }

  getOS() {
    return Base.getOS()
  }

  getUUID() {
    return DeviceInfo.getUniqueId()
  }

  getAppVersion() {
    return DeviceInfo.getVersion()
  }

  getCurrentVersion() {
    return DeviceInfo.getReadableVersion()
  }

  naviToLogin(unAuthCallback) {
    // 默认登录后返回原路径，可自定义登录后时间
    if (!unAuthCallback) {
      unAuthCallback = { callback: () => {this.naviBack()} }
    }

    this.naviTo('Login', unAuthCallback)
  }

  /**
   * 网络请求
   * url: 请求地址
   * params: {a:1, b:2} 请求参数
   * return promise
   */
  request(url, params = {}, headers = {}, timeout) {
    return Base.request(url, params, headers, timeout).then(res => {
      if (res.code === 1003 && BootData.hasInit) {
        this.naviToLogin()
      }
      return res
    })
  }

  post(url, params, headers = {}, timeout) {
    return Base.post(url, params, headers, timeout).then(res => {
      if (res.code === 1003 && BootData.hasInit) {
        this.naviToLogin()
      }
      return res
    })
  }

  /**
   * 消息提示
   * @param msg
   * @param showTimeSeconds 延迟时间，默认2s
   */
  showMsg(msg, showTimeSeconds = 2) {
    Base.showMsg(msg, showTimeSeconds)
  }

  showLoading() {
    Base.showLoading()
  }

  hideLoading(callback) {
    Base.hideLoading(callback)
  }

  /**
   * 导航的封装
   * @returns {*}
   */
  navi() {
    let { navigation } = this.props
    if (navigation) {
      return navigation
    }

    return NavigationService.getNavi()
  }

  naviTo(target, param = {}) {
    let targetName = Base._getNaviName(target)

    NavigationService.navigate(targetName, param)
  }

  naviBack(item) {
    if (this.getRouterParams() && this.getRouterParams().callback) {
      this.getRouterParams().callback(item ? item : null)
    }
    NavigationService.naviBack()
  }

  naviAndResetTo(target) {
    target = Base._getNaviName(target)
    NavigationService.naviReset(target)
  }

  getRouterParams() {
    return this.navi().state.params
  }

  /**
   * 加载页面
   * @returns {XML}
   */
  renderLoading() {
    return Base.renderLoading()
  }

  renderEmpty() {
    return Base.renderEmpty()
  }

  /**
   * 导航header 封装
   * @param title
   * @returns {function({navigation?: *}): {}}
   * @constructor
   */
  static CustomNaviHeader(navigation, title) {
    return Base.CustomNaviHeader(navigation, title)
  }

  static SubNaviHeader(title) {
    return Base.SubNaviHeader(title)
  }

  static SubNaviHeaderWithBackHandler(title, handler) {
    return Base.SubNaviHeaderWithBackHandler(title, handler)
  }

  static MainNaviHeader(title) {
    return Base.MainNaviHeader(title)
  }

  static NoneNaviHeader() {
    return Base.NoneNaviHeader()
  }

  static CustomRightNaviHeader(title) {
    return Base.CustomRightNaviHeader(title)
  }

}

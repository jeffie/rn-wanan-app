import * as WeChat from 'react-native-wechat-lib'
import * as Config from '../../config/conf'

export default class WeChatKit {
  static appId = null

  static init() {
    WeChat.registerApp(WeChatKit.appId, 'https://wanan.topjplus.com/app/')
  }

  static async authLogin() {
    WeChatKit.appId = Config.WECHAT_APPID
    await WeChatKit.init()
    let result = { error: true }

    let random = '' + new Date().getTime()
    return WeChat.sendAuthRequest('snsapi_userinfo', random).then(resp => {
      result.error = false
      result.code = resp.code
      return result
    }).catch(e => {
      __DEV__ && console.log(e)
      result.msg = '登录失败'
      return result
    })

  }

  static async shareToSession(params) {
    WeChatKit.appId = Config.WECHAT_APPID
    await WeChatKit.init()
    let result = { error: true }

    try {
      params.scene = 0
      let resp = await WeChat.shareWebpage(params)
      if (resp.errCode === 0) {
        result.error = false
        result.msg = '分享成功'
      } else {
        __DEV__ && console.log(resp)
        result.msg = '分享失败'
      }
      return result
    } catch (e) {
      __DEV__ && console.log(e)
      result.msg = '分享失败'
      return result
    }
  }

  static async shareToTimeline(params) {
    WeChatKit.appId = Config.WECHAT_APPID
    await WeChatKit.init()
    let result = { error: true }

    try {
      params.scene = 1
      let resp = await WeChat.shareWebpage(params)
      if (resp.errCode === 0) {
        result.error = false
        result.msg = '分享成功'
      } else {
        __DEV__ && console.log(resp)
        result.msg = '分享失败'
      }
      return result
    } catch (e) {
      __DEV__ && console.log(e)
      result.msg = '分享失败'
      return result
    }
  }

  static async buy(reqParam) {
    if (!reqParam) {
      return WeChatKit._errorResult()
    }

    // 初始化
    if (!WeChatKit.appId) {
      WeChatKit.appId = reqParam.appid || Config.WECHAT_APPID
      await WeChatKit.init()
    }

    let result = { error: true }

    return WeChat.pay({
      partnerId: reqParam.partnerid,  // 商家向财付通申请的商家id
      prepayId: reqParam.prepayid,   // 预支付订单
      nonceStr: reqParam.noncestr,   // 随机串，防重发
      timeStamp: reqParam.timestamp,  // 时间戳，防重发
      package: reqParam.package,    // 商家根据财付通文档填写的数据和签名
      sign: reqParam.sign        // 商家根据微信开放平台文档对数据做的签名
    }).then(resp => {
      if (resp.errCode === 0) {
        result.error = false
        result.msg = '支付成功'
      } else {
        __DEV__ && console.log(resp)
        result.msg = '支付失败'
      }
      return result
    }).catch(e => {
      __DEV__ && console.log(e)
      result.msg = '支付失败'
      return result
    })
  }

  static _errorResult(result) {
    return Promise.resolve(result)
  }
}
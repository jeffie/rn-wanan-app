import axios from 'axios'
import * as Conf from '../../config/conf'

export default class Http {

  static request(url, params, header = {}, timeout = Conf.SERVER_REQUEST_TIMEOUT_MILLS) {
    let reqUrl = url.indexOf('http') > -1 ? url : Conf.SERVER_HOST + url

    let errorResult = {
      code: -1000,
      msg: '无法连接到服务器，请稍后再试'
    }

    let config = {
      timeout: timeout
    }
    return axios.get(reqUrl, { params: params, headers: header }, config).then(response => {
      return response.data
    }).catch(error => {
      __DEV__ && console.log(error)
      if (error.request && error.code === 'ECONNABORTED') {
        errorResult.code = -1001
        errorResult.msg = '服务请求超时'
      } else if (error.request && error.request.status == '401') {
        errorResult.code = -1002
        errorResult.msg = '尚未登录，请登录后操作'
      }

      return errorResult
    })
  }

  static post(url, params, header = {}, timeout = Conf.SERVER_REQUEST_TIMEOUT_MILLS) {
    let reqUrl = url.indexOf('http') > -1 ? url : Conf.SERVER_HOST + url

    let errorResult = {
      code: -1000,
      msg: '无法连接到服务器，请稍后再试'
    }

    let config = {
      timeout: timeout,
      headers: header
    }

    // console.log(reqUrl, params)
    return axios.post(reqUrl, params, config).then(response => {
      return response.data
    }).catch(error => {
      __DEV__ && console.log(error)
      if (error.request && error.code === 'ECONNABORTED') {
        errorResult.code = -1001
        errorResult.msg = '服务请求超时'
      }

      return errorResult
    })
  }
}
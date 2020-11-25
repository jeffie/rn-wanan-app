import React, { Component } from 'react'
import {
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ImageBackground
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
import Wechat from '../../base/wechat/wechat'
import Countdown from '../../component/button/countdown'
import LoginData from '../../base/storage/data/login'
import appleAuth, {
  AppleButton
} from '@invertase/react-native-apple-authentication'
import AppleAuth from '../../base/apple/apple_auth'

export default class Login extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  constructor(props) {
    super(props)
    this.state = {
      iconName: 'Checked',
      phoneNum: '',
      smsCode: '',
      smsBtnText: '验证码'
    }

  }

  handleCheck() {
    let iconName = this.state.iconName === 'Checked' ? 'UnCheck' : 'Checked'
    this.setState({
      iconName: iconName
    })
  }

  handlePhoneNumInput(text) {
    this.setState({
      phoneNum: text
    })
  }

  handleSmsCodeInput(text) {
    this.setState({
      smsCode: text
    })
  }

  handleLogin(from) {
    if (this.state.iconName === 'UnCheck') {
      this.showMsg('请先同意用户协议')
      return
    }

    if (from === 'normal') {
      this.doLogin()
    } else {
      this.doWxLogin()
    }
  }

  handleSendSms() {
    let phoneNum = this.state.phoneNum
    if (!phoneNum || !(/^1([3456789])\d{9}$/.test(phoneNum))) {
      this.showMsg('请输入正确的手机号码')
      return
    }
    this.post('/auth/sendSms', { phoneNum }).then(res => {
      if (res.code === 200) {
        this.showMsg('短信发送成功')
        this.refs.countdown.refresh()
      } else {
        this.showMsg(res.msg)
      }
    })
  }

  async handleAppleLogin() {
    const result = await AppleAuth.login()
    if (result.error) {
      this.showMsg(result.msg)
      return
    }

    const { data } = result
    this.post('/auth/appleLogin', data).then(res => {
      if (res.code === 200) {
        const { token_header, session_token } = res.data
        this.loginSuccess(token_header, session_token)
      } else {
        this.showMsg(res.msg)
      }
    })
  }

  doLogin() {
    const { phoneNum, smsCode } = this.state
    if (!phoneNum) {
      this.showMsg('手机号不能为空')
      return
    }
    if (!smsCode) {
      this.showMsg('验证码不能为空')
      return
    }

    this.post('/auth/phoneLogin', {
      phoneNum,
      smsCode
    }).then(res => {
      if (res.code === 200) {
        const { token_header, session_token } = res.data
        this.loginSuccess(token_header, session_token)
      } else {
        this.showMsg(res.msg)
      }
    })
  }

  doWxLogin() {
    Wechat.authLogin().then(ret => {
      const code = ret.code
      //req remote
      this.post('/auth/wxLogin', { code: code }).then(res => {
        if (res.code === 200) {
          const { token_header, session_token } = res.data
          this.loginSuccess(token_header, session_token)
        } else {
          this.showMsg(res.msg)
        }
      })
    }).catch(ret => {
      this.showMsg(ret.msg)
    })
  }

  async loginSuccess(header, token) {
    await LoginData.updateToken(header + token)
    this.naviAndResetTo('Main')
  }

  render() {
    return (
        <ImageBackground
            source={require('../../res/image/login_bg_pure.jpg')}
            imageStyle={{ resizeMode: 'cover' }}
            style={styles.wrapper}>
          <KeyboardAvoidingView
              behavior={'position'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -60}
              style={{ minHeight: 500 }}
          >
            <Image source={require('../../res/image/logo.png')} style={styles.logo} />

            <View style={styles.phoneBox}>
              <Text style={styles.phoneCode}>+86</Text>
              <TextInput style={styles.input} placeholder="请输入手机号码"
                         onChangeText={this.handlePhoneNumInput.bind(this)}
                         placeholderTextColor="#ddd" keyboardType="number-pad" />
            </View>
            <View style={styles.codeBox}>
              <TextInput style={styles.smallInput} placeholder="请输入验证码"
                         onChangeText={this.handleSmsCodeInput.bind(this)}
                         placeholderTextColor="#ddd" keyboardType="number-pad" />
              <Countdown ref="countdown" style={styles.smallBtn}
                         textStyle={styles.phoneCode}
                         onSendSms={this.handleSendSms.bind(this)} />
            </View>

            <TouchableOpacity style={styles.btn} onPress={this.handleLogin.bind(this, 'normal')}>
              <Text style={styles.btn_text}>登 录</Text>
            </TouchableOpacity>
            <View style={styles.accountBox}>
              <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                                onPress={() => this.naviTo('AccountLogin')}>
                <Text style={styles.accountText}>账号登录</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.otherHeader}>
              <View style={styles.line} />
              <Text style={styles.accountText}>更多登录方式</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.otherBox}>
              {appleAuth.isSupported &&
              <AppleButton
                  buttonType={AppleButton.Type.SIGN_IN}
                  cornerRadius={25}
                  style={{
                    width: 50, // You must specify a width
                    height: 50 // You must specify a height
                  }}
                  onPress={() => this.handleAppleLogin()}
              />
              }
              <TouchableOpacity style={styles.circleBtn}
                                onPress={this.handleLogin.bind(this, 'wx')}
                                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
                <Image source={require('../../res/image/icon/wechat.png')}
                       style={styles.circleIcon} />
              </TouchableOpacity>
            </View>

          </KeyboardAvoidingView>

          <TouchableOpacity style={styles.bottom}
                            onPress={() => this.handleCheck()}
                            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
            <IconFont name={this.state.iconName} style={styles.icon} size={Variable.font20} />
            <Text style={styles.bottom_text}>已阅读并同意</Text>
            <TouchableOpacity onPress={() => this.naviTo('Agreement')}>
              <Text style={styles.bottom_link}>《用户协议》</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center'
  },
  logo: {
    alignSelf: 'center',
    marginTop: 63,
    width: 111,
    height: 139,
    resizeMode: 'cover'
  },
  btn: {
    marginTop: 25,
    alignSelf: 'center',
    width: Variable.wWdith - 60,
    paddingVertical: 18,
    borderRadius: 28,
    backgroundColor: 'rgba(88,116,220,0.34)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.34)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn_text: {
    fontSize: Variable.font16,
    color: '#fff',
    fontWeight: '500'
  },
  bottom: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottom_text: {
    fontSize: Variable.font12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.5)'
  },
  bottom_link: {
    fontSize: Variable.font12,
    fontWeight: '400',
    color: Variable.blue
  },
  icon: {
    marginRight: 5,
    color: 'rgba(255,255,255,0.8)'
  },
  phoneBox: {
    width: Variable.wWdith - 60,
    height: 50,
    marginTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: 'rgba(88,116,220,0.34)',
    borderWidth: 0,
    borderColor: 'rgba(255,255,255,0.34)'
  },
  phoneCode: {
    fontSize: Variable.font16,
    color: '#fff',
    fontWeight: '500'
  },
  input: {
    width: Variable.wWdith - 120,
    marginLeft: 15,
    color: '#fff',
    fontSize: Variable.font16
  },
  codeBox: {
    marginTop: 20,
    width: Variable.wWdith - 60,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  smallInput: {
    borderRadius: 28,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(88,116,220,0.34)',
    borderWidth: 0,
    borderColor: 'rgba(255,255,255,0.34)',
    flex: 1,
    color: '#fff',
    fontSize: Variable.font16
  },
  smallBtn: {
    marginLeft: 15,
    textAlign: 'center',
    borderRadius: 28,
    height: 50,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'rgba(88,116,220,0.34)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.34)'
  },
  line: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f5f5f5',
    marginHorizontal: 20
  },
  otherHeader: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  otherBox: {
    marginTop: 20,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  circleBtn: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(88,116,220,0.54)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 10
  },
  circleIcon: {
    height: 25,
    width: 25
  },
  accountBox: {
    flexDirection: 'row',
    paddingRight: 10,
    justifyContent: 'flex-end',
    marginTop: 10
  },
  accountText: {
    color: '#f5f5f5',
    fontSize: Variable.font14
  }
})


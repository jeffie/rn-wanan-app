import React, { Component } from 'react'
import {
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
import Countdown from '../../component/button/countdown'

export default class Register extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  constructor(props) {
    super(props)
    this.state = {
      iconName: 'Checked',
      phoneNum: '',
      smsCode: '',
      password: '',
      visible: false
    }
    this.method = this.getRouterParams().from
  }

  handleCheck() {
    let iconName = this.state.iconName === 'Checked' ? 'UnCheck' : 'Checked'
    this.setState({
      iconName: iconName
    })
  }

  switchPwd() {
    this.setState({
      visible: !this.state.visible
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

  handlePasswordInput(text) {
    this.setState({
      password: text
    })
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

  handleRegister() {
    if (this.state.iconName === 'UnCheck') {
      this.showMsg('请先同意用户协议')
      return
    }

    const { phoneNum, smsCode, password } = this.state
    if (!phoneNum) {
      this.showMsg('手机号不能为空')
      return
    }
    if (!smsCode) {
      this.showMsg('验证码不能为空')
      return
    }

    if (!password) {
      this.showMsg('密码不能为空')
      return
    }

    this.post('/auth/accountRegister', {
      account: phoneNum,
      password,
      smsCode
    }).then(res => {
      if (res.code === 200) {
        this.showMsg('注册成功，请登录')
        this.naviBack()
      } else {
        this.showMsg(res.msg)
      }
    })
  }

  render() {
    return (
        <ImageBackground
            source={require('../../res/image/login_bg_pure.jpg')}
            imageStyle={{ resizeMode: 'cover' }}
            style={styles.wrapper}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {this.naviBack()}}
                              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <IconFont name="Back" size={Variable.font20} color={Variable.main_bg} />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
              behavior={'position'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
              style={{ height: 550 }}
          >

            <Image source={require('../../res/image/logo.png')} style={styles.logo} />

            <View style={styles.phoneBox}>
              <Text style={[styles.phoneCode, { marginRight: 15 }]}>+86</Text>
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

            <View style={styles.phoneBox}>
              <TextInput style={styles.input} placeholder="请输入密码"
                         secureTextEntry={!this.state.visible}
                         onChangeText={this.handlePasswordInput.bind(this)}
                         placeholderTextColor="#ddd" />
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                                onPress={() => this.switchPwd()}>
                <IconFont name={this.state.visible ? 'Visible' : 'Hidden'} size={Variable.font20}
                          color="#E5E5E5" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btn} onPress={this.handleRegister.bind(this)}>
              <Text style={styles.btn_text}>{this.method === 'register' ? '注 册' : '确 认' }</Text>
            </TouchableOpacity>
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
  header: {
    ...Variable.headerStyle,
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0
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
    fontSize: Variable.font18,
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
  }
})


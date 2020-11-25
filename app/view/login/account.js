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
import LoginData from '../../base/storage/data/login'

export default class AccountLogin extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  constructor(props) {
    super(props)
    this.state = {
      phoneNum: '',
      password: '',
      visible: false
    }
  }

  handlePhoneNumInput(text) {
    this.setState({
      phoneNum: text
    })
  }

  handlePasswordInput(text) {
    this.setState({
      password: text
    })
  }

  switchPwd() {
    this.setState({
      visible: !this.state.visible
    })
  }

  handleLogin() {
    const { phoneNum, password } = this.state
    if (!phoneNum) {
      this.showMsg('手机号不能为空')
      return
    }
    if (!password) {
      this.showMsg('密码不能为空')
      return
    }

    this.post('/auth/accountLogin', {
      account: phoneNum,
      password
    }).then(res => {
      if (res.code === 200) {
        const { token_header, session_token } = res.data
        this.loginSuccess(token_header, session_token)
      } else {
        this.showMsg(res.msg)
      }
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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {this.naviBack()}}
                              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <IconFont name="Back" size={Variable.font20} color={Variable.main_bg} />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
              behavior={'position'}
              keyboardVerticalOffset={0}
              style={{ height: 500 }}
          >

            <Image source={require('../../res/image/logo.png')} style={styles.logo} />

            <View style={styles.phoneBox}>
              <Text style={styles.phoneCode}>+86</Text>
              <TextInput style={styles.input} placeholder="请输入手机号码"
                         onChangeText={this.handlePhoneNumInput.bind(this)}
                         placeholderTextColor="#ddd" keyboardType="number-pad" />
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
            <TouchableOpacity style={styles.btn} onPress={this.handleLogin.bind(this)}>
              <Text style={styles.btn_text}>登 录</Text>
            </TouchableOpacity>

            <View style={styles.accountBox}>
              <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                                onPress={() => this.naviTo('AccountRegister',
                                    { from: 'register' })}>
                <Text style={styles.accountText}>注册账号</Text>
              </TouchableOpacity>
              <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                                onPress={() => this.naviTo('AccountRegister', { from: 'reset' })}>
                <Text style={styles.accountText}>忘记密码？</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
    fontWeight: '500',
    marginRight: 15
  },
  input: {
    width: Variable.wWdith - 120,
    color: '#fff',
    fontSize: Variable.font16
  },
  accountBox: {
    flexDirection: 'row',
    marginHorizontal: 10,
    justifyContent: 'space-between',
    marginTop: 15
  },
  accountText: {
    color: '#f5f5f5',
    fontSize: Variable.font14
  }
})


import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'

export default class Report extends BaseComponent {
  static navigationOptions = BaseComponent.SubNaviHeader('意见反馈')

  phone = ''
  content = ''

  constructor(props) {
    super(props)
  }

  handleContent(text) {
    this.content = text
  }

  handlePhoneInput(text) {
    this.phone = text
  }

  onSubmit() {
    if (!this.content) {
      this.showMsg('反馈内容不能为空')
      return
    }

    if (!this.phone) {
      this.showMsg('手机号不能为空')
      return
    }

    this.post('/suggestion/add', {
      content: this.content,
      phone: this.phone
    }).then(res => {
      if (res.code === 200) {
        this.showMsg('感谢您的反馈，我们会及时处理')
        this.naviBack()
      }
    })
  }

  render() {
    return (
        <ScrollView style={styles.wrapper}>
          <StatusBar translucent={true}
                     backgroundColor="transparent"
                     barStyle="dark-content" />
          <TextInput style={styles.input}
                     onChangeText={(text) => this.handleContent(text)}
                     multiline
                     maxLength={100}
                     numberOfLines={5}
                     placeholder="请输入您的反馈内容，帮助我们更好的成长~"
                     placeholderTextColor="#ccc"
          />
          <View style={styles.phoneBox}>
            <Image source={require('../../res/image/icon/icon_iphone.png')} style={styles.icon} />
            <TextInput style={styles.phoneInput}
                       maxLength={20}
                       onChangeText={(text) => this.handlePhoneInput(text)}
                       placeholder="留下手机号，方便我们联系到您"
                       placeholderTextColor="#ccc"
            />
          </View>
          <Text style={styles.link}>紧急问题请加QQ：327939196</Text>
          <TouchableOpacity style={styles.btn} onPress={() => this.onSubmit()}>
            <Text style={styles.btnText}>提交</Text>
          </TouchableOpacity>
        </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    backgroundColor: '#fff'
  },
  input: {
    height: 116,
    width: Variable.wWdith - 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Variable.border_color
  },
  icon: {
    marginRight: 10,
    height: 28,
    width: 28
  },
  phoneBox: {
    flexDirection: 'row',
    height: 53,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Variable.border_color
  },
  phoneInput: {
    height: 53,
    width: Variable.wWdith - 80
  },
  link: {
    marginTop: 15,
    color: '#1E2432',
    fontSize: Variable.font14
  },
  btn: {
    marginTop: 50,
    alignSelf: 'center',
    backgroundColor: Variable.yellow,
    height: 44,
    width: 178,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    fontSize: Variable.font14,
    fontWeight: '400',
    color: '#262626'
  }
})


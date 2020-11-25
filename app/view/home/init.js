import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ImageBackground,
  StatusBar,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'

export default class Init extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  constructor(props) {
    super(props)
    this.content = BaseComponent.SYS_SETTING.tips
  }

  render() {
    return (
        <ImageBackground source={require('../../res/image/bg1.jpg')}
                         style={styles.bgImg}>
          <StatusBar translucent={true}
                     backgroundColor="transparent"
                     barStyle="light-content" />
          <View style={styles.box}>
            <IconFont name="Tag" size={24} color={'#FACC01'} style={styles.tag} />
            <ScrollView>
              <Text style={styles.title}>
                小安写给你的一封信
              </Text>
              <Text style={styles.content}>
                {this.content}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.btn} onPress={() => {this.naviTo('AddDaily')}}>
              <Text style={styles.btnText}>写下第一篇晚安日记</Text>
            </TouchableOpacity>
            <Text style={styles.tips}>你的生活将就此改变！</Text>
          </View>
        </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  box: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: 'center',
    maxHeight: Variable.wHeight - 180
  },
  bgImg: {
    height: Variable.wHeight,
    width: Variable.wWdith,
    paddingHorizontal: 36,
    justifyContent: 'center'
  },
  tag: {
    position: 'absolute',
    top: -8
  },
  title: {
    fontSize: Variable.font20,
    color: '#333',
    fontWeight: '600'
  },
  content: {
    marginTop: 17,
    fontWeight: '400',
    fontSize: Variable.font14,
    color: '#666666',
    lineHeight: 22,
    textAlign: 'justify'
  },
  btn: {
    marginTop: 20,
    paddingHorizontal: 25,
    minWidth: 178,
    paddingVertical: 12,
    backgroundColor: '#FACC01',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    fontSize: Variable.font14,
    color: '#262626'
  },
  tips: {
    fontSize: Variable.font10,
    color: '#D8D8D8',
    marginTop: 10
  }
})


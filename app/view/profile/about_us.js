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
import * as StoreReview from 'react-native-store-review'

export default class AboutUs extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()

  constructor(props) {
    super(props)
    this.content = BaseComponent.SYS_SETTING.tips
  }

  onReview() {
    if (StoreReview.isAvailable) {
      StoreReview.requestReview();
    } else {
      this.showMsg('感谢您的支持~')
    }
  }

  render() {
    return (
        <ImageBackground source={require('../../res/image/bg1.jpg')}
                         style={styles.bgImg}>
          <StatusBar translucent={true}
                     backgroundColor="transparent"
                     barStyle="light-content" />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {this.naviBack()}} style={styles.headerBack}>
              <IconFont name="Back" size={Variable.font22} color="#E5E5E5" />
            </TouchableOpacity>
            <Text style={styles.headerText}>关于我们</Text>
          </View>

          <View style={styles.box}>
            <IconFont name="Tag" size={24} color={'#FACC01'} style={styles.tag} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>
                小安写给你的一封信
              </Text>
              <Text style={styles.content}>
                {this.content}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.btn} onPress={() => this.onReview()}>
              <Text style={styles.btnText}>鼓励一下我们吧~</Text>
            </TouchableOpacity>
            <Text style={styles.tips}>您的举手之劳可能改变我们的命运！</Text>
          </View>
        </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  header: {
    ...Variable.headerStyle,
    justifyContent: 'center',
    position: 'relative'
  },
  headerBack: {
    position: 'absolute',
    left: 20,
    bottom: 15,
    alignItems: 'center'
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: 'center',
    marginHorizontal: 36,
    maxHeight: Variable.wHeight - 180,
    marginTop: 45
  },
  bgImg: {
    height: Variable.wHeight,
    width: Variable.wWdith
  },
  headerText: {
    fontSize: Variable.font20,
    color: '#E5E5E5',
    fontWeight: '600'
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


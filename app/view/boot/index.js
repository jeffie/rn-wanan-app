import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import Swiper from 'react-native-swiper'
import BootData from '../../base/storage/data/boot'
import LoginData from '../../base/storage/data/login'

export default class Splash extends BaseComponent {
  static navigationOptions = BaseComponent.NoneNaviHeader()
  month = 1
  day = 1
  year = 2020

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0
    }
    this.handleDate()
  }


  handleNext(index) {
    this.refs.swiper.scrollBy(index)
  }

  async handleFinish() {
    BootData.update(true)
    let authToken = await LoginData.getToken()
    const target = authToken ? 'Main' : 'Login'
    this.naviAndResetTo(target)
  }

  handleDate() {
    let date = new Date().toDateString()
    let dateArr = date.split(' ')
    this.month = dateArr[1]
    this.day = dateArr[2]
    this.year = dateArr[3]
  }

  render() {
    return (
        <Swiper ref='swiper' style={styles.wrapper} dotStyle={styles.dot}
                activeDotStyle={styles.active_dot}
                index={this.state.currentIndex}>
          <View style={styles.swiper}>
            <Image source={require('../../res/image/splash/splash1.jpg')} style={styles.img} />
            <TouchableOpacity style={styles.normal_btn} onPress={() => this.handleNext(1)}>
              <Text style={styles.normal_btn_text}>继续</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.swiper}>
            <Image source={require('../../res/image/splash/splash2.jpg')} style={styles.img} />
            <TouchableOpacity style={styles.normal_btn} onPress={() => this.handleNext(1)}>
              <Text style={styles.normal_btn_text}>继续</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.swiper}>
            <Image source={require('../../res/image/splash/splash3.jpg')} style={styles.img} />
            <TouchableOpacity style={styles.btn} onPress={() => this.handleFinish()}>
              <Text style={styles.btn_text}>开启晚安日记</Text>
            </TouchableOpacity>
          </View>
        </Swiper>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {},
  img: {
    width: Variable.wWdith,
    height: Variable.wHeight,
    resizeMode: 'cover'
  },
  swiper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B5BBC6',
    marginBottom: 160
  },
  active_dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5874DC',
    marginBottom: 160
  },
  normal_btn: {
    position: 'absolute',
    bottom: 58,
    width: 100,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(88,116,220,0.24)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  normal_btn_text: {
    fontSize: Variable.font14,
    color: '#E5E5E5'
  },
  btn: {
    position: 'absolute',
    bottom: 58,
    width: 178,
    height: 48,
    borderRadius: 25,
    backgroundColor: '#FACC01',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn_text: {
    fontSize: Variable.font14,
    color: '#333'
  }
})


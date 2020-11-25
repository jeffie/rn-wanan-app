import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../../base/base'
import { Variable } from '../../res/style/variable'
import IconFont from '../../component/iconfont/iconfont'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'

const emotionMap = [
  require('../../res/image/icon/icon_joy.png'),
  require('../../res/image/icon/icon_angry.png'),
  require('../../res/image/icon/icon_cry.png'),
  require('../../res/image/icon/icon_happy.png'),
  require('../../res/image/icon/icon_sad.png'),
  require('../../res/image/icon/icon_bitter.png')
]

export default class Emotion extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      top: 0
    }
  }

  handleSelect(index) {
    if (index === this.props.checkedIndex) {
      index = -1
    }
    this.props.onSelected && this.props.onSelected(index)
  }

  componentWillUnmount() {
  }

  render() {
    let items = []
    let checkedIndex = this.props.checkedIndex
    emotionMap.forEach((eItem, index) => {
      let checked = checkedIndex === index
      let item = (
          <TouchableOpacity key={index}
                            activeOpacity={1}
                            onPress={() => this.handleSelect(index)}
                            hitSlop={{ top: 30, bottom: 30, left: 20, right: 20 }}
                            style={checked && styles.item}>
            <Image source={eItem} style={styles.img} />
            {checked &&
            <IconFont name="SelectedTag" size={Variable.font20} color="#FBC34B"
                      style={styles.tag} />
            }
          </TouchableOpacity>
      )
      items.push(item)
    })

    return (
        <View style={[styles.box, this.props.style]}>
          {items}
        </View>
    )
  }
}
const styles = StyleSheet.create({
  box: {
    height: 60,
    width: Variable.wWdith - 40,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 3
  },
  item: {
    position: 'relative',
    backgroundColor: Variable.blue,
    paddingHorizontal: 10,
    height: 72,
    borderRadius: 2,
    justifyContent: 'center'
  },
  img: {
    height: 28,
    width: 28,
    alignSelf: 'center'
  },
  tag: {
    position: 'absolute',
    bottom: -5,
    right: -1
  }

})


import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native'
import { Variable } from '../../res/style/variable'

export default class Empty extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
        <View style={Styles.container}>
          {/*<Image source={require('../../res/image/buy_empty.png')} style={Styles.img}/>*/}
          <Text style={Styles.title}>暂无数据，正在快马加鞭为您准备中...</Text>
        </View>
    )
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCF9FC'
  },
  img: {
    resizeMode: 'cover'
  },
  title: {
    marginTop: 10,
    fontSize: Variable.font13,
    color: Variable.pinkish_grey
  }
})

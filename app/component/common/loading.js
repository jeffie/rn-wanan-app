import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import LottieView from 'lottie-react-native'
import { Variable } from '../../res/style/variable'

export default class Loading extends Component {
  constructor(props) {
    super(props)
    this.state = { hide: false }
  }

  componentDidMount() {

  }

  show() {
    this.setState({ hide: false })
  }

  hide() {
    this.setState({ hide: true })
  }

  render() {
    return (this.state.hide ? <View /> : <View
            style={styles.container}>
          <LottieView source={require('../../res/data/loading.json')}
                      style={styles.voiceAnimal}
                      autoPlay loop />
          <Text style={{ color: '#c6c8cb', marginTop: -20 }}>请稍后，努力加载中...</Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100
  },
  voiceAnimal: {
    height: 150
  }
})

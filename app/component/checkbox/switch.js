import React from 'react'

import {
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { Variable } from '../../res/style/variable'

export default class SwitchBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: this.props.checked
    }
  }

  handleSwitch() {
    this.setState({
      checked: !this.state.checked
    }, () => {
      this.props.onSwitch && this.props.onSwitch(this.state.checked)
    })

  }

  render() {
    const checked = this.state.checked
    return (
        <TouchableOpacity style={[styles.switch, checked && styles.checked]}
                          onPress={() => this.handleSwitch()}>
          <View style={[styles.switchBtn, checked && styles.checkedBtn]} />
        </TouchableOpacity>
    )

  }
}

const styles = StyleSheet.create({
  switch: {
    position: 'relative',
    height: 32,
    width: 54,
    borderRadius: 16,
    backgroundColor: '#c4c4c4'
  },
  checked: {
    backgroundColor: Variable.blue
  },
  switchBtn: {
    position: 'absolute',
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    left: 2,
    bottom: 2
  },
  checkedBtn: {
    left: 24,
    right: 2
  }
})
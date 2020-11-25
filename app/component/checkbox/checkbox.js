import React from 'react'

import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text
 ,
} from 'react-native'

import IconFont from '../iconfont/iconfont'
import { Variable } from '../../res/style/variable'

export default class RadioBox extends React.Component {

  static defaultProps = {
    name: 'Radiobox',
    checkedName: 'Checked',
    checked: false,
    size: 18,
    color: Variable.pinkish_grey,
    onSelect: null
  }

  constructor (props) {
    super(props)
    this.state = {
      checked: this.props.checked
    }
  }

  refresh (checked) {
    this.setState({
      checked: checked
    })
  }

  _onPress () {
    this.props.onSelect && this.props.onSelect()
  }

  render () {
    this.state.checked = this.props.checked
    let iconName = this.state.checked ? this.props.checkedName : this.props.name
    let color = '#fff'
    return (
        <TouchableOpacity onPress={this._onPress.bind(this)}
                          style={[Styles.box, this.props.style]}
                          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
          <IconFont {...this.props} name={iconName} style={this.props.iconStyle} color={color}/>
          {this.props.label &&
          <Text style={[Styles.label, this.props.labelStyle]}>{this.props.label}</Text>
          }
        </TouchableOpacity>
    )
  }

}

export const Styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  icon: {
    marginLeft: 15
  },
  label: {
    fontSize: Variable.font13,
    marginLeft: 5
  }
})
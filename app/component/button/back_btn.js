import React from 'react';

import {
  View,
  TouchableOpacity,
  StyleSheet
  ,
} from 'react-native';

import IconFont from '../iconfont/iconfont';
import { Variable } from '../../res/style/variable';

export default class BackButton extends React.Component {

  onPressBack() {
    if (this.props.onPress) {
      this.props.onPress();
    }
  }

  render() {
    return (
        <TouchableOpacity onPress={this.onPressBack.bind(this)}
                          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                          style={[Styles.btn, this.props.style]}
        >
          <IconFont name={this.props.name || 'Back'}
                    size={ this.props.size || Variable.font20}
                    color={this.props.color || Variable.greyish_brown}
                    style={this.props.iconStyle || Styles.icon}/>

        </TouchableOpacity>
    );
  }

}

export const Styles = StyleSheet.create({
  btn: {
    width: 50,
    height: 44,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  icon: {
    marginLeft: 15,
  },
  back_drop: {
    flex: 1,
    flexDirection: 'row',
    height: 20,
    backgroundColor: Variable.black,
    opacity: 0.7,
    alignItems: 'center',
  },
});
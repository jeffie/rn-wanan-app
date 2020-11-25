import React, { PureComponent } from 'react'
import createIconSet from 'react-native-vector-icons/lib/create-icon-set'
import glyphMap from './iconfont.json'

const IconSet = createIconSet(glyphMap, 'Iconfont', 'iconfont.ttf')

export default class CustomIconSet extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    let { size, style } = this.props
    return (
        <IconSet {...this.props} style={[style, { lineHeight: size }]} />
    )
  }
}

export const Button = IconSet.Button
export const TabBarItem = IconSet.TabBarItem
export const TabBarItemIOS = IconSet.TabBarItemIOS
export const ToolbarAndroid = IconSet.ToolbarAndroid
export const getImageSource = IconSet.getImageSource
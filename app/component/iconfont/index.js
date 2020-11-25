import React, { PureComponent } from 'react'
import IconSet from './iconfont'

export default class CustomIcon extends PureComponent {
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

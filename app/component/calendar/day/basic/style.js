import { StyleSheet, Platform } from 'react-native'
import * as defaultStyle from '../../default_style'

const STYLESHEET_ID = 'stylesheet.day.basic'

export default function styleConstructor(theme = {}) {
  const appStyle = { ...defaultStyle, ...theme }
  return StyleSheet.create({
    base: {
      width: 30,
      height: 30,
      alignItems: 'center'
    },
    basicBox: {
      alignItems: 'center'
    },
    text: {
      marginTop: Platform.OS === 'android' ? 4 : 6,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      ...appStyle.textDayStyle
    },
    alignedText: {
      marginTop: Platform.OS === 'android' ? 4 : 6
    },
    selected: {
      borderWidth: 2,
      borderColor: '#FA9384',
      justifyContent: 'center',
      borderRadius: 15
    },
    today: {
      backgroundColor: appStyle.todayBackgroundColor,
      borderRadius: 15
    },
    todayText: {
      color: appStyle.todayTextColor
    },
    selectedText: {
      color: appStyle.selectedDayTextColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
    },
    dot: {
      width: 4,
      height: 4,
      marginTop: 1,
      borderRadius: 2,
      opacity: 0,
      ...appStyle.dotStyle
    },
    visibleDot: {
      opacity: 1,
      backgroundColor: appStyle.dotColor
    },
    selectedDot: {
      backgroundColor: appStyle.selectedDotColor
    },
    disabledDot: {
      backgroundColor: appStyle.disabledDotColor || appStyle.dotColor
    },
    todayDot: {
      backgroundColor: appStyle.todayDotColor || appStyle.dotColor
    },
    emotion: {
      marginTop: 1,
      height: 18,
      width: 18
    },
    ...(theme[STYLESHEET_ID] || {})
  })
}

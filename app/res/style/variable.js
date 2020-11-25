import {
  Dimensions,
  PixelRatio

} from 'react-native'
import { getStatusBarHeight, getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper'
const { height, width } = Dimensions.get('window')
const scaler = 1 / PixelRatio.getFontScale()
const scaleH = height / 667
const scaleW = width / 375
const px2dp = px => PixelRatio.roundToNearestPixel(px)

export const Variable = {
  px2dp: px2dp,
  statusBarHeight: getStatusBarHeight(true),
  bottomSpace: getBottomSpace(),
  isIphoneX: isIphoneX(),
  headerStyle: {
    height: getStatusBarHeight(true) + 60,
    width: width,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: 'flex-end'
  },

  yellow: '#FACC01',
  blue: '#5874DC',

  grey: '#666666',
  light_grey: '#999999',
  border_color: '#EAECEF',

  content_bg: '#25124C',
  pink: '#FA9384',
  main_bg: '#170A32',
  navi_bg: '#3C4CAC',

  black: '#282525',
  white: '#ffffff',
  background_normal: '#f1f1f1',
  background_modal: '#f8f8f8',

  wHeight: height,
  wWdith: width,
  scaleH: scaleH,
  scaleW: scaleW,

  font75: 75 * scaler,
  font72: 72 * scaler,
  font65: 65 * scaler,
  font60: 60 * scaler,
  font55: 55 * scaler,
  font50: 50 * scaler,
  font49: 49 * scaler,
  font48: 48 * scaler,
  font47: 47 * scaler,
  font46: 46 * scaler,
  font45: 45 * scaler,
  font44: 44 * scaler,
  font43: 43 * scaler,
  font42: 42 * scaler,
  font41: 41 * scaler,
  font40: 40 * scaler,
  font39: 39 * scaler,
  font38: 38 * scaler,
  font37: 37 * scaler,
  font36: 36 * scaler,
  font35: 35 * scaler,
  font34: 34 * scaler,
  font33: 33 * scaler,
  font32: 32 * scaler,
  font30: 30 * scaler,
  font29: 29 * scaler,
  font28: 28 * scaler,
  font27: 27 * scaler,
  font26: 26 * scaler,
  font25: 25 * scaler,
  font24: 24 * scaler,
  font22: 22 * scaler,
  font21: 21 * scaler,
  font20: 20 * scaler,
  font19: 19 * scaler,
  font18: 18 * scaler,
  font17: 17 * scaler,
  font16: 16 * scaler,
  font15: 15 * scaler,
  font14: 14 * scaler,
  font13: 13 * scaler,
  font12: 12 * scaler,
  font11: 11 * scaler,
  font10: 10 * scaler,
  font9: 9 * scaler,
  font8: 8 * scaler,
  font7: 7 * scaler,
  font6: 6 * scaler,
  font5: 5 * scaler,
  font4: 4 * scaler,

  border_radius_lg: 25,
  border_radius: 8,
  border_radius_sm: 5
}


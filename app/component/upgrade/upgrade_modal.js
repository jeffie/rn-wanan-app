import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Linking
} from 'react-native'
import BaseComponent from '../../base/base'
import Modal from 'react-native-modal'
import Event from '../../base/event/event'
import { Variable } from '../../res/style/variable'
import { NativeModules } from 'react-native'
import UpgradeRecord from '../../base/storage/data/upgrade'
import * as Upgrade from './upgrade'
import { IOS_APP_ID } from '../../config/conf'

export default class UpgradeModal extends BaseComponent {
  callback = null
  data = null

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    Event.addListener('AppUpgrade', Event.APP_UPGRADE, (data) => {
      this.show(data)
    })
  }

  async show(check) {
    // this.data = data
    if (Platform.OS === 'ios') {
      let updateResult = await Upgrade.checkUpdate(IOS_APP_ID, this.getAppVersion())
      this.data = {
        version: updateResult.version,
        info: updateResult.msg
      }
      if (updateResult.code === 1) {
        this.isShow(updateResult.version)
      }
    } else {
      let ret = await this.request('/version/getLastVersion', {
        version: this.getCurrentVersion(),
        os: this.getOS()
      })

      if (ret.code === 200 && ret.data) {
        this.data = ret.data
        //alert('发现新版本')
        this.isShow(this.data.version)
      }
    }
  }

  isShow(newVersion) {
    let { version, expireAt } = UpgradeRecord.get()
    expireAt = new Date(expireAt)

    if (version !== newVersion && expireAt < new Date()) {
      UpgradeRecord.update(version)
      this.setState({
        show: true
      })
    }
  }

  hide(callback) {
    this.setState({
      show: false
    })
    this.callback = callback
  }

  toggle() {
    this.setState({
      show: !this.state.show
    })
  }

  onHide() {
    this.callback && this.callback()
  }

  handleUpdate() {
    this.hide()
    if (Platform.OS === 'ios') {
      //Linking.openURL()
      Upgrade.openAPPStore(IOS_APP_ID)
    } else {
      Upgrade.upgrade(this.data.url)
    }
  }

  download() {
    NativeModules.UpgradeModule.download(this.data).then().catch((e) => {
      console.log(e)
    })
    this.hide()
  }

  componentWillUnmount() {
    Event.removeListener('AppUpgrade')
  }

  render() {
    const data = this.data || {}
    return (
        <Modal style={styles.wrapper}
               isVisible={this.state.show}
               useNativeDriver={true}
               coverScreen={true}
               hasBackdrop={false}
               onModalHide={this.onHide.bind(this)}>
          <View style={styles.box}>
            <Text style={styles.headerTitle}>发现新版本 v{data.version}</Text>
            <Text
                style={[
                  styles.desc,
                  {
                    fontSize: Variable.font16,
                    fontWeight: '600',
                    marginBottom: 10
                  }]}>更新内容：</Text>
            <Text style={styles.desc}>{data.info || '这个版本似乎很神秘，没有更新描述'}</Text>

            <View style={styles.footer}>
              <TouchableOpacity style={[styles.btn, styles.default]} onPress={() => this.hide()}>
                <Text style={styles.btnText}>稍后再说</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => this.handleUpdate()}>
                <Text style={styles.btnText}>立即更新</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 0,
    padding: 0
  },
  box: {
    borderRadius: 10,
    marginHorizontal: 30,
    paddingHorizontal: 15,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255, 0.95)'
  },
  headerTitle: {
    fontSize: Variable.font20,
    color: Variable.black,
    marginBottom: 10,
    marginLeft: 20,
    fontWeight: '500'
  },
  desc: {
    fontSize: Variable.font14,
    color: Variable.black,
    marginLeft: 20,
    fontWeight: '400',
    lineHeight: 20
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20
  },
  default: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#C4C4C4',
    marginRight: 10
  },
  btn: {
    backgroundColor: '#FACC01',
    height: 44,
    paddingHorizontal: 32,
    borderRadius: 23,
    justifyContent: 'center'
  },
  btnText: {
    fontSize: Variable.font14,
    color: '#666'
  }
})


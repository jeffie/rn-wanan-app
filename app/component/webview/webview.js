import React from 'react'
import BaseComponent from '../../base/base'
import Loading from '../common/loading'
import WebView from 'react-native-webview'
import {
    View
} from 'react-native'

export default class Browser extends BaseComponent {

    static navigationOptions = BaseComponent.SubNaviHeader("掌上山东文博会")

    title = '掌上山东文博会'
    render() {
      const _navi = this.navi()
      const param = _navi ? _navi.state.params : this.props
        return (
            <View style={{flexDirection: "column", flex: 1, justifyContent: "center"}}>
                <WebView
                    source={{uri: param.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    allowsInlineMediaPlayback={true}
                    automaticallyAdjustContentInsets={true}
                    mixedContentMode="always"
                    dataDetectorTypes="none"
                    style={{flex: 1}}
                    startInLoadingState={true}
                    renderLoading={() => <Loading/>}
                    onNavigationStateChange={(source) => {
                        this.title = param.title ? param.title : source.title ? source.title : this.title
                      _navi && _navi.setParams({title: this.title, disable: false})
                    }}
                />
            </View>
        )
    }
}
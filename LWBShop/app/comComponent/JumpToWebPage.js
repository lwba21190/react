import React, {PropTypes,Component} from 'React';
import {
	AppRegistry,
	StyleSheet,
	View
} from 'react-native';

import WebViewBridge from 'react-native-webview-bridge';

class JumpToWebPage extends Component{
	
	static propTypes = {
		url: PropTypes.string
	};
	
	static defaultProps = {
		url: ""
	};
	
	onBridgeMessage(message){
		const webViewBridge= this.refs.webViewBridge;
		switch(message) {
			case "back": {
				this.props.navigator.pop();
				break;
			}
			default:
				break;
		}
		
	}
	
	render(){
		const injectScript = `
			var header = document.getElementById("m_common_header_goback");
			header.onclick = function(){
				if(WebViewBridge){
					WebViewBridge.send("back");
				}
			}
		`;
		
		return (
			<View style={styles.container}>
				<WebViewBridge
					ref="webViewBridge"
					onBridgeMessage={this.onBridgeMessage.bind(this)}
					automaticallyAdjustContentInsets={true}
					source={{uri: this.props.url}}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					decelerationRate="normal"
					startInLoadingState={true}
					scalesPageToFit={true}
					injectedJavaScript={injectScript}
				/>
			</View>
		);
	}
}

const styles=StyleSheet.create({
	container:{
		flex:1
	}
});

export default JumpToWebPage;
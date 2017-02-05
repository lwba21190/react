import React,{ Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity
} from 'react-native';

import Main from './Main'

class Advertisement extends Component{

	constructor(props){
		super(props);
		this.state = {
			count: 5
		}
	}

	render(){
		return (
			<Image source={{uri: 'launchimage'}} style={styles.container}>
				<TouchableOpacity onPress={this.jumpOverAd.bind(this)}  style={styles.text}>
					<Text>跳过广告 {this.state.count}s </Text>
				</TouchableOpacity>
			</Image>
		);
	}

	componentDidMount(){
		this.timer = setInterval(()=>{
			if(this.state.count === 1){
				clearInterval(this.timer);
				this.props.navigator.replace({name:'首页',component: Main});
			}else{
				this.setState({
					count: this.state.count-1
				});
			}
		},1000);
	}
	componentWillUnMount() {
		this.timer && clearInterval(this.timer);
	}
	jumpOverAd(){
		this.timer && clearInterval(this.timer);
		this.props.navigator.replace({name:'首页',component: Main});
	}
}

const styles = StyleSheet.create({
	container:{
		flex: 1
	},
	text:{
		position: 'absolute',
		top: 10,
		right: 10
	}
});

export default Advertisement;
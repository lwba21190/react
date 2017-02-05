import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	TextInput,
	ListView,
	ScrollView,
	TouchableOpacity,
	Dimensions
} from 'react-native';

import JumpToWebPage from "../../comComponent/JumpToWebPage";
import SortLeftList from './SortLeftList';
import SortRightContent from './SortRightContent';

var {width,height} = Dimensions.get('window');

class Sort extends Component{
	constructor(props){
		super(props);
		this.state={
			index: 0,
		}
	}
	
	render(){
		return (
			<View style={styles.container}>
				{this.renderNav()}
				<View style={styles.contentView}>
					<SortLeftList callBackFunc={this.callBackIndex.bind(this)}/>
					<SortRightContent index={this.state.index} popToUpperLever={(url)=>this.pushToUrl(url)}/>
				</View>
			</View>
		);
	}
	
	renderNav(){
		return (
			<View style={styles.navView}>
				<TouchableOpacity style={{height:30,padding:10,justifyContent:'center'}}>
					<Image source={{uri: 'scan_black'}} style={{width: 16, height: 16}}/>
				</TouchableOpacity>
				<View style={styles.navMiddleView}>
					<TouchableOpacity style={{padding:2}}>
					<Image source={{uri: 'search_black'}} style={{width: 16, height: 16}}/>
					</TouchableOpacity>
					<TextInput placeholder='亿万神券正在疯抢！' underlineColorAndroid='transparent' style={{flex:1,padding:0}}/>
					<TouchableOpacity style={{padding:2}}>
					<Image source={{uri: 'speak_black'}} style={{width: 16, height: 16}}/>
				</TouchableOpacity>
				</View>
				<TouchableOpacity style={{height:30,padding:10,justifyContent:'center'}}>
					<Image source={{uri: 'xxzx_black'}} style={{width: 16, height: 16}}/>
				</TouchableOpacity>
			</View>
		);
	}
	
	callBackIndex(index){
		this.setState({
			index: index
		});
	}
	
	pushToUrl(url){
		this.props.navigator.push({
			component: JumpToWebPage,
			passProps: {url: url}
		});
	}
}

const styles=StyleSheet.create({
	container:{
		flex:1
	},
	navView:{
		width: width,
		height:30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: 'white'
	},
	navMiddleView:{
		flex:1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems:'center',
		backgroundColor : '#e0e0e0'
	},
	contentView: {
		flex:1,
		borderTopWidth: 1,
		borderTopColor:'#cccccc',
		flexDirection: 'row',
	}
});

export default Sort;
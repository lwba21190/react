import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
	AsyncStorage,
	Dimensions,
	TouchableOpacity
} from 'react-native';

import MineCell from './MineCell';
import MineLoad from './page/MineLoad';
import MineLogout from './page/MineLogout';

var {width,height} = Dimensions.get('window');

var config = require("../../jsonData/config.json");

var itemWidth = width/4;
var itemHeight = 50;

class Mine extends Component{
	
	constructor(props){
		super(props);
		this.state={
			middleInfo:null,
			bottomInfo:null,
			loginTitle: "登录/注册",
			hasLogin: false
		}
	}
	
	componentDidMount() {
		var self = this;
		try {
			AsyncStorage.getItem('userName',(err,result1)=>{
				if(err){
					alert(err);
					return;
				}
				if(result1){
					var userName = result1;
					AsyncStorage.getItem('token',(err,result2)=> {
						if(err){
							alert(err);
							return;
						}
						if(result2){
							this.setState({
								loginTitle: userName,
								hasLogin: true
							});
						}
					});
				}
			});
		}
		catch (error){
			alert(error);
		}
		self.getJsonData(config.host + "json/mine/mineMiddle.json",{method: 'GET'},function(err,data){
			if (err) {
				console.log("Mine componentDidMount mineMiddle:" + err);
				return;
			}
			self.setState({
				middleInfo: data
			});
		});
		
		self.getJsonData(config.host + "json/mine/mineBottom.json",{method: 'GET'},function(err,data){
			if (err) {
				console.log("Mine componentDidMount mineBottom:" + err);
				return;
			}
			self.setState({
				bottomInfo: data
			});
		});
	}
	
	
	getJsonData(url,options,callback){
		fetch(url,options)
			.then((res)=>res.json())
			.then((resJsonData)=>{
				callback(null,resJsonData);
			})
			.catch((err)=>{
				callback(err);
			});
	}
	
	render(){
		return (
			<ScrollView style={styles.container}>
				{this.renderNav()}
				{this.renderMiddle(this.state.middleInfo)}
				<View style={{marginTop:10}}>
					{this.renderBottom(this.state.bottomInfo)}
				</View>
			</ScrollView>
		);
	}
	
	
	renderNav(){
		return (
			<View style={styles.navViewStyle}>
				<TouchableOpacity style={styles.navDlzcViewStyle} onPress={()=>this.jumpToLoad()}>
					<Image source={{uri: 'dlzc'}} style={styles.navDlzcImageStyle}/>
					<Text style={styles.navDlzcTextStyle}>{this.state.loginTitle}</Text>
					{this.state.hasLogin && <MineLogout userName={this.state.loginTitle} callback={()=>this.setState({
						loginTitle:"登录/注册",
						hasLogin: false
					})}/>}
				</TouchableOpacity>
				<View style={styles.navRightViewStyle}>
					<TouchableOpacity>
						<Image source={{uri: 'setting'}} style={styles.navSettingImageStyle}/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Image source={{uri: 'xxzx_white'}} style={styles.navXxzxImageStyle}/>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
	
	logout(){
		
	}
	
	renderMiddle(info){
		if(info){
			var view = [];
			var data = info.data;
			for(var i = 0; i < data.length; i++){
				var singleStyle = (i !== 0)?{marginTop: 10}:'';
				view.push(
					<View key={i} style={[styles.lineViewStyle,singleStyle]}>
						{this.renderMiddleLine(data[i])}
					</View>
				);
			}
			return view;
		}
	}
	
	renderMiddleLine(data){
		var view = [];
		for(var i = 0; i < data.length; i++){
			var info = data[i];
			var style = (i === data.length-1)?{borderLeftWidth: 1,borderLeftColor: '#cccccc'}:'';
			view.push(
				<View key={i} style={[styles.lineSingleViewStyle,style]}>
					<MineCell iconName={info.iconName} number={info.number} title={info.title} subtitle={info.subtitle}/>
				</View>
			);
		}
		return view;
	}
	
	renderBottom(info){
		if(info)
		{
			var view = [];
			var data = info.data;
			for(var i = 0; i < data.length; i++){
				view.push(
					<View key={i} style={styles.bottomLineViewStyle}>
						{this.renderBottomLine(data[i])}
					</View>
				);
			}
			return view;
		}

	}
	
	renderBottomLine(data){
		var view = [];
		for(var i = 0; i < data.length; i++){
			var info = data[i];
			view.push(
				<View key={i} style={styles.bottomSingleViewStyle}>
					<MineCell iconName={info.iconName} number={info.number} title={info.title} subtitle={info.subtitle}/>
				</View>
			);
		}
		return view;
	}
	
	jumpToLoad(){
		var self = this;
		self.props.navigator.push({
			component:MineLoad,
			passProps:{
				callback:(text)=>self.setState({
					loginTitle:text,
					hasLogin: true
				})
			}
		});
	}

}

const styles=StyleSheet.create({
	container: {
		flex: 1
	},
	
	navViewStyle:{
		backgroundColor: 'gray',
		width: width,
		height: 100,
		justifyContent: 'center'
	},
	
	navDlzcViewStyle:{
		marginLeft: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	
	navDlzcImageStyle:{
		width: 64,
		height: 64
	},
	navDlzcTextStyle:{
		marginLeft: 5,
		color: 'white'
	},
	
	navRightViewStyle:{
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'center',
		right: 10,
		top: 10
	},
	
	navSettingImageStyle:{
		width: 16,
		height: 16,
		marginRight: 10
	},
	
	navXxzxImageStyle:{
		width: 16,
		height: 16
	},
	
	lineViewStyle:{
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: 'white',
		height: itemHeight
	},
	
	lineSingleViewStyle:{
		width: width/5,
		height: itemHeight,
		justifyContent: 'center',
		alignItems: 'center'
	},
	
	bottomLineViewStyle:{
		flexDirection: 'row',
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#cccccc'
	},
	
	bottomSingleViewStyle:{
		width: itemWidth,
		height: itemHeight,
		justifyContent: 'center',
		alignItems: 'center',
	}
});

export default Mine;
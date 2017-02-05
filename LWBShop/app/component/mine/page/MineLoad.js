import React, {PropType,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	TextInput,
	Image,
	Alert,
	AsyncStorage,
	TouchableOpacity,
	Dimensions
} from 'react-native';

import MineNav from "./MineNav";
import MineRegistry from "./MineRegistry";

var {width,height} = Dimensions.get('window');
var config = require("../../../jsonData/config.json");

class MineLoad extends Component{
	constructor(props){
		super(props);
		this.state = {
			userName: "",
			password: "",
			popToUpperLever:props.callback
		}
	}
	
	render(){
		return (
			<View style={styles.container}>
				<MineNav title="登录" navigator={this.props.navigator}/>
				{this.renderContent()}
			</View>
		);
	}
	
	renderContent(){
		return(
			<View style={{flex:1}}>
				<View style={styles.topView}>
					<View style={styles.topTopView}>
						<View style={styles.topTopContentView}>
							<Text>账号</Text>
							<TextInput
								style={styles.textInput}
								placeholder="用户名/邮箱/手机号"
								placeholderTextColor='#cccccc'
							    autoCapitalize="none"
								underlineColorAndroid='transparent'
								onChangeText={(text)=>this.setState({userName: text})}
								value={this.state.userName}
							/>
						</View>
						<View  style={[styles.topTopContentView,{marginTop:5}]}>
							<Text>密码</Text>
							<TextInput
								style={styles.textInput}
							    placeholder="请输入密码"
							    placeholderTextColor='#cccccc'
								autoCapitalize="none"
								secureTextEntry={true}
								underlineColorAndroid='transparent'
								onChangeText={(text)=>{this.setState({password: text})}}
								value={this.state.password}
							/>
						</View>
					</View>
					<TouchableOpacity style={[styles.topMiddleView,{backgroundColor: (this.state.userName && this.state.password)?'red':'#cccccc'}]}
					                  onPress={()=>this.login()}>
						<Text style={{color: (this.state.userName && this.state.password)?'white':'#7b7b7b'}}>登录</Text>
					</TouchableOpacity>
					<View style={styles.topBottomView}>
						<Text style={{fontSize:12}} onPress={()=>this.props.navigator.push({component: MineRegistry,passProps:{type:"registry"}})}>注册</Text>
						<Text style={{fontSize:12}} onPress={()=>this.props.navigator.push({component: MineRegistry,passProps:{type:"modifyPassword"}})}>忘记密码</Text>
					</View>
				</View>
				<View style={styles.bottomView}>
					<TouchableOpacity  style={styles.bottomItemView}>
						<Image source={{uri: 'weixin'}} style={{width:32, height:32}}/>
						<Text style={{fontSize: 12}}>微信登录</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.bottomItemView}>
						<Image source={{uri: 'qq'}} style={{width:32, height:32}}/>
						<Text style={{fontSize: 12}}>QQ登录</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
	
	login(){
		var self = this;
		fetch(config.host+ "login",{
			headers: {
				'Content-Type': 'application/json'
			},
			method:"POST",
			body:JSON.stringify({
				"userName": self.state.userName,
				"password": self.state.password,
			})
		})
		.then((res)=>{
			return res.json();
		})
		.then((resText)=>{
			if(resText.result){
				try {
					AsyncStorage.setItem("userName", self.state.userName, (err)=> {
						if (err) {
							alert("存储userName错误：" + err);
						}
						AsyncStorage.setItem("token",resText.token,(err)=>{
							if (err) {
								alert("存储token错误："+err);
							}
							Alert.alert(null,resText.msg,[{text:"确定",onPress:()=>{
								AsyncStorage.getItem("localShopCar",function(err,result){
									if(err){
										alert(err);
										return;
									}
									if(result){
										fetch(config.host + "synchronizeShopCarInfo",{
											headers: {
											'Content-Type': 'application/json'
											},
											method:"POST",
											body:JSON.stringify({
												"userName": self.state.userName,
												"token": resText.token,
												"info": JSON.parse(result)
											})
										}).then((res)=>{
											return res.json();
										}).then((resJson)=>{
											if(!resJson.result){
												alert(resJson.msg);
											}else{
												AsyncStorage.removeItem("localShopCar");
											}
										}).catch((err)=>{
											alert(err);
										});
									}
								});
								self.state.popToUpperLever(self.state.userName);
								self.props.navigator.pop();
							}}]);
						});
					});
				}catch(err){
					alert(err);
				}
			}else{
				Alert.alert(null,"登录失败:"+resText.msg,[{text:"确定"}]);
			}
		})
		.catch((err)=>{
			Alert.alert(null,err);
		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	
	topView:{
		width:width,
		padding:10,
		alignItems:'center',
		marginTop: 80,
	},
	topTopView:{
		flex:1,
		height:50,
		alignItems:'center'
	},
	topMiddleView:{
		marginTop:20,
		width:width-20,
		height: 25,
		justifyContent:'center',
		alignItems:'center',
		borderRadius:5
	},
	
	topBottomView:{
		width:width-20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 20
	},
	
	topTopContentView:{
		flexDirection:'row',
		alignItems: 'center',
		flex:1,
		height: 25,
		borderBottomWidth:1,
		borderBottomColor:'gray',
	},
	
	textInput:{
		marginLeft:10,
		flex:1,
		padding: 0,
		fontSize: 12,
	},
	
	bottomView:{
		position: 'absolute',
		width:width,
		bottom: 20,
		flexDirection:'row',
		justifyContent:'space-around',
	},
	
	bottomItemView:{
		justifyContent:'center',
		alignItems:'center'
	}
});

export default MineLoad;
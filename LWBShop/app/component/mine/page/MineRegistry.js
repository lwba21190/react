import React, {PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	Alert,
	TextInput,
	Dimensions,
	TouchableOpacity
} from 'react-native';

import MineNav from "./MineNav";

var {width,height} = Dimensions.get('window');
var config = require("../../../jsonData/config.json");
var interval;

class MineRegistry extends Component{
	constructor(props){
		super(props);
		this.state = {
			accountName:"",
			password: "",
			passwordConfirm:"",
			phoneNumber: "",
			email: "",
			imgVerificationCode: "",
			smsVerificationCode:"",
			reverseCount: 60,
			phoneVerifyTitle: "获取验证码",
			phoneVerifyBtnDisable: false,
			imgFlushParam: "?p="+Math.random()
		}
	}
	
	componentWillUnMount() {
		interval && clearInterval(interval);
	}
	
	render(){
		return (
			<View style={styles.container}>
				<MineNav title={(this.props.type=="registry")?"注册":"找回密码"} navigator={this.props.navigator}/>
				{this.renderContent()}
			</View>
		);
	}
	
	renderContent(){
		return(
			<View style={styles.contentView}>
				{(this.props.type === "registry") && this.renderItem("用户名","请输入用户名",false,(text)=>{this.setState({accountName:text})})}
				{this.renderItem("设置密码","请输入密码",true,(text)=>{this.setState({password:text})})}
				{this.renderItem("确认密码","请再次输入密码",true,(text)=>{this.setState({passwordConfirm:text})})}
				{this.renderItem("手机号码","请输入手机号码",false,(text)=>{this.setState({phoneNumber:text})})}
				{(this.props.type === "registry") && this.renderItem("邮箱地址","请输入常用邮箱地址",false,(text)=>{this.setState({email:text})})}
				<View>
					<TouchableOpacity  style={{position:'absolute',right:10,top:20,zIndex:1}} onPress={()=>{
						this.setState({imgFlushParam: "?p="+Math.random()});
					}}>
						<Image source={{uri: config.host+ "captcha.png" + this.state.imgFlushParam}} style={{width:80,height:25}}/>
					</TouchableOpacity>
					{this.renderItem("验证码","请输入验证码",false,(text)=>{this.setState({imgVerificationCode:text})})}
				</View>
				<View>
					<TouchableOpacity disabled={this.state.phoneVerifyBtnDisable} style={styles.verifyCodeView} onPress={()=>this.getPhoneVerifyCode()}>
						<Text style={{fontSize:10}}>{this.state.phoneVerifyTitle}</Text>
					</TouchableOpacity>
					{this.renderItem("手机验证码","请输入手机验证码",false,(text)=>{this.setState({smsVerificationCode:text})})}
				</View>
				<TouchableOpacity style={styles.registryButtonView} onPress={()=>this.register()}>
					<Text style={{color:'white'}}>{(this.props.type=="registry")?"注册":"确认"}</Text>
				</TouchableOpacity>
			</View>
		);
	}
	
	renderItem(title,placeholder,isPasswordTextInput,callback){
		return (
			<View style={styles.itemView}>
				<View style={{width:70,justifyContent:'center',alignItems:'center'}}>
					<Text>{title}</Text>
				</View>
				<TextInput
					style={styles.textInput}
					placeholder={placeholder}
					placeholderTextColor='#cccccc'
					autoCapitalize="none"
					secureTextEntry={isPasswordTextInput}
					underlineColorAndroid='transparent'
					onChangeText={(text)=>callback(text)}
				/>
			</View>
		);
	}
	
	getPhoneVerifyCode(){
		var self = this;
		let count = 60;
		this.setState({
			phoneVerifyTitle: count+"s后重新获取",
			phoneVerifyBtnDisable: true
		});
		interval = setInterval(()=>{
			if(count > 0) {
				count--;
				self.setState({
					reverseCount:count,
					phoneVerifyTitle: count+"s后重新获取"
				});
			}
			else{
				clearInterval(interval);
				self.setState({
					reverseCount:60,
					phoneVerifyTitle: "获取验证码",
					phoneVerifyBtnDisable: false
				});
			}
		},1000);
		fetch(config.host + "smsVerificationCode" + "?phoneNumber="+this.state.phoneNumber,{method:"GET"})
			.then((res)=>{
				return res.json();
			})
			.then((resText)=>{
				console.log(resText.msg);
			})
			.catch((err)=>{
				alert("获取短信验证码失败:" + err);
			});
	}
	
	register(){
		var self = this;
		var options = {
			"password": self.state.password,
			"passwordConfirm": self.state.passwordConfirm,
			"phoneNumber": self.state.phoneNumber,
			"imgVerificationCode": self.state.imgVerificationCode,
			"smsVerificationCode": self.state.smsVerificationCode
		};
		var path = "modifyPassword";
		if(!self.state.password) {alert("密码不能为空！");return;}
		if(!self.state.passwordConfirm) {alert("确认密码不能为空！");return;}
		if(!self.state.phoneNumber) {alert("手机号码不能为空！");return;}
		if(!self.state.imgVerificationCode) {alert("验证码不能为空！");return;}
		if(!self.state.smsVerificationCode) {alert("短信验证码不能为空！");return;}
		if(self.state.password !== self.state.passwordConfirm){alert("确认密码与密码不相同，请重新输入");return;}
		if(self.props.type=="registry"){
			if(!self.state.accountName) {alert("用户名不能为空！");return;}
			if(!self.state.email) {alert("邮箱不能为空！");return;}
			var emailFormat =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if(!emailFormat.test(self.state.email)){
				alert("邮箱地址格式有问题，请从新输入");
				return;
			}
			options["accountName"] =  self.state.accountName;
			options["email"] =  self.state.email;
			path = "registry";
		}
		
		fetch(config.host+ path,{
			headers: {
				'Content-Type': 'application/json'
			},
			method:"POST",
			body:JSON.stringify(options)
		})
		.then((res)=>{
			return res.json();
		})
		.then((resText)=>{
			if(resText.result){
				Alert.alert(null,resText.msg,[{text:"确定",onPress:()=>{
					interval && clearInterval(interval);
					self.props.navigator.pop();
				}}]);
			}else{
				Alert.alert(null,resText.msg,[{text:"确定",onPress:()=>self.setState({
					phoneVerifyBtnDisable: true,
					phoneVerifyTitle: "获取验证码"
				})}]);
			}

		})
		.catch((err)=>{
			self.setState({
				phoneVerifyBtnDisable: true,
				phoneVerifyTitle: "获取验证码"
			});
			Alert.alert(null,err);
		});
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'white'
	},
	contentView:{
		padding:20,
		marginTop: 30,
		alignItems:'center'
	},
	itemView:{
		flexDirection:'row',
		alignItems: 'center',
		width:width-40,
		height: 25,
		borderBottomWidth:1,
		borderBottomColor:'gray',
		marginTop:20
	},
	textInput:{
		marginLeft:10,
		flex:1,
		padding: 0,
		fontSize: 12,
	},
	registryButtonView:{
		marginTop:20,
		width:width-40,
		height: 25,
		justifyContent:'center',
		alignItems:'center',
		borderRadius:5,
		backgroundColor:'red'
	},
	
	verifyCodeView: {
		position:'absolute',
		top:20,
		right:10,
		backgroundColor:'#cccccc',
		width:80,
		height:22,
		justifyContent:'center',
		alignItems:'center',
		zIndex:1
	}
});

export default MineRegistry;
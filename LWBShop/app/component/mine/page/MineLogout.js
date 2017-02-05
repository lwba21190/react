import React,{PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	AsyncStorage,
	Alert,
	TouchableOpacity
} from 'react-native';

var config = require("../../../jsonData/config.json");

class MineLogout extends Component{
	
	static propTypes = {
		userName: PropTypes.string,
		callback: PropTypes.func
	};
	
	static defaultProps = {
		userName: null,
		popToUpperLever: null
	};
	
	render(){
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={()=>this.logout()}>
					<Text style={{fontSize:10,color:'white'}}>注销</Text>
				</TouchableOpacity>
			</View>
		);
	}
	
	logout(){
		var self = this;
		Alert.alert(null,"确认注销？",[{text:"取消",onPress:()=>{
			
		}},{text:"确定",onPress:()=>{
			AsyncStorage.getItem("userName",(err,result)=>{
				//TODO:错误处理
				if(err){
					alert("获取本地token失败");
					return;
				}
				if(result) {
					AsyncStorage.getItem("token", (err, result)=> {
						//TODO:错误处理
						if (err) {
							alert("获取本地token失败");
							return;
						}
						fetch(config.host + "logout", {
							headers: {
								'Content-Type': 'application/json'
							},
							method: "POST",
							body: JSON.stringify({
								"userName": self.props.userName,
								"token": result
							})
						})
						.then((res)=> {
							return res.json();
						})
						.then((resText)=> {
							if (resText.result) {
								AsyncStorage.removeItem("userName", function (err) {
									if (err) {
										alert("删除userName错误：" + err);
									}
								});
								AsyncStorage.removeItem("token", function (err) {
									if (err) {
										alert("删除token错误：" + err);
									}
								});
								Alert.alert(null, resText.msg, [{
									text: "确定", onPress: ()=> {
										self.props.callback(true);
									}
								}]);
							} else {
								Alert.alert(null, resText.msg, [{
									text: "确定", onPress: ()=> {
										self.props.callback(false);
									}
								}]);
							}
						})
						.catch((err)=> {
							Alert.alert(null, err);
						});
						
					});
				}
			});
		}}]);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'red',
		marginLeft: 10,
		width: 30,
		justifyContent:'center',
		alignItems:'center',
		borderRadius:5,
	}
});


export default MineLogout;
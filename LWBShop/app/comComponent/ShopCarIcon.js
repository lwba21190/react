import React, {PropTypes, Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Image,
	Text,
	AsyncStorage,
	TouchableOpacity
} from 'react-native';

var config = require("../jsonData/config.json");

class ShopCarIcon extends Component{
	
	static propTypes = {
		info: PropTypes.object,
		style: PropTypes.object
	};
	
	static defaultProps = {
		info: null,
		style:null
	};
	
	render(){
		return (
			<TouchableOpacity style={[this.props.style,styles.container]} onPress={()=>this.addCommodityToShopCar(this.props.info)}>
				<Image source={{uri: "shopcar"}} style={{width: 16,height:16}} />
			</TouchableOpacity>
		);
	}
	
	addCommodityToShopCar(info){
		AsyncStorage.getItem("userName",function (err,result) {
			if(err){
				alert(err);
				return;
			}
			if(result){
				var userName = result;
				AsyncStorage.getItem("token",function (err,result) {
					if (err) {
						alert(err);
						return;
					}
					var options = {
						"userName": userName,
						"token":result,
						"cmd":3,
						"params":{
								"info":info
						}
					};
					fetch(config.host + "updateShopCarData", {
						headers: {
							'Content-Type': 'application/json'
						},
						method: "POST",
						body: JSON.stringify(options)
					})
						.then((res)=> {
							return res.json();
						})
						.then((resJsonData)=> {
							if (resJsonData.result) {
								alert("更新成功");
							} else {
								alert("更新失败");
							}
						})
						.catch((err)=> {
						});
				});
			}else{
				AsyncStorage.getItem("localShopCar",function(err,result1){
					if(err){
						alert(err);
						return;
					}
					var price = parseFloat(info.jdPrice);
					if(!result1) {
						var newInfo = {
							"cartInfo": {
								"isSelected": true,
								"Price":price,
								"Num": 1,
								"vendors": [{
									"isSelected": true,
									"vendorPrice": price,
									"shopName": "京东自营",
									"shopId": -1,
									"sorted": [{
										"propertyTags": {
											"a": null,
											"b": null
										},
										"isSelected": true,
										"cid": parseInt(info.wareId),
										"ImgUrl": info.imageurl.substr(info.imageurl.indexOf("jfs")),
										"Price": price,
										"Num": 1,
										"Name": info.wname
									}]
								}]
							}
						};
						AsyncStorage.setItem("localShopCar",JSON.stringify(newInfo));
					}else{
						var json = JSON.parse(result1);
						var i = 0;
						for(; i < json.cartInfo.vendors[0].sorted.length; i++){
							if(parseInt(info.cid) == json.cartInfo.vendors[0].sorted[i].cid){
								json.cartInfo.vendors[0].sorted[i].Num += 1;
								break;
							}
						}
						if(i = json.cartInfo.vendors[0].sorted.length){
							var item = {
								"propertyTags": {
									"a": null,
									"b": null
								},
								"isSelected": true,
								"cid": parseInt(info.wareId),
								"ImgUrl": info.imageurl.substr(info.imageurl.indexOf("jfs")),
								"Price": price,
								"Num": 1,
								"Name": info.wname
							};
							
							json.cartInfo.vendors[0].sorted.push(item);
						}
						json.cartInfo.vendors[0].vendorPrice = parseFloat((json.cartInfo.vendors[0].vendorPrice + price).toFixed(2));
						json.cartInfo.Price = parseFloat((json.cartInfo.Price+ price).toFixed(2));
						json.cartInfo.Num += 1;
						AsyncStorage.setItem("localShopCar",JSON.stringify(json));
					}
				});
			}
		});
		
	}
}

const styles = StyleSheet.create({
	container:{
		width: 18,
		height: 18,
		borderWidth:1,
		borderRadius: 2,
		borderColor: 'gray'
	}
});

export default ShopCarIcon;

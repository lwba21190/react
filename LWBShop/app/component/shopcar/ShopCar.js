import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	ListView,
	ScrollView,
	AsyncStorage,
	TouchableOpacity,
	Dimensions
} from 'react-native';

import JumpToWebPage from "../../comComponent/JumpToWebPage";
import CheckBox from "../../comComponent/CheckBox";
import ShopCarSelectedInfo from './ShopCarSelectedInfo';
import RecommendItem from "../../comComponent/RecommendItem";

var config = require("../../jsonData/config.json");
var recommendItemData = [
	'shopcar_recommand_0.json',
	'shopcar_recommand_1.json',
	'shopcar_recommand_2.json',
	'shopcar_recommand_3.json',
	'shopcar_recommand_4.json',
	'shopcar_recommand_5.json',
	'shopcar_recommand_6.json',
	'shopcar_recommand_7.json',
	'shopcar_recommand_8.json',
	'shopcar_recommand_9.json'
];

var {width,height} = Dimensions.get('window');

class ShopCar extends Component{
	constructor(props){
		super(props);
		
		var getRowData = (dataBlob,sectionID,rowID) => {
			return dataBlob[sectionID+":"+rowID]
		};
		
		var getSectionHeaderData = (dataBlob,sectionID) => {
			return dataBlob[sectionID];
		};
		
		this.state = {
			index: 0,
			dataBlob: {},
			sectionIDs: [],
			rowIDs: [],
			isEditState: false,
			totalCost: 0,
			isAllSelected:true,
			data: null,
			dataSource: new ListView.DataSource({
				rowHasChanged:(r1,r2)=> r1 !== r2,
				sectionHeaderHasChanged:(s1,s2) => s1 != s2,
				getRowData: getRowData,
				getSectionHeaderData: getSectionHeaderData
			})
		}
	}
	
	componentWillReceiveProps(props) {
		var self = this;
		try {
			AsyncStorage.getItem("userName", (err,result)=> {
				if (err) {
					alert("存储userName错误：" + err);
				}
				if(result){
					var userName = result;
					AsyncStorage.getItem("token", (err,result)=> {
						if (err) {
							alert("存储token错误：" + err);
						}
						if(result) {
							self.getJsonData(config.host + "shopCarInfo" + "?userName="+userName+"&token="+result, {
								method: 'GET',
							}, function(err, data) {
								if (err) {
									alert("ShopCar componentDidMount shopcar:" + err);
									return;
								}
								self.updateHeaderData(data, self.state.dataBlob, self.state.sectionIDs, self.state.rowIDs);
							});
						}else{
							self.updateHeaderData({"result": false, "msg": "购物车为空"}, self.state.dataBlob, self.state.sectionIDs, self.state.rowIDs);
						}
					});
				}else {
					AsyncStorage.getItem("localShopCar",function(err,result){
						if(err){
							alert(err);
							return;
						}
						if(result){
							var json = JSON.parse(result);
							var data = {
								"result": true,
								"msg": json.cartInfo
							};
							self.updateHeaderData(data, self.state.dataBlob, self.state.sectionIDs, self.state.rowIDs);
						}else{
							self.updateHeaderData({"result": false, "msg": "购物车为空"}, self.state.dataBlob, self.state.sectionIDs, self.state.rowIDs);
						}
					});
					
				}
			});
		}catch (err){
			alert(err);
		}
	}
	
	componentWillMount() {
		//AsyncStorage.removeItem("localShopCar");
		var self = this;
		var dataBlob = {"0":{"result":false,"msg":"购物车为空"}};
		var sectionIDs = [0];
		var rowIDs = [];
		try {
			AsyncStorage.getItem("userName", (err,result)=> {
				if (err) {
					alert("存储userName错误：" + err);
				}
				if(result){
					var userName = result;
					AsyncStorage.getItem("token", (err,result)=> {
						if (err) {
							alert("存储token错误：" + err);
						}
						if(result) {
							self.getJsonData(config.host + "shopCarInfo" + "?userName="+userName+"&token="+result, {
								method: 'GET',
							}, function(err, data){
								if (err) {
									alert("ShopCar componentDidMount shopcar:" + err);
									return;
								}
								self.updateHeaderData(data, dataBlob, sectionIDs, rowIDs);
							});
						}else{
							self.updateHeaderData({"result": false, "msg": "购物车为空"}, dataBlob, sectionIDs, rowIDs);
						}
					});
				}else {
					AsyncStorage.getItem("localShopCar",function(err,result){
						if(err){
							alert(err);
							return;
						}
						if(result){
							var json = JSON.parse(result);
							var data = {
								"result": true,
								"msg": json.cartInfo
							};
							self.updateHeaderData(data, dataBlob, sectionIDs, rowIDs);
						}else{
							self.updateHeaderData({"result": false, "msg": "购物车为空"}, dataBlob, sectionIDs, rowIDs);
						}
					});
					
				}
			});
		}catch (err){
			alert(err);
		}
		
		self.getJsonData(config.host + "json/shopcar/" + recommendItemData[self.state.index], {method: 'GET'}, function (err, data) {
			if (err) {
				console.log("ShopCar componentDidMount recommendItemData:" + err);
				return;
			}
			var info = data.wareInfoList;
			self.updateRowData(info,dataBlob,sectionIDs,rowIDs,self.state.index);
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
	
	updateHeaderData(data,dataBlob,sectionIDs,rowIDs){
		var self = this;
		sectionIDs = [];
		sectionIDs.push(0);
		dataBlob[0] = data;
		let updateDataBlob = JSON.parse(JSON.stringify(dataBlob));
		if(data.result){
			self.setState({
				isAllSelected: data.msg.isSelected,
				totalCost: data.msg.Price,
			});
		}else{
			self.setState({
				isAllSelected: false,
				totalCost: 0,
			});
		}
		if(rowIDs.length > 0) {
			self.setState({
				dataBlob: updateDataBlob,
				sectionIDs: sectionIDs,
				dataSource: self.state.dataSource.cloneWithRowsAndSections(updateDataBlob, sectionIDs, rowIDs)
			});
		}
	}
	
	updateRowData(data,dataBlob,sectionIDs,rowIDs,index){
		var self = this;
		var itemData = data;
		rowIDs[0] = [];
		var k = 0;
		for(var j = 0; j < itemData.length; j += 2){
			rowIDs[0].push(k);
			dataBlob[0+':'+k] = [itemData[j],itemData[j+1],itemData.length];
			k++;
		}
		let updateDataBlob = JSON.parse(JSON.stringify(dataBlob));
		if(sectionIDs.length > 0) {
			self.setState({
				index: index,
				dataBlob: updateDataBlob,
				rowIDs: rowIDs,
				data: itemData,
				dataSource: self.state.dataSource.cloneWithRowsAndSections(updateDataBlob, sectionIDs, rowIDs)
			});
		}
	}
	
	render(){
		return (
			<View style={styles.container}>
				{this.renderNavView()}
				{this.renderMiddleView()}
				{this.renderBottomView()}
			</View>
		);
	}
	
	renderNavView(){
		return (
			<View style={styles.navViewStyle}>
				<Text style={{fontSize: 16}}>购物车</Text>
				{this.renderNavMiddleText()}
				<TouchableOpacity style={{position: 'absolute', right: 10,top: 8}}>
					<Image source={{uri: 'xxzx_black'}} style={{width: 16, height: 16}}/>
				</TouchableOpacity>
			</View>
		);
	}
	
	renderNavMiddleText(){
		var text = (this.state.isEditState)?"完成":"编辑";
		return (
			<TouchableOpacity
				onPress={()=>this.setState({isEditState: !this.state.isEditState})}
				style={{position: 'absolute', right: 40,top: 8}}
			>
				<Text style={{color: '#999999',fontSize: 10}}>{text}</Text>
			</TouchableOpacity>
		);
	}
	
	renderMiddleView(){
		return (
			<View style={styles.middleViewStyle}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)}
					renderSectionHeader={this.renderSectionHeader.bind(this)}
					pageSize={2}
					initialListSize={2}
					onEndReached={this.onEndReached.bind(this)}
					onEndReachedThreshold={200}
					enableEmptySections={true}
					showsVerticalScrollIndicator={false}
				/>
			</View>
		);
	}
	
	renderBottomView(){
		return (
			<View style={styles.bottomViewStyle}>
				<View style={{flexDirection: 'row',justifyContent:'center',alignItems: 'center',width:70,height:30}}>
					<CheckBox defaultValue={this.state.isAllSelected} callback={(value)=>{
						var options = {
							"cmd":0,
							"params":{
								"isSelected": value
							}
						};
						this.updateShopCarInfo(options);
					}}/>
					<Text style={{color: 'black',fontSize:10,marginLeft:5}}>全选</Text>
				</View>
				<View style={{flex:1,justifyContent:'center',height:30}}>
					<Text style={{color: 'black',fontSize:12}}>合计:￥{this.state.totalCost}</Text>
					<Text style={{color: 'black',fontSize:8}}>￥{this.state.totalCost}</Text>
				</View>
				<View style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center',backgroundColor: 'red',width:80,height:30}}>
					<Text style={{color:'white',fontSize: 12}}>去结算</Text>
				</View>
			</View>
		);
	}
	
	renderRow(rowData){
		return (
			<View style={{width:width,height:200,flexDirection:'row'}}>
				<View style={{flex:1, padding:2}}>
					<RecommendItem info={rowData[0]} popToUpperLever={(url)=>this.pushToUrl(url)}/>
				</View>
				<View style={{flex:1, padding:2}}>
					{rowData[1] && <RecommendItem  info={rowData[1]}  popToUpperLever={(url)=>this.pushToUrl(url)}/>}
				</View>
			</View>
		);
	}
	
	renderSectionHeader(sectionData,sectionID){
		if(sectionData.result){
			return (
				<View>
					<ShopCarSelectedInfo info={sectionData.msg} callback={(options)=>{
						this.updateShopCarInfo(options);
					}}/>
					<View style={styles.dividingLine}>
						<Image source={{uri: 'wntj'}} style={{width: 10, height: 10}}/>
						<Text style={{fontSize: 10, marginLeft: 5}}>为你推荐</Text>
					</View>
				</View>
			);
		}else{
			return (
				<View style={{backgroundColor:'white',borderTopWidth:1,borderTopColor:'#cccccc'}}>
					<View style={{width:width,height:30,alignItems:'center',justifyContent:'center'}}>
						<Text style={{fontSize:10,color:'gray'}}>{sectionData.msg}</Text>
					</View>
					<View style={styles.dividingLine}>
						<Image source={{uri: 'wntj'}} style={{width: 10, height: 10}}/>
						<Text style={{fontSize: 10, marginLeft: 5}}>为你推荐</Text>
					</View>
				</View>
			);
		}
	}
	
	onEndReached(){
		var self = this;
		var index = self.state.index + 1;
		if(index < recommendItemData.length){
			self.getJsonData(config.host + "json/shopcar/" + recommendItemData[index],{method:'GET'},function(err,data) {
				if (err) {
					console.log("ShopCar onEndReached:" + err);
					return;
				}
				let info = [...self.state.data,...data.wareInfoList];
				self.updateRowData(info,self.state.dataBlob,self.state.sectionIDs,self.state.rowIDs,index);
			});
		}
	}
	
	updateShopCarInfo(options){
		var self = this;
		AsyncStorage.getItem("userName",function(err,result) {
			//TODO:错误处理
			if (err) {
				alert("获取本地userName失败");
				return;
			}
			if(result) {
				var userName = result;
				AsyncStorage.getItem("token", function (err, result) {
					if (err) {
						alert("获取本地token失败");
						return;
					}
					var token = result;
					options.userName = userName;
					options.token = token;
					fetch(config.host + "updateShopCarData", {
						headers: {
							'Content-Type': 'application/json'
						},
						method: "POST",
						body: JSON.stringify(options)
					})
						.then((res)=>res.json())
						.then((resJsonData)=> {
							if (resJsonData.result && resJsonData.msg) {
								self.updateHeaderData(resJsonData, self.state.dataBlob, self.state.sectionIDs, self.state.rowIDs);
							} else if(resJsonData.result) {
								self.updateHeaderData({"result":false,"msg":"购物车为空"}, self.state.dataBlob, self.state.sectionIDs, self.state.rowIDs);
							}else{
								alert(resJsonData.msg);
							}
						})
						.catch((err)=> {
							alert(err);
						});
				});
			}else{
				AsyncStorage.getItem("localShopCar",function(err,result){
					if(err){
						alert(err);
						return;
					}
					if(result) {
						var json = JSON.parse(result);
						var cartInfo = json.cartInfo;
						switch (options.cmd) {
							case 0: { //全选按钮操作
								cartInfo.isSelected = options.params.isSelected;
								cartInfo.Num = 0;
								cartInfo.Price = 0;
								for (var i = 0; i < cartInfo.vendors.length; i++) {
									cartInfo.vendors[i].isSelected = options.params.isSelected;
									cartInfo.vendors[i].vendorPrice = 0;
									for (var j = 0; j < cartInfo.vendors[i].sorted.length; j++) {
										cartInfo.vendors[i].sorted[j].isSelected = options.params.isSelected;
										if (cartInfo.isSelected) {
											cartInfo.Num += cartInfo.vendors[i].sorted[j].Num;
											cartInfo.Price += cartInfo.vendors[i].sorted[j].Price;
											cartInfo.vendors[i].vendorPrice += cartInfo.vendors[i].sorted[j].Price;
										}
									}
								}
								break;
							}
							case 1: { //商店操作
								cartInfo.vendors[options.params.shopId].isSelected = options.params.isSelected;
								if (!cartInfo.vendors[options.params.shopId].isSelected) {
									cartInfo.isSelected = false;
									for (var k = 0; k < cartInfo.vendors[options.params.shopId].sorted.length; k++) {
										cartInfo.Num -= cartInfo.vendors[options.params.shopId].sorted[k].Num;
									}
									cartInfo.Price = parseFloat((cartInfo.Price - cartInfo.vendors[options.params.shopId].vendorPrice).toFixed(2));
									cartInfo.vendors[options.params.shopId].vendorPrice = 0;
								} else {
									cartInfo.vendors[options.params.shopId].vendorPrice = 0;
									for (var n = 0; n < cartInfo.vendors[options.params.shopId].sorted.length; n++) {
										cartInfo.vendors[options.params.shopId].vendorPrice += cartInfo.vendors[options.params.shopId].sorted[n].Price;
										cartInfo.Num += cartInfo.vendors[options.params.shopId].sorted[n].Num;
									}
									cartInfo.vendors[options.params.shopId].vendorPrice = parseFloat(cartInfo.vendors[options.params.shopId].vendorPrice.toFixed(2));
									cartInfo.Price = 0;
									cartInfo.isSelected = true;
									for (var o = 0; o < cartInfo.vendors.length; o++) {
										cartInfo.Price +=  cartInfo.vendors[o].vendorPrice;
										cartInfo.isSelected = cartInfo.isSelected && cartInfo.vendors[o].isSelected;
										if (!cartInfo.isSelected) {
											break;
										}
									}
									cartInfo.Price = parseFloat(cartInfo.Price.toFixed(2));
								}
								for (var l = 0; l < cartInfo.vendors[options.params.shopId].sorted.length; l++) {
									cartInfo.vendors[options.params.shopId].sorted[l].isSelected = options.params.isSelected;
								}
								break;
							}
							case 2: { //商品操作
								var shopInfo1 = cartInfo.vendors[options.params.shopId];
								var commodityInfo = shopInfo1.sorted[options.params.commodityId];
								switch (options.params.cmd) {
									case 0: { //商品按钮操作
										commodityInfo.isSelected = options.params.isSelected;
										var diffPrice = commodityInfo.Num * commodityInfo.Price;
										if (commodityInfo.isSelected) {
											cartInfo.Price = parseFloat((cartInfo.Price + diffPrice).toFixed(2));
											shopInfo1.vendorPrice = parseFloat((shopInfo1.vendorPrice + diffPrice).toFixed(2));
											cartInfo.Num += commodityInfo.Num;
										} else {
											cartInfo.Price = parseFloat((cartInfo.Price - diffPrice).toFixed(2));
											shopInfo1.vendorPrice = parseFloat((shopInfo1.vendorPrice - diffPrice).toFixed(2));
											cartInfo.Num -= commodityInfo.Num;
										}
										break;
									}
									case 1: { //减操作
										commodityInfo.Num -= 1;
										commodityInfo.isSelected = true;
										shopInfo1.vendorPrice = parseFloat((shopInfo1.vendorPrice - commodityInfo.Price).toFixed(2));
										cartInfo.Price = parseFloat((cartInfo.Price - commodityInfo.Price).toFixed(2));
										cartInfo.Num -= 1;
										break;
									}
									case 2: { //加操作
										commodityInfo.Num += 1;
										commodityInfo.isSelected = true;
										shopInfo1.vendorPrice = parseFloat((shopInfo1.vendorPrice + commodityInfo.Price).toFixed(2));
										cartInfo.Price = parseFloat((cartInfo.Price + commodityInfo.Price).toFixed(2));
										cartInfo.Num += 1;
										break
									}
									default: {
										alert("暂不支持该操作");
										return;
									}
								}
								shopInfo1.sorted[options.params.commodityId] = commodityInfo;
								shopInfo1.isSelected = true;
								for (var j = 0; j < shopInfo1.sorted.length; j++) {
									shopInfo1.isSelected = shopInfo1.isSelected && shopInfo1.sorted[j].isSelected;
									if (!shopInfo1.isSelected) {
										break;
									}
								}
								cartInfo.vendors[options.params.shopId] = shopInfo1;
								cartInfo.isSelected = true;
								for (var m = 0; m < cartInfo.vendors.length; m++) {
									cartInfo.isSelected = cartInfo.isSelected && cartInfo.vendors[m].isSelected;
									if (!cartInfo.isSelected) {
										break;
									}
								}
								break;
							}
							default: {
								alert("暂不支持该操作");
								return;
							}
						}
						AsyncStorage.setItem("localShopCar", JSON.stringify({"cartInfo":cartInfo}));
						self.updateHeaderData({"result":true,"msg":cartInfo}, self.state.dataBlob, self.state.sectionIDs, self.state.rowIDs);
					}
				});
			}
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
	navViewStyle:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		height: 30
	},
	middleViewStyle:{
		flex:1
	},
	
	bottomViewStyle:{
		position: 'absolute',
		height: 30,
		width: width,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F4F4F4',
		bottom:0
	},
	dividingLine: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height:20,
		backgroundColor:'#cccccc'
	}
});

export default ShopCar;
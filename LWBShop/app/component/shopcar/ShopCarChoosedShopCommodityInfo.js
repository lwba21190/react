import React, {PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity
} from 'react-native';

import CheckBox from "../../comComponent/CheckBox";
import ShopCarChoosedCommodityItem from "./ShopCarChoosedCommodityItem";

var config = require("../../jsonData/config.json");

class ShopCarChoosedShopCommodityInfo extends Component{
	
	static propTypes = {
		id: PropTypes.number,
		info: PropTypes.object,
		callback:PropTypes.func,
	};
	
	static defaultProps = {
		id: -1,
		info: null,
		callback: null,
	};
	
	render(){
		return (
			<View>
				<View style={styles.headerViewStyle}>
					<View style={{marginLeft: 10}}>
						<CheckBox ref="headerCheckBox" defaultValue={this.props.info.isSelected} callback={(value)=>{
							var options = {
								"cmd":1,
								"params":{
									"isSelected":value,
									"shopId":this.props.id
								}
							};
							if(this.props.callback){
								this.props.callback(options);
							}
						}}/>
					</View>
					{this.renderShopInfo(this.props.info)}
				</View>
				{this.renderRow(this.props.info)}
			</View>
		);
	}
	
	renderShopInfo(info){
		var icon = (info.shopId === -1)? "jd":"store";
		return (
			<View style={[styles.headerViewStyle,{marginLeft:20}]}>
				<Image source={{uri: icon}} style={{width:16,height:16}}/>
				<Text style={{marginLeft:5,fontSize:10}}>{info.shopName}</Text>
				{this.isFreeShipping(info)}
			</View>
		);
	}
	
	isFreeShipping(info){
		if(info.shopId === -1){
			if(info.vendorPrice > 99){
				return (
					<TouchableOpacity style={styles.headerRightView}>
						<Text style={{fontSize:8}}>已免运费</Text>
						<Image source={{uri:'ts'}} style={{width:16,height:16}}/>
					</TouchableOpacity>
				);
			}else{
				let diff = 99 - info.vendorPrice;
				return (
					<TouchableOpacity style={styles.headerRightView}>
						<Text style={{fontSize:8}}>还差{diff}元免运费，</Text>
						<Text style={{color:'red',fontSize:8}}>去凑单</Text>
					</TouchableOpacity>
				);
			}
		}
	}
	
	renderRow(info){
		var view = [];
		var data = info.sorted;
		for(var i = 0; i < data.length; i++){
			view.push(<ShopCarChoosedCommodityItem key={i} shopId={this.props.id} id={i} info= {data[i]} callback={(options)=>{
				if(this.props.callback){
					this.props.callback(options);
				}
			}}/>);
		}
		return view;
	}
}

const styles = StyleSheet.create({
	container:{
		
	},
	headerViewStyle:{
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#E8E8E8',
		flex:1,
		height: 30
	},
	
	headerRightView:{
		flexDirection:'row',
		position:'absolute',
		right:10,
		height:30,
		alignItems:'center',
		justifyContent:'center'
	},
});

export default ShopCarChoosedShopCommodityInfo;
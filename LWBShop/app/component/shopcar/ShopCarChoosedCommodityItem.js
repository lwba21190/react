import React, {PropTypes, Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	TextInput,
	TouchableWithoutFeedback,
	Dimensions
} from 'react-native';
import Swipeout from 'react-native-swipeout';

import CheckBox from "../../comComponent/CheckBox";

var {width,height} = Dimensions.get('window');
var config = require("../../jsonData/config.json");

class ShopCarChoosedCommodityItem extends Component{
	
	static propTypes={
		info: PropTypes.object,
		shopId: PropTypes.number,
		id: PropTypes.number,
		callback: PropTypes.func
	};
	
	static defaultProps={
		info: null,
		shopId: -1,
		id:-1,
		callback:null
	};
	
	constructor(props){
		super(props);
		this.state = {
			count: props.info.Num,
		}
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			count: props.info.Num,
		});
	}
	
	render(){
		return (
			<View style={styles.container}>
				<Swipeout autoClose={true} backgroundColor="white" right={[{text:"删除",backgroundColor:'red',onPress:()=>this.delete()}]}>
					<View style={styles.topViewStyle}>
						<View  style={{marginLeft:10}}>
							<CheckBox ref="checkBox" defaultValue={this.props.info.isSelected} callback={(value)=>{
								var options = {
									"cmd":2,
									"params":{
										"cmd":0,
										"isSelected":value,
										"shopId":this.props.shopId,
										"commodityId":this.props.id
									}
								};
								if(this.props.callback){
									this.props.callback(options);
								}
							}}/>
						</View>
						<View style={styles.topRightViewStyle}>
							<Image source={{uri: "http://m.360buyimg.com/mobilecms/"+this.props.info.ImgUrl}} style={{width: 64,height:64}}/>
							<View style={styles.topRightDecriptionStyle}>
								<Text numberOfLines={2} style={{fontSize:12,color:'black',marginLeft:10}}>{this.props.info.Name}</Text>
								<View style={{flexDirection:'row'}}>
									{(this.props.info.propertyTags.a != undefined) &&
										(<Text numberOfLines={1} style={{fontSize:10,color:'#999999',marginLeft:10}}>
											{this.props.info.propertyTags.a}
										</Text>)}
									{(this.props.info.propertyTags.b != undefined) &&
										(<Text numberOfLines={1} style={{fontSize: 10, color: '#999999', marginLeft: 10}}>
											{this.props.info.propertyTags.b}
										</Text>)
									}
								</View>
								<View style={[styles.topRightDecriptionBottomStyle,{marginLeft:10}]}>
									<Text style={{color:'red',fontSize:10,}}>￥{this.props.info.Price}</Text>
									<View style={styles.countViewStyle}>
										<Text onPress={()=>{
											if(this.state.count > 1){
												var options = {
													"cmd":2,
													"params":{
														"cmd":1,
														"isSelected":true,
														"shopId":this.props.shopId,
														"commodityId":this.props.id
													}
												};
												this.setState({count: (this.state.count-1)});
												if(this.props.callback){
													this.props.callback(options);
												}
											}
										}}
										      style={[styles.countStyle,{borderRightWidth:1,borderRightColor:'#cccccc'}]}>-</Text>
										<TextInput
											keyboardType='numeric'
										    value={this.state.count.toString()}
										    style={styles.countTextInputStyle}
										/>
										<Text onPress={()=>{
											var options = {
												"cmd":2,
												"params":{
													"cmd":2,
													"isSelected":true,
													"shopId":this.props.shopId,
													"commodityId":this.props.id
												}
											};
											this.setState({count: (this.state.count+1)});
											if(this.props.callback){
												this.props.callback(options);
											}
										}}
										      style={[styles.countStyle,{borderLeftWidth:1,borderLeftColor:'#cccccc'}]}>+</Text>
									</View>
								</View>
							</View>
						</View>
					</View>
				</Swipeout>
			</View>
		);
	}
	
	delete(){
		var options = {
			"cmd":2,
			"params":{
				"cmd":4,
				"shopId":this.props.shopId,
				"commodityId":this.props.id
			}
		};
		if(this.props.callback){
			this.props.callback(options);
		}
	}
}

const styles = StyleSheet.create({
	container:{
		backgroundColor: 'white',
		paddingTop:5,
		paddingBottom:5,
		borderBottomWidth: 1,
		borderBottomColor:'#cccccc'
	},
	topViewStyle:{
		flexDirection:'row',
		alignItems: 'center'
	},
	topRightViewStyle:{
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 20
	},
	topRightDecriptionStyle:{
		flex: 1,
		height: 64
	},
	
	topRightDecriptionBottomStyle:{
		position:'absolute',
		width: width-120,
		height: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		bottom:0
	},
	
	countViewStyle:{
		flexDirection:'row',
		borderWidth:1,
		borderColor:'#cccccc',
		alignItems:'center',
		justifyContent:'center',
		marginRight: 10,
		height:16,
	},
	
	countStyle:{
		fontSize:12,
		height:16,
		width:16,
		padding:0,
		margin:0,
		textAlign:'center'
	},
	countTextInputStyle:{
		height:16,
		width: 32,
		padding:0,
		margin:0,
		textAlign:'center',
		fontSize:10
	}

});

export default ShopCarChoosedCommodityItem;
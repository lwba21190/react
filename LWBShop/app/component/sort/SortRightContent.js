import React, {PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	ListView,
	ScrollView,
	TouchableOpacity,
	Dimensions
} from 'react-native';

import SortCommodityType from './SortCommodityType';

var config = require("../../jsonData/config.json");

var sortListContent = [
	"sort0.json", "sort1.json", "sort2.json", "sort3.json", "sort4.json",
	"sort5.json", "sort6.json", "sort7.json", "sort8.json", "sort9.json",
	"sort10.json", "sort11.json", "sort12.json", "sort13.json", "sort14.json",
	"sort15.json", "sort16.json", "sort17.json", "sort18.json", "sort19.json",
	"sort20.json", "sort21.json", "sort22.json", "sort23.json", "sort24.json"
];

var sortListTopContent = [
	"sort0_1.json", "sort1_1.json", "sort2_1.json", "sort3_1.json", "sort4_1.json",
	"sort5_1.json", "sort6_1.json", "sort7_1.json", "sort8_1.json", "sort9_1.json",
	"sort10_1.json", "sort11_1.json", "sort12_1.json", "sort13_1.json", "sort14_1.json",
	"sort15_1.json", "sort16_1.json", "sort17_1.json", "sort18_1.json", "sort19_1.json",
	"sort20_1.json", "sort21_1.json", "sort22_1.json", "sort23_1.json", "sort24_1.json"
];

var {width,height} = Dimensions.get('window');

class SortRightContent extends Component{
	
	static propTypes = {
		index: PropTypes.number,
		popToUpperLever: PropTypes.func
	};
	
	static defaultProps = {
		index: 0,
		popToUpperLever: null
	};
	
	constructor(props){
		super(props);
		this.state = {
			index: props.index,
			content: null,
			topContent: null,
			dataSource: new ListView.DataSource({rowHasChanged: (r1,r2)=>r1 !== r2}),
			popToUpperLever: props.popToUpperLever
		};
	}
	
	componentDidMount() {
		var self = this;
		self.getJsonData(config.host + "json/sort/" + sortListContent[self.state.index],{method: 'GET'},function(err,data){
			if (err) {
				console.log("SortRightContent componentDidMount sortListContent:" + err);
				return;
			}
			self.setState({
				content: data,
				dataSource: self.state.dataSource.cloneWithRows(data.data)
			});
		});
		
		self.getJsonData(config.host + "json/sort/" + sortListTopContent[self.state.index],{method: 'GET'},function(err,data){
			if (err) {
				console.log("SortRightContent componentDidMount sortListTopContent:" + err);
				return;
			}
			self.setState({
				topContent:data
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
	
	
	componentWillReceiveProps(props) {
		var self = this;
		self.getJsonData(config.host + "json/sort/" + sortListContent[props.index],{method: 'GET'},function(err,data){
			if (err) {
				console.log("SortRightContent componentWillReceiveProps:" + err);
				return;
			}
			self.setState({
				index: props.index,
				content: data,
				dataSource: self.state.dataSource.cloneWithRows(data.data),
				popToUpperLever: props.popToUpperLever
			});
		});
		
		self.getJsonData(config.host + "json/sort/" + sortListTopContent[props.index],{method: 'GET'},function(err,data){
			if (err) {
				console.log("SortRightContent componentWillReceiveProps sortListTopContent:" + err);
				return;
			}
			self.setState({
				topContent:data,
				popToUpperLever: props.popToUpperLever
			});
		});
	}
	
	render(){
		return (
			<View style={styles.container}>
				<ScrollView>
					<TouchableOpacity style={{width: (width-90),height:100}} onPress={()=>{
						if(this.state.topContent.cmsPromotionsList && this.state.topContent.cmsPromotionsList[0].mPageAddress){
							this.state.popToUpperLever(this.state.topContent.cmsPromotionsList[0].mPageAddress);
						}
					}}>
						 <Image
							source={this.state.topContent && {uri: this.state.topContent.cmsPromotionsList[0].imageUrl}}
							style={{width: (width-90),height:100}} resizeMode='cover'
						/>
					</TouchableOpacity>
					<ListView
						dataSource={this.state.dataSource}
						renderRow={this.renderRow.bind(this)}
						enableEmptySections={true}
						initialListSize={9}
						pageSize={1}
						scrollEnabled={false}
					/>
				</ScrollView>
			</View>
		);
	}
	
	renderRow(rowData){
		return (
			<SortCommodityType info={rowData} popToUpperLever={(url)=>this.state.popToUpperLever(url)}/>
		);
	}
}

const styles=StyleSheet.create({
	container:{
		flex:1,
		padding:10
	}
});

export default SortRightContent;
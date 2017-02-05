import React, {PropTypes,Component} from 'react';
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
import HomeListViewHeader from "./HomeListViewHeader";
import RecommendItem from "../../comComponent/RecommendItem";

var config = require("../../jsonData/config.json");

var recommendItemData = [
	'home_recommend_0.json', 'home_recommend_1.json', 'home_recommend_2.json',
	'home_recommend_3.json', 'home_recommend_4.json', 'home_recommend_5.json',
	'home_recommend_6.json', 'home_recommend_7.json', 'home_recommend_8.json',
	'home_recommend_9.json', 'home_recommend_10.json', 'home_recommend_11.json',
	'home_recommend_12.json', 'home_recommend_13.json', 'home_recommend_14.json',
	'home_recommend_15.json', 'home_recommend_16.json', 'home_recommend_17.json',
	'home_recommend_18.json', 'home_recommend_19.json', 'home_recommend_20.json',
	'home_recommend_21.json'
];

var {width,height} = Dimensions.get('window');

class Home extends Component{
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
			data: null,
			dataSource: new ListView.DataSource({
				rowHasChanged:(r1,r2)=> r1 !== r2,
				sectionHeaderHasChanged:(s1,s2) => s1 != s2,
				getRowData: getRowData,
				getSectionHeaderData: getSectionHeaderData
			})
		}
	}
	
	componentDidMount() {
		var self = this;
		var dataBlob = {};
		var sectionIDs = [];
		var rowIDs = [];
		
		self.getJsonData(config.host + "json/home/home.json",{method:'GET'},function(err,data){
			if(err){
				console.log("Home componentDidMount home:" + err);
				return;
			}
			sectionIDs.push(0);
			dataBlob[0] = data;
			self.setState({
				dataBlob: dataBlob,
				sectionIDs: sectionIDs,
			});
			if(rowIDs.length > 0){
				self.setState({
					dataSource: self.state.dataSource.cloneWithRowsAndSections(dataBlob,sectionIDs,rowIDs),
				});
			}
		});
		self.getJsonData(config.host + "json/home/" + recommendItemData[self.state.index], {method: 'GET'}, function (err, data) {
			if (err) {
				console.log("Home componentDidMount recommendItemData:" + err);
				return;
			}
			var info = data.wareInfoList;
			self.updateRowData(info,dataBlob,sectionIDs,rowIDs,self.state.index);
		});
	}
	
	render(){
		return (
			<View style={styles.container}>
				{this.renderNav()}
				<View style={{flex:1}}>
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
			</View>
		);
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
		self.setState({
			index: index,
			dataBlob: updateDataBlob,
			rowIDs: rowIDs,
			data: itemData,
		});
		if(sectionIDs.length > 0) {
			self.setState({
				dataSource: self.state.dataSource.cloneWithRowsAndSections(updateDataBlob, sectionIDs, rowIDs)
			});
		}
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
		return <HomeListViewHeader info={sectionData} popToUpperLever={(url)=>this.pushToUrl(url)}/>
	}
	
	onEndReached(){
		var self = this;
		var index = self.state.index + 1;
		if(index < recommendItemData.length){
			self.getJsonData(config.host + "json/home/" + recommendItemData[index],{method:'GET'},function(err,data) {
				if (err) {
					console.log("HomeBottomList onEndReached:" + err);
					return;
				}
				let info = [...self.state.data,...data.wareInfoList];
				self.updateRowData(info,self.state.dataBlob,self.state.sectionIDs,self.state.rowIDs,index);
			});
		}
	}
	
	renderNav(){
		return (
			<View>
				<View style={styles.navView}>
					<TouchableOpacity style={{height:30,padding:10,justifyContent:'center',alignItems:'center'}}>
						<Image source={{uri: 'scan_white'}} style={{width: 16, height: 16}}/>
						<Text style={{fontSize: 8, color:'white'}}>扫啊扫</Text>
					</TouchableOpacity>
					<View style={styles.navMiddleView}>
						<TouchableOpacity style={{padding:2}}>
							<Image source={{uri: 'search_white'}} style={{width: 16, height: 16}}/>
						</TouchableOpacity>
						<TextInput placeholder='国庆爆品直降最后疯抢！' placeholderTextColor="white" underlineColorAndroid='transparent' style={{flex:1,padding:0}}/>
						<TouchableOpacity style={{padding:2}}>
							<Image source={{uri: 'speak_white'}} style={{width: 16, height: 16}}/>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={{height:30,padding:10,justifyContent:'center',alignItems:'center'}}>
						<Image source={{uri: 'xxzx_white'}} style={{width: 16, height: 16}}/>
						<Text style={{fontSize: 8,color:'white'}}>消息</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
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
		backgroundColor: 'transparent',
		position: 'absolute',
		top: 10,
		zIndex:1
	},
	navMiddleView:{
		flex:1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems:'center',
		backgroundColor : 'transparent',
		borderWidth: 1,
		borderColor: '#cccccc',
		borderRadius: 5
	}
});

export default Home;
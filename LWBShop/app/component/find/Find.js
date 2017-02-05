import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	ListView,
	ScrollView,
	Dimensions,
	TouchableOpacity
} from 'react-native';

import JumpToWebPage from "../../comComponent/JumpToWebPage";
import FindTopView from './FindTopView';
import FindBottomAd from './FindBottomAd';
import FindBottomNews from './FindBottomNews';

var config = require("../../jsonData/config.json");
var {width,height} = Dimensions.get('window');
var findAtcData = [
	"find_atc_0.json",
	"find_atc_1.json",
	"find_atc_2.json",
	"find_atc_3.json",
	"find_atc_4.json",
	"find_atc_5.json",
	"find_atc_6.json",
	"find_atc_7.json",
	"find_atc_8.json",
	"find_atc_9.json",
	"find_atc_10.json",
	"find_atc_11.json",
	"find_atc_12.json"
];

class Find extends Component{
	
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
		
		self.getJsonData(config.host + "json/find/find_top.json",{method:'GET'},function(err,data){
			if(err){
				console.log("Find componentDidMount find:" + err);
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
		self.getJsonData(config.host + "json/find/" + findAtcData[self.state.index], {method: 'GET'}, function (err, data) {
			if (err) {
				console.log("Find componentDidMount findAtcData:" + err);
				return;
			}
			var info = data.content;
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
						pageSize={1}
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
	
	renderNav(){
		return (
			<View style={styles.navStyle}>
				<Image source={{uri: 'scan_black'}} style={{width: 16,height:16,marginLeft:10}}/>
				<Text>发现</Text>
				<View style={styles.navRightView}>
					<Image source={{uri: 'wdgz'}} style={{width: 16,height:16,marginRight:20}}/>
					<Image source={{uri: 'xxzx_black'}} style={{width: 16,height:16}}/>
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
		for(var j = 0; j < itemData.length; j++){
			rowIDs[0].push(j);
			dataBlob[0+':'+j] = itemData[j];
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
		if(rowData.type === "article"){
			return (<FindBottomNews info={rowData} popToUpperLever={(url)=>this.pushToUrl(url)}/>);
		}else{
			return (<FindBottomAd info={rowData}  popToUpperLever={(url)=>this.pushToUrl(url)}/>);
		}
	}
	
	renderSectionHeader(sectionData,sectionID){
		return <FindTopView info={sectionData}  popToUpperLever={(url)=>this.pushToUrl(url)}/>
	}
	
	onEndReached(){
		var self = this;
		var index = self.state.index + 1;
		if(index < findAtcData.length){
			self.getJsonData(config.host + "json/find/" + findAtcData[index],{method:'GET'},function(err,data) {
				if (err) {
					console.log("Find onEndReached:" + err);
					return;
				}
				let info = [...self.state.data,...data.content];
				self.updateRowData(info,self.state.dataBlob,self.state.sectionIDs,self.state.rowIDs,index);
			});
		}
	}
	
	pushToUrl(url){
		this.props.navigator.push({
			component: JumpToWebPage,
			passProps: {url: url}
		});
	}
}

const styles=StyleSheet.create({
	container: {
		flex:1
	},
	
	navStyle:{
		width: width,
		height: 30,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white'
	},
	
	navRightView:{
		marginRight: 10,
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center'
	}
});

export default Find;
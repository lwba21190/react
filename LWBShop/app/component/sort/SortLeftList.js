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
	TouchableWithoutFeedback,
	Dimensions
} from 'react-native';

//var sortList = require("../../jsonData/sort/sortList.json");
var config = require("../../jsonData/config.json");

var {width,height} = Dimensions.get('window');

class SortLeftList extends Component{
	
	static propTypes={
		callBackFunc: PropTypes.func
	};
	
	static defaultProps={
		callBackFunc: {}
	};
	
	constructor(props){
		super(props);
		this.state={
			index: 0,
			data: null,
			dataSource: new ListView.DataSource({rowHasChanged: (r1,r2)=>r1!==r2}),
		}
	}
	
	componentDidMount() {
		var self = this;
		self.getJsonData(config.host + "json/sort/sortList.json",{method: 'GET'},function(err,data){
			if (err) {
				console.log("SortLeftList componentDidMount:" + err);
				return;
			}
			self.setState({
				data: data,
				dataSource: self.state.dataSource.cloneWithRows(data.data)
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
	
	render(){
		return (
			<View style={styles.container}>
				<ListView
					style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)}
					pageSize={50}
				/>
			</View>
		);
	}
	
	renderRow(rowData,sectionID, rowID){
		var itemStyle = {};
		var textStyle = {};
		if(parseInt(rowID) == this.state.index){
			itemStyle = {backgroundColor: 'transparent',borderRightWidth: 0};
			textStyle = {color: 'red'}
		}else{
			itemStyle = {backgroundColor: 'white',borderRightWidth: 1};
			textStyle = {color: 'gray'}
		}
		return (
			<TouchableWithoutFeedback onPress={()=>this.itemClick(rowID)}>
				<View  style={[styles.listItem,itemStyle]}>
					<Text style={[styles.text,textStyle]}>
						{rowData.title}
					</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	}
	
	itemClick(id){
		this.state.data.data[this.state.index].isSelected = false;
		var index = parseInt(id);
		this.state.data.data[index].isSelected = true;
		let data = JSON.parse(JSON.stringify(this.state.data));
		this.setState({
			index: index,
			data: data,
			dataSource: this.state.dataSource.cloneWithRows(data.data),
		});
		this.props.callBackFunc(index);
	}
}

const styles=StyleSheet.create({
	container:{
		width: 70
	},
	list:{
		flex:1,
	},
	listItem:{
		padding:10,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#f5f5f5',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'white'
	},
	
	text:{
		fontSize: 10,
	}
});

export default SortLeftList;
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

var {width,height} = Dimensions.get('window');
var cols = 5;
var itemW = width/cols;
var itemH = 60;

class HomeTopList extends Component{
	
	static propTypes = {
		info: PropTypes.object,
		width: PropTypes.number,
		height: PropTypes.number,
		popToUpperLever: PropTypes.func
	};
	
	static defaultProps = {
		info: {},
		width: width,
		height: 120,
		popToUpperLever: null
	};
	
	constructor(props){
		super(props);
		this.state={
			width: props.width,
			height: props.height,
			data: props.info.content.data,
			dataSource: new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2}),
			popToUpperLever: props.popToUpperLever
		}
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			width: props.width,
			height: props.height,
			data: props.info.content.data,
			dataSource: this.state.dataSource.cloneWithRows(props.info.content.data),
			popToUpperLever: props.popToUpperLever
		});
	}
	
	
	componentDidMount() {
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(this.state.data)
		});
	}
	
	render(){
		return (
			<View style={styles.container}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)}
					contentContainerStyle={[styles.listView,{width:this.state.width,height:this.state.height}]}
					scrollEnabled={false}
				/>
			</View>
		);
	}
	
	renderRow(rowData){
		return (
			<TouchableOpacity style={styles.item} onPress={()=>{
				if(rowData.jump.params.url){
					this.state.popToUpperLever(rowData.jump.params.url)
				}else if(rowData.jump.params.activityId){
					this.state.popToUpperLever("http://h5.m.jd.com/active/" + rowData.jump.params.activityId + "/index.html");
				}
			}}>
				<Image source={{uri: rowData.icon}} style={{width:40,height:40}}/>
				<Text style={{fontSize: 8}}>{rowData.name}</Text>
			</TouchableOpacity>
		);
	}
}

const styles=StyleSheet.create({
	container:{

	},
	listView:{
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	item:{
		justifyContent: 'center',
		alignItems: 'center',
		height: itemH,
		width: itemW,
	}
});

export default HomeTopList;
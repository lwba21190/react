import React, { PropTypes, Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	ListView,
	Dimensions
} from 'react-native';

var {width,height} = Dimensions.get('window');

class SortCommodityType extends Component{
	
	static propTypes = {
		info: PropTypes.object,
		popToUpperLever: PropTypes.func
	};
	
	static defaultProps = {
		info: null,
		popToUpperLever: null
	};
	
	constructor(props){
		super(props);
		var ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>r1!==r2});
		this.state = {
			info: this.props.info,
			dataSource: ds.cloneWithRows(this.props.info.catelogyList),
			popToUpperLever: props.popToUpperLever
		}
	}
	
	componentWillReceiveProps(props){
		if(props.info !== {}){
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(props.info.catelogyList),
				popToUpperLever: props.popToUpperLever
			});
		}
	}
	
	render(){
		return (
			<View style={styles.container}>
				<View style={styles.topView}>
					<Text style={{fontSize:10,color:'black'}}>{this.props.info.name}</Text>
				</View>
				<View style={styles.bottomView}>
					<ListView
						dataSource={this.state.dataSource}
						renderRow={this.renderRow.bind(this)}
						contentContainerStyle={styles.listView}
						scrollEnabled={false}
						pageSize={3}
						initialListSize={9}
					/>
				</View>
			</View>
		);
	}
	
	renderRow(rowData){
		return (
			<TouchableOpacity style={{justifyContent:'center',alignItems:'center',width:(width-90)/3,height:80,padding:10}} onPress={()=>{
				if(rowData.action){
					this.state.popToUpperLever(rowData.action);
				}
			}}>
				<Image source={{uri: rowData.icon}} style={{width: 64, height: 64}} resizeMode='contain'/>
				<Text style={{fontSize: 8}}>{rowData.name}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		overflow:'hidden'
	},
	topView:{
		height: 20,
		justifyContent:'center'
	},
	bottomView:{
		backgroundColor: 'white'
	},
	listView:{
		flexWrap: 'wrap',
		flexDirection: 'row',
		width: width-90,
	}
});

export default SortCommodityType;

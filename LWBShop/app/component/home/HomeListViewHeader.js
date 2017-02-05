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

import HomeHorizontalScrollView from "./HomeHorizontalScrollView";
import HomeTopList from "./HomeTopList";
import HomeNews from "./HomeNews";
import HomeMiddleTopView from "./HomeMiddleTopView";
import HomeMiddleMidView from "./HomeMiddleMidView";
import HomeMiddleBottomItemView from "./HomeMiddleBottomItemView";

var config = require("../../jsonData/config.json");

var {width,height} = Dimensions.get('window');

class HomeListViewHeader extends Component{
	
	static propTypes = {
		info: PropTypes.object,
		popToUpperLever: PropTypes.func
	};
	
	static defaultProps = {
		info: null,
		popToUpperLever:null
	};
	
	constructor(props){
		super(props);
		this.state = {
			homeInfo: props.info,
			popToUpperLever: props.popToUpperLever
		}
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			homeInfo:props.info,
			popToUpperLever: props.popToUpperLever
		});
	}
	
	render(){
		return (
			<View style={styles.container}>
				{this.renderItems(this.state.homeInfo)}
			</View>
		);
	}
	
	renderItems(homeInfo){
		if(homeInfo){
			return (
				<View>
					<HomeHorizontalScrollView info={homeInfo.floorList[0]} width={width} height={150} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}} />
					<HomeTopList info={homeInfo.floorList[1]} width={width} height={120} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}}/>
					<HomeNews info={homeInfo.floorList[2]} width={width} height={40} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}}/>
					<HomeMiddleTopView info={homeInfo.floorList[3]} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}}/>
					<HomeMiddleMidView info={homeInfo.floorList[5]} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}}/>
					<HomeMiddleMidView info={homeInfo.floorList[6]} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}}/>
					<HomeMiddleBottomItemView info={homeInfo.floorList[7]} adInfo={homeInfo.floorList[8]} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}}/>
					<HomeMiddleBottomItemView info={homeInfo.floorList[9]} adInfo={homeInfo.floorList[10]} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}}/>
					<HomeMiddleBottomItemView info={homeInfo.floorList[11]} adInfo={homeInfo.floorList[12]} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}}/>
					<HomeMiddleBottomItemView info={homeInfo.floorList[13]} adInfo={homeInfo.floorList[14]} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}}/>
					<HomeMiddleBottomItemView info={homeInfo.floorList[15]} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}}/>
					<HomeMiddleBottomItemView info={homeInfo.floorList[16]} popToUpperLever={(url)=>{this.state.popToUpperLever(url)}}/>
					<View style={styles.dividingLine}>
						<Image source={{uri: 'wntj'}} style={{width:10,height:10}}/>
						<Text style={{fontSize: 10,marginLeft: 5}}>为你推荐</Text>
					</View>
				</View>
			);
		}
	}
}

const styles=StyleSheet.create({
	container:{
		flex:1
	},
	dividingLine: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height:20
	}
});

export default HomeListViewHeader;
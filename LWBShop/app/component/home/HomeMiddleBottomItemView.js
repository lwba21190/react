import React, {PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	Dimensions
} from 'react-native';

import HomeMiddleCell from "./HomeMiddleCell";
import HomeMiddleCell1 from "./HomeMiddleCell1";
import HomeAd from "./HomeAd";

var {width,height} = Dimensions.get('window');

class HomeMiddleBottomItemView extends Component{
	
	static propTypes = {
		info: PropTypes.object,
		adInfo: PropTypes.object,
		popToUpperLever: PropTypes.func
	};
	
	static  defaultProps = {
		info: null,
		adInfo: null,
		popToUpperLever: null
	};
	
	constructor(props){
		super(props);
		this.state = {
			info: props.info,
			adInfo: props.adInfo,
			popToUpperLever: props.popToUpperLever
		};
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			info: props.info,
			adInfo: props.adInfo,
			popToUpperLever: props.popToUpperLever
		});
	}
	
	render(){
		return (
			<View style={styles.container}>
				<View style={styles.topView}>
					<Image source={{uri: this.state.info.logoImage}} style={{width:92,height:33}}/>
				</View>
				<View>
					{this.renderLines(this.state.info.content.subFloors)}
				</View>
				{this.renderAd(this.state.adInfo)}
			</View>
		);
	}

	renderLines(info){
		var view = [];
		for(var i = 0; i < info.length; i++){
			view.push(
				<View key={i}>
					{this.renderLine(info[i].data)}
				</View>
			);
		}
		return view;
	}
	
	renderLine(info){
		var view = [];
		switch(info.length){
			case 1:{
				return (
					<View style={styles.lineStyle}>
						<HomeMiddleCell info={info[0]} width={width} popToUpperLever={(url)=>this.state.popToUpperLever(url)}/>
					</View>
				);
			}
			case 2:{
				return (
					<View style={styles.lineStyle}>
						<HomeMiddleCell info={info[0]} width={Math.floor(width/2)} popToUpperLever={(url)=>this.state.popToUpperLever(url)}/>
						<HomeMiddleCell info={info[1]} width={Math.floor(width/2)} popToUpperLever={(url)=>this.state.popToUpperLever(url)}/>
					</View>
				);
			}
			case 3:{
				return (
					<View style={styles.lineStyle}>
						<HomeMiddleCell info={info[0]} width={Math.floor(width/2)} popToUpperLever={(url)=>this.state.popToUpperLever(url)}/>
						<HomeMiddleCell1 info={info[1]} popToUpperLever={(url)=>this.state.popToUpperLever(url)}/>
						<HomeMiddleCell1 info={info[2]} popToUpperLever={(url)=>this.state.popToUpperLever(url)}/>
					</View>
				);
			}
			default:{
				return (
					<View style={styles.lineStyle}>
						{this.renderMultiItem(info)}
					</View>
				);
			}
		}
	}
	
	renderMultiItem(info){
		var view = [];
		for(var i = 0; i < info.length; i++){
			view.push(
				<HomeMiddleCell1 key={i} info={info[i]} popToUpperLever={(url)=>this.state.popToUpperLever(url)}/>
			);
		}
		return view;
	}
	
	renderAd(info){
		if(info){
			return (
				<View style={{marginTop: 5}}>
					<HomeAd info={info} width={width} height={100}/>
				</View>
			);
		}
	}
}

const styles=StyleSheet.create({
	container:{
		backgroundColor: 'white',
	},
	topView:{
		backgroundColor:'#cccccc',
		width:width,
		height: 35,
		justifyContent:'center',
		alignItems:'center'
	},
	lineStyle:{
		flexDirection:'row',
		width:width,
		height: 100,
	}
});

export default HomeMiddleBottomItemView;
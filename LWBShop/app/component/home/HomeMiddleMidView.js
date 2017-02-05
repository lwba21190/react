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

var {width,height} = Dimensions.get('window');

class HomeMiddleMidView extends Component{
	
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
		this.state = {
			info: props.info,
			popToUpperLever: props.popToUpperLever
		};
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			info: props.info,
			popToUpperLever: props.popToUpperLever
		});
	}
	
	render(){
		return (
			<View style={styles.container}>
				{this.renderView()}
			</View>
		);
	}
	
	renderView(){
		var view = [];
		var data = this.state.info.content.subFloors;
		for(var i = 0; i < data.length; i++){
			var info = data[i];
			view.push(
				<View key={i} style={styles.lineStyle}>
					{this.renderLine(info)}
				</View>
			);
		}
		return view;
	}
	
	renderLine(info){
		var view = [];
		for(var i = 0; i < info.data.length; i++){
			let data = info.data[i];
			view.push(
				<HomeMiddleCell key={i} info={data} width={Math.floor(width/2)} height={100} popToUpperLever={(url)=>this.state.popToUpperLever(url)}/>
			);
		}
		return view;
	}

}

const styles=StyleSheet.create({
	container:{
		flex:1,
		backgroundColor: 'white',
	},
	lineStyle:{
		flexDirection:'row'
	}
});

export default HomeMiddleMidView;
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

var {width,height} = Dimensions.get('window');

class HomeMiddleCell1 extends Component{
	
	static  propTypes = {
		info: PropTypes.object,
		width: PropTypes.number,
		height: PropTypes.number,
		popToUpperLever: PropTypes.func
	};
	
	static defaultProps = {
		info: null,
		width: 0,
		height: 100,
		popToUpperLever: null,
	};
	
	constructor(props){
		super(props);
		this.state = {
			info: props.info,
			width: props.width,
			height: props.height,
			popToUpperLever: props.popToUpperLever
		};
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			info: props.info,
			width: props.width,
			height: props.height,
			popToUpperLever: props.popToUpperLever
		});
	}
	
	render(){
		return (
			<TouchableOpacity style={[styles.container,{height: this.state.height}]} onPress={()=>{
				if(this.state.info.jump && this.state.info.jump.params.url){
					this.state.popToUpperLever(this.state.info.jump.params.url)
				}else if(this.state.info.jump && this.state.info.jump.params.activityId){
					this.state.popToUpperLever("http://h5.m.jd.com/active/" + this.state.info.jump.params.activityId + "/index.html");
				}
			}}>
				<Text style={{fontSize:12,color: this.state.info.maintitleColor}}>{this.state.info.showName.name}</Text>
				<Text style={{fontSize:10,color: this.state.info.subtitleColor}}>{this.state.info.subtitle}</Text>
				<View style={{justifyContent:'center',alignItems:'center'}}>
					<Image source={{uri: this.state.info.img}} style={{width:57,height:50}}/>
				</View>
				{this.renderLabel(this.state.info)}
			</TouchableOpacity>
		);
	}
	
	renderLabel(info){
		if(info.labelWords !== ""){
			return (
				<View style={{position:'absolute',bottom:0,left:0,backgroundColor: info.labelColor}}>
					<Text style={{fontSize:8,color:'white'}}>{info.labelWords}</Text>
				</View>
			);
		}
	}
}

const styles=StyleSheet.create({
	container: {
		flex:1,
		borderTopWidth: 1,
		borderRightWidth: 1,
		borderTopColor: '#f5f5f5',
		borderRightColor: '#f5f5f5',
		padding:10,
	},
	leftView:{
		flex:1,
		height:80
	},
	rightView:{
		flex:1,
		height:80,
		justifyContent:'center',
		alignItems: 'center'
	}
});

export default HomeMiddleCell1;
import React, {PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity
} from 'react-native';

class FindMiddleTopItem extends Component{
	static propTypes={
		info: PropTypes.object,
		width: PropTypes.number,
		height: PropTypes.number,
		popToUpperLever: PropTypes.func
	};
	
	static defaultProps={
		info: null,
		width: 160,
		height: 150,
		popToUpperLever: null
	};
	
	constructor(props){
		super(props);
		this.state = {
			info: props.info,
			width: props.width,
			height: props.height,
			popToUpperLever: props.popToUpperLever
		}
	}
	
	componentWillReceiveProps(props) {
		this.state = {
			info: props.info,
			width: props.width,
			height: props.height,
			popToUpperLever: props.popToUpperLever
		}
	}
	
	render(){
		return (
			<TouchableOpacity style={[styles.container,{width:this.state.width,height:this.state.height}]} onPress={()=>{
				if(this.state.info.jump.params.url){
					this.state.popToUpperLever(this.state.info.jump.params.url)
				}else if(this.state.info.jump.params.activityId){
					this.state.popToUpperLever("http://h5.m.jd.com/active/" + this.state.info.jump.params.activityId + "/index.html");
				}
			}}>
				<Image source={{uri: this.state.info.imgUrl}} style={{width: 150,height:112}}/>
				<Text style={{fontSize:10,color:'black'}}>{this.state.info.name}</Text>
				<Text style={{fontSize:8}}>{this.state.info.slogan}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		justifyContent:'center',
		alignItems: 'center'
	}
});

export default FindMiddleTopItem;
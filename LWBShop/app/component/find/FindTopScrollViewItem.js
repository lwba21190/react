import React, {PropTypes, Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native';

class FindTopScrollViewItem extends Component{
	static propTypes = {
		info: PropTypes.object,
		width: PropTypes.number,
		height: PropTypes.number
	};
	
	static defaultProps = {
		info: {},
		width: 60,
		height: 60
	};
	
	render(){
		return (
			<TouchableOpacity style={{width: this.props.width, height:this.props.height,justifyContent:'center',alignItems:'center',padding:10}}>
				<Image source={{uri: this.props.info.icon}} style={{width: 33,height:34}}/>
				<Text style={{fontSize:10}}>{this.props.info.title}</Text>
				{this.renderCorner(this.props.info)}
			</TouchableOpacity>
		);
	}
	
	renderCorner(info){
		if(this.props.info.corner != ""){
			return (
				<View style={styles.cornerView}>
					<Text style={{color:'white',fontSize:6}}>{info.corner}</Text>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	cornerView:{
		position: 'absolute',
		top:0,
		right:0,
		width: 20,
		height: 10,
		backgroundColor:'red',
		borderRadius: 5,
		justifyContent:'center',
		alignItems:'center'
	}
});

export default FindTopScrollViewItem;
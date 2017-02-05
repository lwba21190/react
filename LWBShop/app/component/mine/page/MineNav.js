import React,{PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity
} from 'react-native';

var {width,height} = Dimensions.get('window');

class MineNav extends Component{
	
	static propTypes = {
		title: PropTypes.string,
		navigator:PropTypes.object
	};
	
	static defaultProps = {
		title: '',
		navigator: null
	};
	
	render(){
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={()=>this.props.navigator.pop()} style={{marginLeft:10}}>
					<Image source={{uri: 'back'}} style={{width:16,height:16}}/>
				</TouchableOpacity>
				<Text>{this.props.title}</Text>
				<View></View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		flexDirection: 'row',
		alignItems: 'center',
		width: width,
		height:30,
		justifyContent: 'space-between',
		backgroundColor:'white'
	}
});

export default MineNav;
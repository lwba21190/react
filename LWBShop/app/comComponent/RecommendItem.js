import React, { PropTypes,Component} from 'react';
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
import ShopCarIcon from "./ShopCarIcon";

class RecommendItem extends Component{
	
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
		this.state={
			info: props.info,
			popToUpperLever: props.popToUpperLever
		}
	}
	
	componentWillReceiveProps(props) {
		this.state={
			info: props.info,
			popToUpperLever: props.popToUpperLever
		}
	}
	
	render(){
		return (
			<TouchableOpacity style={styles.container} onPress={()=>{
				if(this.state.info.clickUrl){
					this.state.popToUpperLever(this.state.info.clickUrl);
				}
			}}>
				<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
					<Image source={{uri: this.state.info.imageurl}} resizeMode='contain' style={{width: width/2,height: 128}}/>
				</View>
				<Text style={{fontSize:10}}  numberOfLines={2}>{this.state.info.wname}</Text>
				<View style={styles.bottomViewStyle}>
					<Text style={{color:'red'}}>￥{this.state.info.jdPrice}</Text>
					<ShopCarIcon info={this.state.info} style={{marginRight:5}}/>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor: 'white'
	},
	bottomViewStyle:{
		flexDirection:'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default RecommendItem;

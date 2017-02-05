import React, {PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	TextInput,
	ScrollView,
	TouchableOpacity,
	Dimensions
} from 'react-native';

var {width,height} = Dimensions.get('window');

class HomeMiddleTopScrollViewItem extends Component{
	
	static propTypes = {
		info: PropTypes.object
	};
	
	static defaultProps = {
		info: null
	};
	
	constructor(props){
		super(props);
		this.state = {
			info:props.info
		}
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			info:props.info
		});
	}
	
	render(){
		return (
			<View style={styles.container}>
				<View style={styles.topView}>
					<Image source={{uri: this.state.info.imageurl}} style={{width:76,height:76}}>
						{this.renderTagText()}
					</Image>
				</View>
				<Text style={{fontSize: 12,color: 'red'}}>￥{this.state.info.miaoShaPrice}</Text>
				<Text style={{fontSize: 10, textDecorationLine:"line-through"}}>￥{this.state.info.jdPrice}</Text>
			</View>
		);
	}
	
	renderTagText(){
		if(this.state.info.tagText != null){
			return (
				<View style={[styles.tag,{backgroundColor: this.state.info.colorRGB}]}>
					<Text style={{color:'white',fontSize:8}}>{this.state.info.tagText}</Text>
				</View>
			);
		}
	}
}

const styles=StyleSheet.create({
	container:{
		justifyContent:'center',
		alignItems: 'center',
		padding: 10
	},
	tag:{
		position: 'absolute',
		bottom: 0,
		left: 0
	}
});

export default HomeMiddleTopScrollViewItem;
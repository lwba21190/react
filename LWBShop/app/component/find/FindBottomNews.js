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
	
class FindBottomNews extends Component{
	
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
			content: props.info,
			popToUpperLever: props.popToUpperLever
		}
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			content: props.info,
			popToUpperLever: props.popToUpperLever
		});
	}
	
	render(){
		return (
			<TouchableOpacity style={styles.container}>
				<View style={styles.leftView}>
					<View style={{flex:1,justifyContent:'center'}}>
						<Text style={{color:'black'}} numberOfLines={2}>{this.state.content.title}</Text>
					</View>
					<View  style={{flex:1,justifyContent:'center'}}>
						<Text style={{fontSize:8}} numberOfLines={2}>{this.state.content.summary}</Text>
					</View>
					<View style={{height:12,flexDirection:'row',alignItems:'center'}}>
						{(this.state.content.authorPic != "") && <Image source={{uri: this.state.content.authorPic}} style={styles.iconStyle}/>}
						<Text style={{fontSize:8,marginLeft:3}}>{this.state.content.authorName}</Text>
					</View>
				</View>
				<View style={styles.rightView}>
					<View style={{flex:1}}>
						<Image source={{uri: this.state.content.indexImage}} style={{width:90,height:60}} resizeMode='cover'/>
					</View>
					<View style={{height:12,flexDirection:'row',justifyContent:'space-between'}}>
						<View  style={{flexDirection:'row',alignItems:'center',marginRight:10}}>
							<Image source={{uri:'time'}} style={styles.iconStyle}/>
							<Text style={{fontSize:8,marginLeft:3}}>{this.state.content.showTime}</Text>
						</View>
						<View style={{flexDirection:'row',alignItems:'center'}}>
							<Image source={{uri: 'eye'}} style={styles.iconStyle}/>
							<Text style={{fontSize:8,marginLeft:3}}>{this.state.content.pageView}</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}

const styles=StyleSheet.create({
	container: {
		width:width,
		flexDirection: 'row',
		alignItems: 'center',
		padding:10,
		borderBottomWidth:1,
		borderBottomColor:'#cccccc',
		height:100,
		backgroundColor:'white'
	},
	
	leftView:{
		flex:1,
		justifyContent:'space-between',
	},
	
	rightView:{
		width: 100,
		paddingLeft: 10,
		justifyContent:'space-between',
	},
	
	iconStyle:{
		width: 8,
		height: 8
	}
});

export default FindBottomNews;
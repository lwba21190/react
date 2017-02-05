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

var {width,height} = Dimensions.get('window');

class FindBottomAd extends Component{
	
	static propTypes = {
		info: PropTypes.object
	};
	
	static defaultProps = {
		info: {}
	};
	
	constructor(props){
		super(props);
		this.state={
			content: props.info
		}
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			content: props.info
		});
	}
	
	render(){
		return (
			<TouchableOpacity style={styles.container}>
				<View style={styles.topView}>
					<Text style={{color:'black'}} numberOfLines={1}>{this.state.content.mainTitle}</Text>
					<Text style={{fontSize:8}}  numberOfLines={1}>{this.state.content.desc}</Text>
				</View>
				<View style={styles.middleView}>
					<Image source={{uri: this.state.content.summaryList[0]}} resizeMode='contain' style={styles.imageStyle}/>
					<Image source={{uri: this.state.content.summaryList[1]}} resizeMode='contain' style={styles.imageStyle}/>
					<Image source={{uri: this.state.content.summaryList[2]}} resizeMode='contain' style={styles.imageStyle}/>
				</View>
				<View  style={styles.bottomView}>
					<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
						<Image source={{uri: this.state.content.authorPic}}  style={styles.iconStyle}/>
						<Text style={{fontSize:8}}>{this.state.content.authorName}</Text>
					</View>
					<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
						<Image source={{uri: 'eye'}} style={styles.iconStyle}/>
						<Text style={{fontSize:8}}>{this.state.content.pageView}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}

const styles=StyleSheet.create({
	container: {
		width:width,
		padding:10,
		justifyContent: 'center',
		borderBottomWidth:1,
		borderBottomColor:"#cccccc",
		height: 180,
		backgroundColor:'white'
	},
	
	middleView:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		padding: 10
	},
	bottomView:{
		flexDirection: 'row',
		justifyContent:'space-between',
		alignItems:'center'
	},
	
	iconStyle:{
		width: 8,
		height: 8
	},
	imageStyle:{
		width:100,
		height:100
	}
});

export default FindBottomAd;
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

import HomeMiddleTopScrollViewItem from "./HomeMiddleTopScrollViewItem";

var {width,height} = Dimensions.get('window');

var remainSeconds = 0;

class HomeMiddleTopView extends Component{
	
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
		var date = new Date();
		var currentH = date.getHours();
		var currentM = date.getMinutes();
		var currentS = date.getSeconds();
		remainSeconds = 7200 - ((currentH%2)*3600 + currentM*60 + currentS);
		remainSeconds = (remainSeconds > 1)?(remainSeconds - 1):7200;
		var {remainStrH,remainStrM,remainStrS} = this.getTime(remainSeconds);
		this.state={
			timeH: remainStrH,
			timeM: remainStrM,
			timeS: remainStrS,
			info: props.info,
			popToUpperLever: props.popToUpperLever
		}
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			info: props.info,
			popToUpperLever: props.popToUpperLever
		});
	}
	
	componentDidMount() {
		this.interval = setInterval(()=>{
			remainSeconds = (remainSeconds > 1)?(remainSeconds - 1):7200;
			var {remainStrH,remainStrM,remainStrS} = this.getTime(remainSeconds);
			this.setState({
				timeH: remainStrH,
				timeM: remainStrM,
				timeS: remainStrS
			});
		},1000);
	}
	
	componentWillUnMount() {
		this.interval && clearInterval(this.interval);
	}
	
	getTime(seconds){
		var remainH = Math.floor(remainSeconds / 3600);
		var remainM = Math.floor((remainSeconds - remainH*3600) / 60);
		var remainS = remainSeconds - remainH*3600 - remainM*60;
		var remainStrH = (remainH < 10)?("0" + remainH):("" + remainH);
		var remainStrM = (remainM < 10)?("0" + remainM):("" + remainM);
		var remainStrS = (remainS < 10)?("0" + remainS):("" + remainS);
		return {remainStrH,remainStrM,remainStrS};
	}
	
	render(){
		var data = this.state.info.content.subFloors[0].data[0];
		return (
			<TouchableOpacity style={styles.container} onPress={()=>{
				if(data.rcJumpUrl) {
					this.state.popToUpperLever(data.rcJumpUrl);
				}
			}}>
				<View style={styles.topView}>
					<View style={styles.topLeftView}>
						<Image source={{uri: data.showNameImg}} style={{width:67,height:27}}/>
						<Text style={{fontSize:12,color:'black',marginLeft:10}}>{data.content.name}</Text>
						<View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginLeft:5}}>
							<Text style={styles.timeDisplay}>{this.state.timeH}</Text>
							<Text style={{fontSize:10,color:'black',padding:1}}>:</Text>
							<Text  style={styles.timeDisplay}>{this.state.timeM}</Text>
							<Text style={{fontSize:10,color:'black',padding:1}}>:</Text>
							<Text  style={styles.timeDisplay}>{this.state.timeS}</Text>
						</View>
					</View>
					<TouchableOpacity style={styles.topRightView} onPress={()=>{
						if(data.jump.params.url){
							this.state.popToUpperLever(data.jump.params.url)
						}else if(data.jump.params.activityId){
							this.state.popToUpperLever("http://h5.m.jd.com/active/" + data.jump.params.activityId + "/index.html");
						}
					}}>
						<Text style={{fontSize:8,color: data.labelColor,marginRight:2}}>{data.rightCorner}</Text>
						<Image source={{uri: 'right_corner'}} style={{width:16,height:16}}/>
					</TouchableOpacity>
				</View>
				<View>
					<ScrollView
						horizontal={true}
					    showsHorizontalScrollIndicator={false}
					>
						{this.renderScrollViewItem()}
					</ScrollView>
				</View>
			</TouchableOpacity>
		);
	}
	
	renderScrollViewItem(){
		var view = [];
		var data = this.state.info.content.subFloors[0].data[0].content.indexMiaoSha;
		for(var i = 0; i < data.length; i++){
			var info = data[i];
			view.push(
				<HomeMiddleTopScrollViewItem key={i} info={info}/>
			);
		}
		return  view;
	}
}

const styles=StyleSheet.create({
	container:{
		backgroundColor: 'white',
	},
	topView:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center'
	},
	topLeftView:{
		marginLeft:5,
		flexDirection: 'row',
		alignItems:'center'
	},
	topRightView:{
		marginRight: 10,
		flexDirection:'row',
		alignItems:'center'
	},
	timeDisplay:{
		borderWidth:1,
		borderColor:'#cccccc',
		fontSize:10,
		padding:1,
		color: 'black',
		margin:0,
		textAlign:'center'
	}
});

export default HomeMiddleTopView;
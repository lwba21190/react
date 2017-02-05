import React, {PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	TextInput,
	ListView,
	ScrollView,
	TouchableOpacity,
	Dimensions
} from 'react-native';

var {width,height} = Dimensions.get('window');
var itemH = 20;

class HomeNews extends Component{
	
	static propTypes = {
		info: PropTypes.object,
		width: PropTypes.number,
		height: PropTypes.number,
		popToUpperLever: PropTypes.func
	};
	
	static defaultProps = {
		info: {},
		width: width,
		height: 40,
		popToUpperLever: null
	};
	
	constructor(props){
		super(props);
		this.state={
			activePage:0,
			info: props.info,
			width: props.width,
			height: props.height,
			popToUpperLever: props.popToUpperLever
		}
	}
	
	componentWillReceiveProps(props) {
		this.state={
			activePage:0,
			info: props.info,
			width: props.width,
			height: props.height,
			popToUpperLever: props.popToUpperLever
		}
	}
	
	componentDidMount() {
		this.startInterval();
	}
	
	startInterval(){
		var currentPage = 0;
		var scrollView = this.refs.scrollView;
		this.interval = setInterval(()=>{
			if(this.state.activePage >= this.state.info.content.announcement.length){
				currentPage = 0
			}else{
				currentPage = this.state.activePage+1;
			}
			this.setState({
				activePage: currentPage
			});
			
			var offsetY = currentPage*itemH;
			scrollView.scrollResponderScrollTo({x:0,y:offsetY,animated:true});
		},2000);
	}
	
	componentWillUnMount() {
		this.interval && clearInterval(this.interval);
	}
	
	render(){
		return (
			<View style={[styles.container,{width:this.state.width,height:this.state.height}]}>
				<View style={styles.content}>
					<TouchableOpacity style={styles.leftView} onPress={()=>{
						if(this.state.info.moreJump.params.url){
							this.state.popToUpperLever(this.state.info.moreJump.params.url)
						}else if(this.state.info.moreJump.params.activityId){
							this.state.popToUpperLever("http://h5.m.jd.com/active/" + this.state.info.moreJump.params.activityId + "/index.html");
						}
					}}>
						<Image source={{uri: this.state.info.content.img}} style={{width: 82, height:20}}/>
					</TouchableOpacity>
					<View  style={styles.middleView}>
						<ScrollView
							ref="scrollView"
							pagingEnabled={true}
						    showsVerticalScrollIndicator={false}
						>
							{this.renderScrollViewItems()}
						</ScrollView>
					</View>
					<TouchableOpacity  style={styles.rightView} onPress={()=>{
						this.state.popToUpperLever(this.state.info.moreJump);
					}}>
						<Text style={{fontSize: 10,padding: 2}}>更多</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
	
	renderScrollViewItems(){
		var view = [];
		var data = this.state.info.content.announcement;
		for(var i = 0; i < data.length;i++){
			var info = data[i];
			view.push(
				<TouchableOpacity key={i} style={styles.item} onPress={()=>{
					if(info.jump.params.url){
						this.state.popToUpperLever(info.jump.params.url)
					}else if(info.jump.params.activityId){
						this.state.popToUpperLever("http://h5.m.jd.com/active/" + info.jump.params.activityId + "/index.html");
					}
				}}>
					<Text style={{fontSize: 10, color:'red'}}>{info.slogan}</Text>
					<Text style={{fontSize: 10,marginLeft:10}}>{info.content}</Text>
				</TouchableOpacity>
			);
		}
		return view;
	}
	
	renderRow(rowData){
		return (
			<TouchableOpacity style={styles.item}>
				<Image source={{uri: rowData.icon}} style={{width:40,height:40}}/>
				<Text style={{fontSize: 8}}>{rowData.title}</Text>
			</TouchableOpacity>
		);
	}
}

const styles=StyleSheet.create({
	container:{
		padding: 10,
		justifyContent:'center',
		alignItems:'center'
	},
	content:{
		padding: 5,
		backgroundColor:'white',
		borderWidth:1,
		borderColor: '#cccccc',
		borderRadius: 5,
		flexDirection: 'row',
		alignItems: 'center',
	},
	leftView:{
		width: 85,
		height:20,
		justifyContent:'center',
		alignItems: 'center'
	},
	middleView:{
		flex:1,
		height:20,
		marginLeft:10
	},
	rightView:{
		width:30,
		height: 20,
		alignItems:'center',
		justifyContent: 'center',
		borderLeftWidth:1,
		borderColor:'#cccccc',
	},
	item:{
		flex:1,
		flexDirection:'row',
		alignItems:'center',
		height:itemH
	}
});

export default HomeNews;
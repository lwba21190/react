import React, {PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	Dimensions
} from 'react-native';

var {width,height} = Dimensions.get('window');

class HomeHorizontalScrollView extends Component{
	static propTypes = {
		info: PropTypes.object,
		popToUpperLever: PropTypes.func,
		width: PropTypes.number,
		height: PropTypes.number
	};
	
	static defaultProps = {
		info: null,
		popToUpperLever: null,
		width: width,
		height: 150
	};
	
	constructor(props){
		super(props);
		this.state = {
			activePage: 0,
			content: props.info.content,
			popToUpperLever:props.popToUpperLever,
			width: props.width,
			height: props.height
		}
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			content: props.info.content,
			width: props.width,
			height: props.height,
			popToUpperLever: props.popToUpperLever,
		});
	}
	
	componentDidMount() {
		this.startInterval();
	}
	
	startInterval(){
		var currentPage = 0;
		var scrollView = this.refs.scrollView;
		this.interval = setInterval(()=>{
			if(this.state.activePage + 1 >= this.state.content.length){
				currentPage = 0;
			}else{
				currentPage = this.state.activePage + 1;
			}
			this.setState({
				activePage: currentPage
			});
			var offsetX = currentPage * this.props.width;
			scrollView.scrollResponderScrollTo({x: offsetX,y:0,animated:true});
		},2000);
	}
	
	componentWillUnMount() {
		this.interval && clearInterval(this.interval);
	}
	
	render(){
		return (
			<View style={{width:this.state.width,height:this.state.height}}>
				<ScrollView
					ref="scrollView"
					horizontal={true}
					pagingEnabled={true}
					showsHorizontalScrollIndicator={false}
					onMomentumScrollEnd={(e)=>this.momentumScrollEnd(e)}
					onScrollBeginDrag={this.onScrollBeginDrag.bind(this)}
					onScrollEndDrag={this.onScrollEndDrag.bind(this)}
				>
					{this.renderScrollViewItem()}
				</ScrollView>
				<View style={[styles.navScrollViewCount,{width: this.state.width}]}>
					{this.renderScrollViewItemCount()}
				</View>
			</View>
		);
	}
	
	onScrollBeginDrag(){
		clearInterval(this.interval);
	}
	
	onScrollEndDrag(){
		this.startInterval();
	}
	
	renderScrollViewItem(){
		var view = [];
		for(var i = 0; i < this.state.content.length; i++){
			let data = this.state.content[i];
			view.push(
				<TouchableOpacity key={i} onPress={()=>{
					if(data.jump.params.url){
						this.state.popToUpperLever(data.jump.params.url)
					}else if(data.jump.params.activityId){
						this.state.popToUpperLever("http://h5.m.jd.com/active/" + data.jump.params.activityId + "/index.html");
					}
				}}>
					<Image  source={{uri: data.horizontalImag}} style={{width: this.state.width, height:this.state.height}} resizeMode='stretch'/>
				</TouchableOpacity>
			);
		}
		return view;
	}
	
	renderScrollViewItemCount(){
		var view = [];
		for(var i = 0; i < this.state.content.length; i++){
			var style = (i === this.state.activePage)?{color: 'yellow'}:{color:'gray'};
			view.push(
				<Text key={i} style={[{fontSize: 20},style]}>&bull;</Text>
			);
		}
		return view;
	}
	
	momentumScrollEnd(e){
		var currentPage = Math.floor(e.nativeEvent.contentOffset.x/this.props.width);
		this.setState({
			activePage: currentPage
		});
	}
}

const styles=StyleSheet.create({
	container:{
		
	},
	navScrollViewCount:{
		position: 'absolute',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		bottom: 0,
		height: 20,
	}
});

export default HomeHorizontalScrollView;
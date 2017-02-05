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

class HomeAd extends Component{
	
	static propTypes = {
		info: PropTypes.object,
		width: PropTypes.number,
		height: PropTypes.number
	};
	
	static defaultProps = {
		info: null,
		width: width,
		height: 100
	};
	
	constructor(props){
		super(props);
		this.state = {
			activePage: 0,
			info: props.info,
			width: props.width,
			height: props.height
		}
	}
	
	componentWillReceiveProps(props) {
		this.state = {
			activePage: 0,
			info: props.info,
			width: props.width,
			height: props.height
		}
	}
	
	componentDidMount() {
		this.startInterval();
	}
	
	startInterval(){
		var currentPage = 0;
		var scrollView = this.refs.scrollView;
		this.interval = setInterval(()=>{
			if(this.state.activePage + 1 >= this.state.info.content.subFloors[0].data.length){
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
				<View style={[styles.navScrollViewCount,{width: this.props.width}]}>
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
		var data = this.state.info.content.subFloors[0].data;
		for(var i = 0; i < data.length; i++){
			view.push(
				<Image key={i} source={{uri: data[i].img}} style={{width: this.state.width, height:this.state.height}} resizeMode='stretch'/>
			);
		}
		return view;
	}
	
	renderScrollViewItemCount(){
		var view = [];
		for(var i = 0; i < this.state.info.content.subFloors[0].data.length; i++){
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

export default HomeAd;
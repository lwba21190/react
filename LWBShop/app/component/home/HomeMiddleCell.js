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

class HomeMiddleCell extends Component{
	
	static  propTypes = {
		info: PropTypes.object,
		width: PropTypes.number,
		height: PropTypes.number,
		popToUpperLever: PropTypes.func,
	};
	
	static defaultProps = {
		info: null,
		width: 0,
		height: 100,
		popToUpperLever: null
	};
	
	constructor(props){
		super(props);
		this.state = {
			info: props.info,
			width: props.width,
			height: props.height,
			popToUpperLever: props.popToUpperLever
		};
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			info: props.info,
			width: props.width,
			height: props.height,
			popToUpperLever: props.popToUpperLever
		});
	}
	
	render(){
		return (
			<TouchableOpacity style={[styles.container,{width:this.state.width,height:this.state.height}]} onPress={()=>{
				if(this.state.info.jump && this.state.info.jump.params.url){
					this.state.popToUpperLever(this.state.info.jump.params.url)
				}else if(this.state.info.jump && this.state.info.jump.params.activityId){
					this.state.popToUpperLever("http://h5.m.jd.com/active/" + this.state.info.jump.params.activityId + "/index.html");
				}
			}}>
				{this.renderView()}
			</TouchableOpacity>
		);
	}
	
	renderView(){
		switch(this.props.info.imageType){
			case 0: {
				return (
					<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
						<Image source={{uri: this.state.info.img}} style={{width:160,height:100}} resizeMode="stretch"/>
					</View>
				);
			}
			case 1:{
				return (
					<View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
						<View style={styles.leftView}>
							<Text style={{fontSize:12,color: this.state.info.maintitleColor}}>{this.state.info.showName}</Text>
							<Text style={{fontSize:10,color: this.state.info.subtitleColor}}>{this.state.info.subtitle}</Text>
							{this.renderLabel(this.state.info)}
						</View>
						<View  style={styles.rightView}>
							<Image source={{uri: this.state.info.img}} style={{width:77,height:72}}/>
						</View>
					</View>
				);
			}
			case 2:{
				return (
					<View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
						<View style={styles.leftView}>
							<Image source={{uri: this.state.info.bgImg}} style={{width:155,height:87}}/>
						</View>
						<View  style={styles.rightView}>
							<Image source={{uri: this.state.info.img}} style={{width:77,height:72}}/>
						</View>
					</View>
				);
			}
			case 3:{
				return (
					<View style={{flex:1}}>
						<View>
							<Text style={{fontSize:12,color: this.state.info.maintitleColor}}>{this.state.info.showName}</Text>
							<Text style={{fontSize:10,color: this.state.info.subtitleColor}}>{this.state.info.subtitle}</Text>
						</View>
						<View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
							<Image source={{uri: this.state.info.img}} style={{width:57,height:50}}/>
						</View>
						{this.renderLabel1(this.state.info)}
					</View>
				);
			}
			default: {
				return (
					<View style={{flex:1}}>
						<View>
							<Text style={{fontSize:12,color: 'black'}}>{this.state.info.shopCategories.name}</Text>
							<Text style={{fontSize:10}}>{this.state.info.shopCategories.recommendDes}</Text>
						</View>
						<View style={{flex:1,justifyContent:'center',alignItems: 'center',flexDirection: 'row'}}>
							<Image source={{uri: this.state.info.wareList[0].imgPath}} style={{width:57,height:50}}/>
							<Image source={{uri: this.state.info.wareList[1].imgPath}} style={{width:57,height:50}}/>
							<Image source={{uri: this.state.info.wareList[2].imgPath}} style={{width:57,height:50}}/>
						</View>
						<View style={styles.bottomLabel}>
							<Text style={{fontSize:7,color:'white'}}>{this.state.info.shopName}</Text>
						</View>
					</View>
				);
			}
		}
	}
	
	renderLabel(info){
		if(info.labelWords !== ""){
			return (
				<View style={{flexDirection:'row'}}>
					<Text style={[styles.labelText,{backgroundColor: info.labelColor}]}>{info.labelWords}</Text>
					<View style={{flex:1}}></View>
				</View>
			);
		}
	}
	
	renderLabel1(info){
		if(info.labelWords !== ""){
			return (
				<View style={{position:'absolute',bottom:0,width:this.props.width}}>
					<Text style={[styles.labelText,{backgroundColor: info.labelColor,textAlign:'center'}]}>{info.labelWords}</Text>
				</View>
			);
		}
	}
}

const styles=StyleSheet.create({
	container: {
		borderTopWidth: 1,
		borderRightWidth: 1,
		borderTopColor: '#f5f5f5',
		borderRightColor: '#f5f5f5',
		padding:5,
	},
	leftView:{
		flex:1,
		height:80
	},
	rightView:{
		flex:1,
		height:80,
		justifyContent:'center',
		alignItems: 'center'
	},
	labelText:{
		fontSize:10,
		color:'white',
		paddingLeft:2,
		paddingRight:2
	},
	bottomLabel:{
		width:width/2,
		justifyContent:'center',
		alignItems:'center',
		height:10,
		position:'absolute',
		bottom:0,
		backgroundColor:'rgba(110,110,110,0.7)'
	}
});

export default HomeMiddleCell;
import React, {PropTypes, Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity
} from 'react-native';

class MineCell extends Component{
	static propTypes = {
		iconName: PropTypes.string,
		number: PropTypes.string,
		title: PropTypes.string,
		subtitle: PropTypes.string
	};
	
	static defaultProps = {
		iconName: '',
		number: '0',
		title: '',
		subtitle: ''
	};
	render(){
		return (
			<TouchableOpacity style={styles.container}>
				{this.renderTop()}
				{this.renderbottom()}
			</TouchableOpacity>
		);
	}
	
	renderTop(){
		if(this.props.iconName.length !== 0){
			return (
				<Image source={{uri: this.props.iconName}} style={styles.iconStyle}/>
			);
		}else{
			return (
				<Text>{this.props.number}</Text>
			);
		}
	}
	
	renderbottom(){
		if(this.props.subtitle.length !== 0){
			return (
				<View style={styles.bottomStyle}>
					<Text style={styles.titleStyle}>{this.props.title}</Text>
					<Text style={styles.subtitleStyle}>{this.props.subtitle}</Text>
				</View>
			);
		}else{
			return (
				<Text style={styles.titleStyle}>{this.props.title}</Text>
			);
		}
	}
}

const styles = StyleSheet.create({
	container:{
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconStyle:{
		width: 16,
		height: 16
	},
	
	bottomStyle: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	
	titleStyle: {
		fontSize: 8,
		color: 'black'
	},
	
	subtitleStyle: {
		fontSize: 7,
		color: 'gray'
	}
});

export default MineCell;

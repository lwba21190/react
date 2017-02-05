import React, {PropTypes, Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Image,
	TouchableWithoutFeedback
} from 'react-native';

class CheckBox extends Component{
	
	static propTypes={
		defaultValue: PropTypes.bool,
		callback: PropTypes.func
	};
	
	static defaultProps={
		defaultValue: false,
		callback: null
	};
	
	constructor(props){
		super(props);
		this.state = {
			checkBoxValue: this.props.defaultValue
		}
	}
	
	componentWillReceiveProps(props) {
		this.setState({
			checkBoxValue: props.defaultValue
		});
	}
	
	render(){
		var iconName = this.state.checkBoxValue ? 'checkbox_selected':'checkbox';
		return (
			<TouchableWithoutFeedback onPress={()=>{
				if(this.props.callback != null){
					this.props.callback(!this.state.checkBoxValue);
				}
				this.setState({checkBoxValue: !this.state.checkBoxValue})
			}}>
				<Image source={{uri: iconName}} style={styles.imageViewStyle}/>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	imageViewStyle:{
		width: 16,
		height: 16
	}
});

export default CheckBox;
import React, {PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Image,
	ListView,
	TouchableOpacity
} from 'react-native';

import ShopCarChoosedShopCommodityInfo from "./ShopCarChoosedShopCommodityInfo";

class ShopCarSelectedInfo extends Component {
	
	static propTypes = {
		info: PropTypes.object,
		callback: PropTypes.func
	};
	
	static defaultProps = {
		info: null,
		callback: null
	};
	
	render() {
		return (
			<View>
				{this.renderAllChoosedCommodities(this.props.info)}
			</View>
		);
	}
	
	renderAllChoosedCommodities(info) {
		var view = [];
		var data = info.vendors;
		for(var i = 0; i < data.length; i++){
			view.push(<ShopCarChoosedShopCommodityInfo key={i} id={i} info={data[i]} callback={(options)=>{
				if(this.props.callback){
					this.props.callback(options);
				}
			}}/>);
		}
		return view;
	}
}

const styles = StyleSheet.create({
});

export default ShopCarSelectedInfo;
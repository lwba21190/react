import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	Navigator
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

import Home from '../home/Home';
import Sort from '../sort/Sort';
import Find from '../find/Find';
import ShopCar from '../shopcar/ShopCar';
import Mine from '../mine/Mine';

class Main extends Component{
	
	constructor(props){
		super(props);
		this.state={
			selectedTab: 'home'
		}
	}
	
	render(){
		return (
			<TabNavigator>
				{this.renderItem('home','首页','home','home_selected','首页',Home)}
				{this.renderItem('sort','分类','sort','sort_selected','分类',Sort)}
				{this.renderItem('find','发现','find','find_selected','发现',Find)}
				{this.renderItem('shopcar','购物车','shopcar','shopcar_selected','购物车',ShopCar)}
				{this.renderItem('mine','我的','mine','mine_selected','我的',Mine)}
			</TabNavigator>
		);
	}
	
	renderItem(selectedTab,title,renderIcon,renderSelectedIcon,componentName,component,badgeText){
		return (
			<TabNavigator.Item
				selected={this.state.selectedTab === selectedTab}
				title={title}
				renderIcon={() => <Image source={{uri: renderIcon}} style={styles.iconStyle}/>}
				renderSelectedIcon={() =><Image source={{uri: renderSelectedIcon}} style={styles.iconStyle}/>}
				badgeText={badgeText}
				onPress={()=>this.setState({ selectedTab: selectedTab })}
				selectedTitleStyle={styles.selectedTitleStyle}
			>
				<Navigator
					initialRoute={{name: componentName, component: component}}
				    configureScene={()=>{
				    	return Navigator.SceneConfigs.PushFromRight;
				    }}
				    renderScene={(route,navigator)=>{
				    	let Component = route.component;
					    return <Component {...route.passProps} navigator={navigator} />
				    }}
				/>
			</TabNavigator.Item>
		);
	}
}

const styles = StyleSheet.create({
	iconStyle:{
		width: 16,
		height: 16
	},
	selectedTitleStyle:{
		color: '#eb4f38'
	}
});

export default Main;
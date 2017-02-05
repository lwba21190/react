import React, {PropTypes,Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Image,
	ListView,
	ScrollView,
	Dimensions,
	TouchableOpacity
} from 'react-native';

import FindTopScrollViewItem from './FindTopScrollViewItem';
import FindMiddleTopItem from './FindMiddleTopItem';

var {width,height} = Dimensions.get('window');

class FindTopView extends Component{
	
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
		this.state={
			upOrDownIcon: 'down',
			middleListViewHeight: 20,
			info: props.info,
			dataSource: new ListView.DataSource({rowHasChanged:(r1,r2)=>r1 !== r2}),
			popToUpperLever: props.popToUpperLever
		}
	}
	
	componentDidMount() {
		var self = this;
		self.setState({
			dataSource: self.state.dataSource.cloneWithRows(self.state.info.articleType)
		});
	}
	
	componentWillReceiveProps(props) {
		this.state={
			info: props.info,
			dataSource: new ListView.DataSource(props.info.articleType),
			popToUpperLever: props.popToUpperLever
		}
	}
	
	render(){
		return (
			<View style={styles.container}>
				<ScrollView
					style={{backgroundColor:'white'}}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
				>
					{this.renderItems()}
				</ScrollView>
				<View style={{marginTop:3}}>
					<View style={{backgroundColor:'white',padding:5}}>
						<View style={{justifyContent:'center',alignItems:'center'}}>
							<Text style={{color:'black',fontSize:12}}>{this.state.info && this.state.info.homePitTitle}</Text>
						</View>
						<View>
							{this.renderMiddleTop()}
						</View>
				    </View>
					<View style={styles.middleBottomView}>
						<ListView
							dataSource={this.state.dataSource}
							renderRow={this.renderRow}
							contentContainerStyle={[styles.listView,{height:this.state.middleListViewHeight}]}
							pageSize={2}
						/>
						<TouchableOpacity onPress={()=>this.pushOrPull()} style={{width:40,alignItems:'center'}}>
							<Image source={{uri: this.state.upOrDownIcon}} style={{width:16,height:16,marginTop:2}} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
	
	renderItems(){
		if(this.state.info){
			var view = [];
			var data = this.state.info.floorList;
			for(var i = 0; i < data.length; i++){
				view.push(
					<FindTopScrollViewItem key={i} info={data[i]} width={60} height={60}/>
				);
			}
			return view;
		}
	}
	
	renderMiddleTop(){
		if(this.state.info) {
			var view = [];
			var data = this.state.info.homePit;
			for (var i = 0; i < data.length; i++) {
				view.push(
					<View key={i} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
						{this.renderMiddleTopLine(data[i].content)}
					</View>
				);
			}
			return view;
		}
	}
	
	renderMiddleTopLine(info){
		var view = [];
		for(var i = 0; i < info.length; i++){
			view.push(
				<FindMiddleTopItem
					key={i}
					info={info[i]}
					width={Math.floor((width-10)/info.length)}
					height={150}
					popToUpperLever={(url)=>this.state.popToUpperLever(url)}
				/>
			);
		}
		return view;
	}
	
	renderRow(rowData){
		return (
			<View style={styles.middleListViewItem}>
				<TouchableOpacity style={styles.middleListViewItemText}>
					<Text style={{fontSize:8}}>{rowData.name}</Text>
				</TouchableOpacity>
			</View>
		);
	}
	
	pushOrPull(){
		var iconName = (this.state.upOrDownIcon === 'up')? 'down' : 'up';
		var listViewHeight = (this.state.upOrDownIcon === 'up')? 20 : 60;
		this.setState({
			upOrDownIcon: iconName,
			middleListViewHeight: listViewHeight
		});
	}
}

const styles=StyleSheet.create({
	container: {

	},
	listView:{
		flexDirection:'row',
		flexWrap: 'wrap'
	},
	middleListViewItem:{
		width: (width-40)/4,
		height: 20,
		justifyContent:'center',
		alignItems: 'center',
	},
	
	middleListViewItemText:{
		borderRadius:10,
		borderWidth:1,
		borderColor:'#cccccc',
		width:40,
		alignItems:'center',
		backgroundColor:'white'
	},
	middleBottomView:{
		width: width,
		flexDirection: 'row'
	}
});

export default FindTopView;
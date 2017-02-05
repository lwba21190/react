import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Navigator
} from 'react-native';

import Advertisement from './app/component/main/Advertisement';

class LWBShop extends Component {
  render() {
    return (
        <Navigator
            initialRoute={{name: "开机广告", component: Advertisement}}
            configureScene={()=>{
              return Navigator.SceneConfigs.FloatFromRight
            }}
            renderScene={(route,navigator)=>{
              let Component = route.component;
              return <Component {...route.passProps} navigator={navigator}/>
            }}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('LWBShop', () => LWBShop);

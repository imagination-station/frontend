import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import ExploreScreen from './Explore.js';
import ProfileScreen from './Profile.js';
import MapScreen from './Map.js';

import { ACCENT } from '../config/styles.js';

const ExploreTab = createMaterialBottomTabNavigator({
  Explore: ExploreScreen,
  Profile: ProfileScreen
}, {
  activeColor: ACCENT,
  barStyle: {
    backgroundColor: 'white',
  }
});

const StackNavigator = createStackNavigator({
  Explore: ExploreTab,
  Map: MapScreen
}, {
  defaultNavigationOptions: {
  }
});

const HomeContainer = createAppContainer(StackNavigator);

class HomeScreen extends Component {
  render() {
    return <HomeContainer />;
  }
}

export default HomeScreen;

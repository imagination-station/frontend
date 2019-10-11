import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import * as firebase from 'firebase';

import LoginScreen from './app/screens/Login.js';
import ExploreScreen from './app/screens/Explore.js';
import CollectionScreen from './app/screens/Collection.js';
import ProfileScreen from './app/screens/Profile.js';
import MapScreen from './app/screens/Map.js';
import PathDetailScreen from './app/screens/PathDetail.js';

import { FIREBASE_CONFIG } from './app/config/settings.js';
import { ACCENT } from './app/config/styles.js';

firebase.initializeApp(FIREBASE_CONFIG);

const ExploreTab = createMaterialBottomTabNavigator({
  Explore: ExploreScreen,
  Collection: CollectionScreen,
  Profile: ProfileScreen
}, {
  activeColor: ACCENT,
  barStyle: {
    backgroundColor: 'white',
  }
});

const HomeStack = createStackNavigator({
  Explore: ExploreTab,
  Map: MapScreen,
  PathDetail: PathDetailScreen
});

const AppNavigator = createSwitchNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Home: {
      screen: HomeStack
    }
  },
  {
    initialRouteName: 'Login',
    // defaultNavigationOptions: {
    //   headerTitle: <Text style={{flex: 1, paddingLeft: 10, fontSize: 18, color: DARKER_GREY}}>Stumble</Text>
    // }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
  return <AppContainer />;
}


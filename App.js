import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as firebase from 'firebase';

import LoginScreen from './app/screens/Login.js';
import HomeScreen from './app/screens/Home.js';
import ProfileScreen from './app/screens/Profile.js';
import MapScreen from './app/screens/Map.js';

import { FIREBASE_CONFIG } from './app/config/settings.js';

firebase.initializeApp(FIREBASE_CONFIG);

const AppNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Home: {
      screen: HomeScreen
    },
    Profile: {
      screen: ProfileScreen
    },
    Map: {
      screen: MapScreen
    }
  },
  {
    initialRouteName: 'Login'
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
  return <AppContainer />;
}


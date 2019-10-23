import React, { Component } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import * as firebase from 'firebase';
import { Provider } from 'react-redux';
import { createStore } from 'redux'; 

import LoginScreen from './app/screens/Login.js';
import ExploreScreen from './app/screens/Explore.js';
import CollectionScreen from './app/screens/Collection.js';
import MyTripsScreen from './app/screens/Trips.js';
import ProfileScreen from './app/screens/Profile.js';
import MapScreen, { SearchScreen, DetailScreen, NoteEditorScreen } from './app/screens/Map.js';
import PathDetailScreen from './app/screens/PathDetail.js';
import SignUpScreen from './app/screens/SignUp.js';
import routeReducer from './app/reducers/RouteReducer.js';

import { FIREBASE_CONFIG } from './app/config/settings.js';
import { ACCENT } from './app/config/styles.js';

firebase.initializeApp(FIREBASE_CONFIG);
const store = createStore(routeReducer);

const mapNavigationStateParamsToProps = (SomeComponent) => {
  return class extends Component {
      static navigationOptions = SomeComponent.navigationOptions; // better use hoist-non-react-statics
      render() {
          const {navigation: {state: {params}}} = this.props
          return <SomeComponent {...params} {...this.props} />
      }
  }
}

const HomeTab = createMaterialBottomTabNavigator({
  Explore: ExploreScreen,
  Collection: CollectionScreen,
  'My Trips': MyTripsScreen,
  Profile: ProfileScreen
}, {
  shifting: false,
  activeColor: ACCENT,
  barStyle: {
    backgroundColor: 'white',
  }
});

const HomeStack = createStackNavigator({
  Explore: HomeTab,
  Map: MapScreen,
  MapSearch: mapNavigationStateParamsToProps(SearchScreen),
  PlaceDetail: mapNavigationStateParamsToProps(DetailScreen),
  NoteEditor: mapNavigationStateParamsToProps(NoteEditorScreen),
  PathDetail: PathDetailScreen
});

const AppNavigator = createSwitchNavigator(
  {
    SignUp: {
      screen: SignUpScreen
    },
    Login: {
      screen: LoginScreen
    },
    Home: {
      screen: HomeStack
    },
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
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}


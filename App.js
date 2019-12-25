import React, { Component } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import * as firebase from 'firebase';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LoginScreen from './app/screens/Login.js';
import ExploreScreen, { CitySearchScreen, RouteFilterScreen } from './app/screens/Explore.js';
import CollectionsScreen from './app/screens/Collections.js';
import ProfileScreen from './app/screens/Profile.js';

import PlaceDetailsScreen from './app/screens/PlaceDetails.js';
import PlaceEditorScreen, { PhotoRemoverScreen } from './app/screens/PlaceEditor.js';
import TextEditorScreen from './app/screens/TextEditor.js';
import RouteDetailsScreen, { MapSearchScreen } from './app/screens/RouteDetails.js';
import SignUpScreen from './app/screens/SignUp.js';
import SplashScreen from './app/screens/Splash.js';
import TutorialScreen from './app/screens/Tutorial.js';
import LocationScreen from './app/screens/Location.js';
import InterestsScreen from './app/screens/Interests.js';

import Playground from './app/screens/Playground.js';

import routeReducer from './app/reducers/RouteReducer.js';

import { FIREBASE_CONFIG } from './app/config/settings.js';
import { ACCENT, PRIMARY } from './app/config/styles.js';

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
  'My Collections': CollectionsScreen,
  Profile: ProfileScreen
}, {
  shifting: false,
  activeColor: PRIMARY,
  barStyle: {
    backgroundColor: 'white',
  },
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      switch (routeName) {
        case 'Explore':
          iconName = 'explore';
          break;
        case 'My Collections':
          iconName = 'collections';
          break;
        default:
          iconName = 'account-circle';
      }

      return <Icon name={iconName} size={23} color={tintColor} />;
    },
  }),
});

const HomeStack = createStackNavigator({
  Explore: {
    screen: HomeTab,
    navigationOptions: {
      header: null
    }
  },
  CitySearch: mapNavigationStateParamsToProps(CitySearchScreen),
  RouteFilter: mapNavigationStateParamsToProps(RouteFilterScreen),
  Location: mapNavigationStateParamsToProps(LocationScreen),
  MapSearch: mapNavigationStateParamsToProps(MapSearchScreen),
  PlaceDetails: mapNavigationStateParamsToProps(PlaceDetailsScreen),
  PlaceEditor: mapNavigationStateParamsToProps(PlaceEditorScreen),
  PhotoRemover: mapNavigationStateParamsToProps(PhotoRemoverScreen),
  TextEditor: mapNavigationStateParamsToProps(TextEditorScreen),
  RouteDetails: RouteDetailsScreen,
  Tutorial: TutorialScreen
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen,
  Location: mapNavigationStateParamsToProps(LocationScreen),
  Interests: InterestsScreen,
}, {
  initialRouteName: 'Login'
});

const AppNavigator = createSwitchNavigator(
  {
    Splash: SplashScreen,
    Auth: AuthStack,
    Home: HomeStack,
  },
  {
    initialRouteName: 'Splash',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
  return (
    <Provider store={store}>
      <AppContainer />
      {/* <Playground /> */}
      {/* <LocationScreen /> */}
    </Provider>
  );
}

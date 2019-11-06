import React, { Component } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import * as firebase from 'firebase';
import { Provider } from 'react-redux';
import { createStore } from 'redux'; 
import Icon from 'react-native-vector-icons/MaterialIcons';

import LoginScreen from './app/screens/Login.js';
import ExploreScreen from './app/screens/Explore.js';
import CollectionsScreen from './app/screens/Collections.js';
import ProfileScreen from './app/screens/Profile.js';
import MapScreen, { SearchScreen, NoteEditorScreen } from './app/screens/RouteEditor.js';
import DetailScreen from './app/screens/Routes/PlaceDetail.js';
import RouteDetailScreen from './app/screens/RouteDetail.js';
import SignUpScreen from './app/screens/SignUp.js';
import SplashScreen from './app/screens/Splash.js';

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
  'My Collections': CollectionsScreen,
  Profile: ProfileScreen
}, {
  shifting: false,
  activeColor: ACCENT,
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
  Map: MapScreen,
  MapSearch: mapNavigationStateParamsToProps(SearchScreen),
  PlaceDetail: DetailScreen,
  NoteEditor: mapNavigationStateParamsToProps(NoteEditorScreen),
  RouteDetail: mapNavigationStateParamsToProps(RouteDetailScreen),
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
    Splash: {
      screen: SplashScreen
    },
  },
  {
    initialRouteName: 'Splash',
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


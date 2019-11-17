import React, { Component, Fragment } from 'react';
import { BackHandler, Dimensions, View, StyleSheet, Text, StatusBar, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Header } from 'react-navigation-stack';
import { DARKER_GREY, GREY, PRIMARY } from '../config/styles.js';

const screens = {
  MYTRIPS: 'm',
  SAVED: 's',
  LIKED: 'l'
}

var width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  },
  mainText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  screen: {
    flex: 1,
    padding: 10,
    width: width
  },
  safeArea: {
    flex: 1,
    backgroundColor: GREY
  },
  scrollView: {
    flex: 1
  }
});

class TutorialScreen extends Component {

  static navigationOptions = {
    tabBarVisible: false,
    headerTitle: () => <Text style={{fontSize: 20}}>Tutorial</Text>
  };

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBack)
    );
  }

  onBack = () => {
    return false;
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} horizontal={true} pagingEnabled={true}>
          <View style={styles.screen}>
            <Text style={styles.mainText}>
              Yo
            </Text>
            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </View>
          <View style={styles.screen}>
            <Text style={styles.mainText}>
              Sup
            </Text>
            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </View>
          <View style={styles.screen}>
            <Text style={styles.mainText}>
              Bro
            </Text>
            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default TutorialScreen;

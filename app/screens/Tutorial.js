import React, { Component, Fragment } from 'react';
import { BackHandler, Dimensions, Image, View, StyleSheet, Text, StatusBar, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Header } from 'react-navigation-stack';
import { DARKER_GREY, GREY, PRIMARY, ACCENT } from '../config/styles.js';

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
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  screen: {
    flex: 1,
    padding: 10,
    width: width,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1
  },
  text: {
    fontSize: 15
  },
  tutScreen: {
    height: 400,
    resizeMode: 'contain',
    marginTop: 50,
    marginBottom: 50
  }
});

class TutorialScreen extends Component {

  static navigationOptions = {
    tabBarVisible: false,
    headerTitle: () => <Text style={{fontSize: 20}}>Tutorial</Text>,
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
              Stumble
            </Text>
            <SafeAreaView style={styles.imageContainer}>
              <Image source={require('../assets/screens/splash.jpg')} style={styles.tutScreen}>
              </Image>
            </SafeAreaView>
            <Text style={styles.text}>
              Welcome to Stumble! {"\n"} {"\n"}
              In this app, you can view authentic trips and experiences within a city in order to help make your next trip a little easier.
            </Text>
          </View>
          <View style={styles.screen}>
            <Text style={styles.mainText}>
              View a Route
            </Text>
            <SafeAreaView style={styles.imageContainer}>
              <Image source={require('../assets/screens/view-route.jpg')} style={styles.tutScreen}>
              </Image>
            </SafeAreaView>
            <Text style={styles.text}>
              View routes that other users have created {"\n"} {"\n"}
              • Search for a route by distance, time or interest, or select one from your personalized feed {"\n"}
              • View characteristics of the route by scrolling to the end of points {"\n"}
              • Find routes between two points by clicking the path icon {"\n"}
            </Text>
          </View>
          <View style={styles.screen}>
            <Text style={styles.mainText}>
              Create a Route
            </Text>
            <SafeAreaView style={styles.imageContainer}>
              <Image source={require('../assets/screens/explore.jpg')} style={styles.tutScreen}>
              </Image>
            </SafeAreaView>
            <Text style={styles.text}>
              Create your own route by clicking the plus icon in the search bar. {"\n"} {"\n"}
              • Select your list of points in order {"\n"}
              • Select the amount of time to spend at each point {"\n"}
              • Name your route and tag it {"\n"}
            </Text>
          </View>
          <View style={styles.screen}>
            <Text style={styles.mainText}>
              Edit a Route
            </Text>
            <SafeAreaView style={styles.imageContainer}>
              <Image source={require('../assets/screens/edit-route.jpg')} style={styles.tutScreen}>
              </Image>
            </SafeAreaView>
            <Text style={styles.text}>
              Editing an existing route is not currently available, but will be soon! Stay tuned for more.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default TutorialScreen;

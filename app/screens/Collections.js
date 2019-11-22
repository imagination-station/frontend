import React, { Component, Fragment } from 'react';
import { View, StyleSheet, FlatList, Text, StatusBar, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl, Platform } from 'react-native';

import * as firebase from 'firebase';
import { connect } from 'react-redux';

import { DARKER_GREY, GREY } from '../config/styles.js';
import { SERVER_ADDR, MAPS_API_KEY } from '../config/settings.js';
import RouteCard from '../components/RouteCard.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  },
  sectionContainer: {
    backgroundColor: 'white',
    width: '100%'
  },
  headerFocused: {
    fontSize: 28,
    paddingLeft: 12
  },
  headerBlurred: {
    fontSize: 28,
    paddingLeft: 12,
    color: DARKER_GREY
  },
  safeArea: {
    flex: 1,
    backgroundColor: GREY
  },
  safeStatusArea: {
    flex: 0,
    backgroundColor: '#fff'
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const screens = {
  MYTRIPS: 'm',
  SAVED: 's',
  LIKED: 'l'
}

class CollectionsScreen extends Component {

  state = {
    current: [],
    routes: [],
    bookmarks: [],
    liked: [],
    screen: screens.MYTRIPS,
    refreshing: false
  };

  componentDidMount() {
    firebase.auth().currentUser.getIdToken()
      .then(token => fetch(`${SERVER_ADDR}/users/${this.props.userId}/routes`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }))
      .then(response => response.json())
      .then(responseJson => this.setState({
        current: responseJson,
        routes: responseJson
      }))
      .catch(error => console.error(error));

    firebase.auth().currentUser.getIdToken()
      .then(token => fetch(`${SERVER_ADDR}/users/${this.props.userId}/forks`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }))
      .then(response => response.json())
      .then(responseJson => this.setState({
        bookmarks: responseJson
      }))
      .catch(error => console.error(error));

    firebase.auth().currentUser.getIdToken()
      .then(token => fetch(`${SERVER_ADDR}/users/${this.props.userId}/likes`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }))
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          liked: responseJson
        });
      })
      .catch(error => console.error(error));
  }

  currentStyle = function(screen) {
    if (screen == this.state.screen) {
      return styles.headerFocused;
    } else {
      return styles.headerBlurred;
    }
  }

  getData = () => {
    console.log('getting data');
    console.log(this.props.userId);
    console.log(this.props);
    if (this.props.userId == undefined) {
      return;
    }
    firebase.auth().currentUser.getIdToken()
      .then(token => fetch(`${SERVER_ADDR}/users/${this.props.userId}/routes`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }))
      .then(response => response.json())
      .then(responseJson => this.setState({
        routes: responseJson
      }))
      .catch(error => console.error(error));

    firebase.auth().currentUser.getIdToken()
      .then(token => fetch(`${SERVER_ADDR}/users/${this.props.userId}/forks`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }))
      .then(response => response.json())
      .then(responseJson => this.setState({
        bookmarks: responseJson
      }))
      .catch(error => console.error(error));

    firebase.auth().currentUser.getIdToken()
      .then(token => fetch(`${SERVER_ADDR}/users/${this.props.userId}/likes`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }))
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          liked: responseJson
        });
      })
      .catch(error => console.error(error));

      console.log(this.state.screen);
      switch(this.state.screen) {
        case screens.MYTRIPS:
          this.setState({current: this.state.routes});
          break;
        case screens.SAVED:
          this.setState({current: this.state.bookmarks});
          break;
        case screens.LIKED:
          this.setState({current: this.state.liked});
          break;
      }
      this.setState({refreshing: false});
  }

  onRefresh() {
      console.log('refreshing');
      this.getData();
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView style={styles.safeStatusArea} />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollView} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />}>
            <View style={styles.container}>
              <View style={styles.sectionContainer}>
                <View style={{flexDirection: 'row', paddingTop: 30, paddingLeft: 7, alignItems: 'flex-end'}}>
                  <TouchableOpacity onPress={() => {
                    this.setState({
                      current: this.state.routes,
                      screen: screens.MYTRIPS
                    })
                  }}>
                    <Text style={this.currentStyle(screens.MYTRIPS)}>My Trips</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    this.setState({
                      current: this.state.bookmarks,
                      screen: screens.SAVED
                    })
                  }}>
                    <Text style={this.currentStyle(screens.SAVED)}>Saved</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    this.setState({
                      current: this.state.liked,
                      screen: screens.LIKED
                    })
                  }}>
                    <Text style={this.currentStyle(screens.LIKED)}>Liked</Text>
                  </TouchableOpacity>
                </View>
                {this.state.current.length != 0 ?
                <FlatList
                  data={this.state.current}
                  renderItem={({ item }) => {
                    const photoRef = item.pins[0].properties.photoRefs[0];
                    return (
                      <RouteCard
                        key={item._id}
                        title={item.name}
                        numLikes={item.numLikes}
                        city ={item.city.name}
                        photoRef={`https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${photoRef}&maxheight=800&maxWidth=800`}
                        onPress={() => this.props.navigation.navigate('RouteDetail', {
                          route: item
                        })}
                      />
                    );
                  }}
                  keyExtractor={item => item._id}
                  extraData={this.state.screen}
                  contentContainerStyle={{alignItems: 'center', width: '100%', backgroundColor: 'transparent'}}/> :
                  <Text style={{padding: 30, alignSelf: 'center', color: DARKER_GREY}}>Wow, so empty :)</Text>}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.userId
  };
}

export default connect(mapStateToProps, null)(CollectionsScreen);
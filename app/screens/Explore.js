
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl
} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import RouteCard from '../components/RouteCard.js';

import { DARKER_GREY, PRIMARY } from '../config/styles.js';
import { SERVER_ADDR, PLACE_ID, MAPS_API_KEY } from '../config/settings.js';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionContainer: {
    backgroundColor: 'white',
    width: '100%',
    paddingTop: 20
  },
  sectionHeader: {
    fontSize: 12,
    marginBottom: 5,
    color: DARKER_GREY
  },
  imageContainer: {
    height: Math.floor(height / 2)
  },
  imageText: {
    color: 'white',
    fontSize: 48,
  },
  image: {
    height: Math.floor(height / 2),
    resizeMode: 'cover'
  },
  endPadding: {
    flexGrow: 1
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function CityImage(props) {
  return (
    <View style={styles.imageContainer}>
      <Image source={{uri: props.uri}} style={styles.image} />
        <View style={{paddingLeft: 10, position: 'absolute', bottom: 10}}>
          <Text style={{fontWeight: 'bold', color: PRIMARY}}>Welcome to</Text>
          <Text style={styles.imageText}>{props.title}</Text>
        </View>
    </View>
  );
}

class ExploreScreen extends Component {

  state = {
    routes: [],
    // simulate bookmarks
    bookmarks: [],
    bookmarks_id: [],
    likes: [],
    refreshing: false,
    // hardcoded for Atlanta for now
    photoUri: 'https://d13k13wj6adfdf.cloudfront.net/urban_areas/atlanta-9e33744cb4.jpg',
  };

  componentDidMount() {
    this.scrollValue = new Animated.Value(0);
    firebase.auth().currentUser.getIdToken().then(token =>
      fetch(`${SERVER_ADDR}/cities/${PLACE_ID}/routes`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    )
    .then(response => response.json())
    .then(responseJson => this.setState({
      routes: responseJson,
      bookmarks: new Array(responseJson.length),
      bookmarks_id: new Array(responseJson.length)
    }))
    .catch(error => console.error(error));
  }

  getData = () => {
    console.log('getting data');
    console.log(this.props.userId);
    console.log(this.props);
    if (this.props.userId == undefined) {
      return;
    }
    firebase.auth().currentUser.getIdToken().then(token =>
      fetch(`${SERVER_ADDR}/cities/${PLACE_ID}/routes`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    )
    .then(response => response.json())
    .then(responseJson => this.setState({
      routes: responseJson,
      bookmarks: new Array(responseJson.length),
      bookmarks_id: new Array(responseJson.length),
      likes: new Array(responseJson.length);
    }))
    .catch(error => console.error(error));
    this.setState({refreshing: false});
  }

  onRefresh() {
      console.log('refreshing');
      this.getData();
  }

  render() {
    return (
    <ScrollView contentContainerStyle={styles.scrollView} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />}>
      <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
          <CityImage title='Atlanta' uri={this.state.photoUri} />
          <View style={styles.sectionContainer}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 20}}>Art and Architecture</Text>
            <Animated.ScrollView
              contentContainerStyle={styles.endPadding}
              horizontal
              scrollEventThrottle={1}
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event([
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.scrollValue,
                    },
                  }
                }
              ], {useNativeDriver: true}
              )}
              style={{width: '100%', backgroundColor: 'transparent', paddingLeft: 10, marginBottom: 25}}
            >
              {this.state.routes.map((item, index) => {
                let photoRef = item.pins[0].properties.photoRefs[0];
                return (
                  <RouteCard
                    key={item._id}
                    title={item.name}
                    photoRef={`https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${photoRef}&maxheight=800&maxWidth=800`}
                    onPress={() => this.props.navigation.navigate('RouteDetail', {
                      route: item
                    })}
                    bookmarked={this.state.bookmarks[index]}
                    liked={this.state.likes[index]}
                    onBookmark = {() => {
                      let bookmarks = [...this.state.bookmarks];
                      bookmarks[index] = !this.state.bookmarks[index];
                      this.setState({bookmarks: bookmarks});
                      let bookmarks_id = [...this.state.bookmarks_id];
                      let routeId = this.state.routes[index]._id;
                      console.log(`Route ID: ${routeId}`);
                      console.log(bookmarks);
                      if (bookmarks[index]) {
                        firebase.auth().currentUser.getIdToken().then(token =>
                          fetch(`${SERVER_ADDR}/users/${this.props.userId}/forks`, {
                            method: 'POST',
                            headers: {
                              Accept: 'application/json',
                              'Content-type': 'application/json',
                              Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              routeId: routeId,
                            })
                          })
                        )
                        .then(response => response.json())
                        .then(responseJson => {
                          let tempID = responseJson["Mongo ObjectID"];
                          bookmarks_id[index] = tempID;
                          this.setState({bookmarks_id: bookmarks_id});
                        })
                       } else {
                         let route_id = this.state.bookmarks_id[index];
                         console.log(`Deleting ${route_id}`);
                         firebase.auth().currentUser.getIdToken().then(token =>
                           fetch(`${SERVER_ADDR}/cities/routes/${route_id}`, {
                             method: 'DELETE',
                             headers: {
                               Accept: 'application/json',
                               'Content-type': 'application/json',
                               Authorization: `Bearer ${token}`
                             }
                           }))
                           .then(response => response.json())
                           .then(responseJson => {
                             console.log(responseJson);
                           })
                      }
                    }}
                    onLike = {() => {
                      let likes = [...this.state.likes];
                      likes[index] = !this.state.likes[index];
                      this.setState({likes: likes});
                      let routeId = this.state.routes[index]._id;
                      console.log(`Route ID: ${routeId}`);
                      console.log(likes);
                      like = likes[index] ? "like" : "unlike";
                      console.log(like);
                      firebase.auth().currentUser.getIdToken().then(token =>
                        fetch(`${SERVER_ADDR}/cities/routes/${routeId}/likes`, {
                          method: 'PATCH',
                          headers: {
                            Accept: 'application/json',
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            type: like,
                            userId: this.props.userId
                          })
                        })
                      )
                      .then(response => response.text())
                      .then(responseText => {
                        console.log(responseText);
                      })
                    }}
                  />
                );
              })}
            </Animated.ScrollView>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 20}}>Foodie</Text>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.userId
  };
}

export default connect(mapStateToProps, null)(ExploreScreen);
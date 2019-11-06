
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import * as firebase from 'firebase';

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
      }))
      .catch(error => console.error(error));
  }

  render() {
    return (
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
                    title={item.name}
                    photoRef={`https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${photoRef}&maxheight=800&maxWidth=800`}
                    onPress={() => this.props.navigation.navigate('RouteDetail', {
                      route: item
                    })}
                    bookmarked={this.state.bookmarks[index]}
                    onBookmark = {() => {
                      let bookmarks = [...this.state.bookmarks];
                      bookmarks[index] = !this.state.bookmarks[index];
                      this.setState({bookmarks: bookmarks});
                    }}
                  />
                );
              })}
            </Animated.ScrollView>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 20}}>Foodie</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ExploreScreen;
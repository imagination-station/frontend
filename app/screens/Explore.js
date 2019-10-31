
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Animated,
  Dimensions,
  ScrollView
} from 'react-native';
import * as firebase from 'firebase';

import PathCard from '../components/PathCard.js';

import { DARKER_GREY, ACCENT } from '../config/styles.js';
import { SERVER_ADDR, PLACE_ID, MAPS_API_KEY, INIT_LOCATION } from '../config/settings.js';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionContainer: {
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
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
});

function CityImage(props) {
  return (
    <View style={styles.imageContainer}>
      <Image source={{uri: props.uri}} style={styles.image} />
        <View style={{paddingLeft: 10, position: 'absolute', bottom: 10}}>
          <Text style={{fontWeight: 'bold', color: ACCENT}}>Welcome to</Text>
          <Text style={styles.imageText}>{props.title}</Text>
        </View>
    </View>
  );
}

class ExploreScreen extends Component {

  state = {
    routes: null,
    // hardcoded for Atlanta for now
    photoUri: 'https://d13k13wj6adfdf.cloudfront.net/urban_areas/atlanta-9e33744cb4.jpg',
    // simulate bookmarks
    bookmarks: null,
  };

  componentDidMount() {
    // firebase.auth().currentUser.getIdToken().then(token => {
    //   fetch(`${SERVER_ADDR}/cities/${PLACE_ID}/routes`, {
    //     method: 'GET',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-type': 'application/json',
    //       Authorization: 'Bearer '.concat(token)
    //     }
    //   })
    //     .then(response => response.json())
    //     .then(responseJson => this.setState({
    //       routes: responseJson
    //     }))
    //     .catch(error => console.error(error));
    //   }
    // );
  }

  render() {
    return (
    <View style={styles.container}> 
        <ScrollView style={{flex: 1}}>
          <CityImage title='Atlanta' uri={this.state.photoUri} />
          <View style={styles.sectionContainer}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Art and Architecture</Text>
            <FlatList
              data={this.state.routes}
              renderItem={({ item, index }) => {
                let photoRef = item.pins[0].properties.photoReference[0];
                return (
                  <PathCard
                    title={item.name}
                    photoReference={`https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${photoRef}&maxheight=800&maxWidth=800`}
                    onPress={() => this.props.navigation.navigate('PathDetail', {
                      markers: item.pins,
                      name: item.name
                    })}
                    bookmarked={this.state.bookmarks[index]}
                    onBookmark = {() => {
                      let bookmarks = [...this.state.bookmarks];
                      bookmarks[index] = !this.state.bookmarks[index];
                      this.setState({bookmarks: bookmarks});
                    }}
                  />
                );
              }}
              keyExtractor={item => item.place_id}
              contentContainerStyle={{alignItems: 'center', width: '100%', backgroundColor: 'transparent'}} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ExploreScreen;
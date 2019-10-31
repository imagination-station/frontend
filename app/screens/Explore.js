
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
import ImageCarousel from '../components/ImageCarousel.js';

import globalStyles, { DARKER_GREY, GREY, ACCENT_GREEN, ACCENT } from '../config/styles.js';
import { SERVER_ADDR, PLACE_ID, MAPS_API_KEY, INIT_LOCATION } from '../config/settings.js';
import { HeaderTitle } from 'react-navigation-stack';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 0.5,
    backgroundColor: 'white'
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 25
  },
  headerMainText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  headerSecondaryText: {
    fontSize: 14,
    color: ACCENT_GREEN
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
  scrollViewContainer: {
    alignItems: 'center',
    height: Math.floor(height / 3),
  },
  imageScrollView: {
    height: Math.floor(height / 3),
    width: width
  },
  image: {
    height: Math.floor(height / 3),
    width: width
  },
});

class ExploreScreen extends Component {

  static navigationOptions = {
    headerMode: 'none'
  };

  state = {
    routes: null,
    photoRefs: [],
    // simulate bookmarks
    bookmarks: null,
  };

  componentWillMount() {
    this.scrollValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.fetchPhotos();
    firebase.auth().currentUser.getIdToken().then(token => {
      fetch(`${SERVER_ADDR}/cities/${PLACE_ID}/routes`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: 'Bearer '.concat(token)
        }
      })
        .then(response => response.json())
        .then(responseJson => this.setState({routes: responseJson, bookmarks: new Array(responseJson.length)}))
        .catch(error => console.error(error));
      }
    );

    console.log('auth provider', firebase.auth().currentUser.providerData[0].providerId);
    console.log('facebook uid', firebase.auth().currentUser.providerData[0].uid);
  }

  fetchPhotos = () => {
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&key=${MAPS_API_KEY}`)
    .then(response => response.json())
    .then(responseJson => {
      const photoRefs = responseJson.result.photos ? responseJson.result.photos.map(elem => elem.photo_reference).slice(0, 7) : [];
      this.setState({photoRefs: photoRefs});
    });
  }

  render() {
    return (
    <View style={styles.container}> 
        <ScrollView style={{flex: 1}}>
          <ImageCarousel
            width={width}
            scrollValue={this.scrollValue}
            containerStyle={styles.scrollViewContainer}
            scrollViewStyle={styles.imageScrollView}
          >
            {this.state.photoRefs.reduce((res, ref) => {
              res.push(
                <Image
                  source={{uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${ref}&maxheight=800&maxWidth=${width}`}}
                  style={styles.image}
                />
              );
              return res;
            }, [
              <Image
                source={{uri: 'http://www.ddays2014.gatech.edu/img/photo%201.JPG'}}
                style={styles.image}
              />
            ])}
          </ImageCarousel>
          <View style={{padding: 10}}>
            <Text style={{fontWeight: 'bold', color: ACCENT_GREEN}}>Welcome to</Text>
            <Text style={{fontSize: 36}}>Atlanta, USA</Text>
          </View>
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/staticmap?center=${INIT_LOCATION.latitude},${INIT_LOCATION.longitude}&zoom=12&size=720x720&key=${MAPS_API_KEY}`
            }}
            style={{width: '100%', height: 150, borderTopLeftRadius: 25, borderTopRightRadius: 25, alignSelf: 'center'}}
          />
          <View style={styles.sectionContainer}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Based on your Interest in Colleges</Text>
            <FlatList
              data={this.state.routes}
              renderItem={({ item, index }) => {
                let photoRef = item.pins[0].properties.photoReference[0];
                return (<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('PathDetail', {
                  markers: item.pins,
                  name: item.name
                })}>
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
                </TouchableWithoutFeedback>);
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
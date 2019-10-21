
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, FlatList, Image } from 'react-native';
import * as firebase from 'firebase';

import globalStyles, { DARKER_GREY, GREY, ACCENT_GREEN } from '../config/styles.js';
import { SERVER_ADDR, PLACE_ID, PHOTO_REFERENCE, MAPS_API_KEY } from '../config/settings.js';
import PathCard from '../components/PathCard.js';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
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
    width: '100%'
  },
  sectionHeader: {
    fontSize: 12,
    marginBottom: 5,
    color: DARKER_GREY
  },
  image: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center'
  }
});

class ExploreScreen extends Component {

  state = {
    routes: null,
    photoReference: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${PHOTO_REFERENCE}&maxheight=800&maxWidth=800`
  };

  componentDidMount() {
    firebase.auth().currentUser.getIdToken().then(token => {
      console.log('token: ', token);
      
      fetch(`${SERVER_ADDR}/cities/${PLACE_ID}/routes`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: 'Bearer '.concat(token)
        }
      })
        .then(response => response.json())
        .then(responseJson => this.setState({routes: responseJson}))
        .catch(error => console.error(error));
      }
    );
  }

  render() {
    return (
     <View style={styles.container}>
        <Image source={{uri: this.state.photoReference}} style={{width: '100%', height: 200}} />
        <Text style={{...globalStyles.text, fontSize: 18, marginBottom: 5}}>Explore Atlanta!</Text>
        <View style={styles.sectionContainer}>
          <FlatList
            data={this.state.routes}
            renderItem={({ item }) => {
              let photoRef = item.pins[0].properties.photoReference[0] === 'String' ? PHOTO_REFERENCE : item.pins[0].properties.photoReference[0];
              return (<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('PathDetail', {
                markers: item.pins,
                name: item.name
              })}>
                <PathCard
                  title={item.name}
                  photoReference={`https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${photoRef}&maxheight=800&maxWidth=800`}
                  onPress={() => props.onPressItem(item)}
                />
              </TouchableWithoutFeedback>);
            }}
            keyExtractor={item => item.place_id}
            contentContainerStyle={{alignItems: 'center', width: '100%', backgroundColor: 'transparent'}} />
        </View>
      </View>
    );
  }
}

export default ExploreScreen;
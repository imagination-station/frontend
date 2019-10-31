import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text, StatusBar, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';

import { DARKER_GREY, GREY, ACCENT_GREEN, HOF } from '../config/styles.js';
import { SERVER_ADDR, PLACE_ID, PHOTO_REFERENCE, MAPS_API_KEY, UID } from '../config/settings.js';
import PathCard from '../components/PathCard.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight
  },
  sectionContainer: {
    backgroundColor: 'white',
    width: '100%'
  },
  headerFocused: {
    fontSize: 34,
    paddingLeft: 12
  },
  headerBlurred: {
    fontSize: 28,
    paddingLeft: 12,
    color: DARKER_GREY
  }
});

class CollectionsScreen extends Component {

  state = {
    routes: null
  };

  componentDidMount() {
    // firebase.auth().currentUser.getIdToken().then(token => {
    //   fetch(`${SERVER_ADDR}/users/${UID}/forks`, {
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
        <View style={styles.sectionContainer}>
          <View style={{flexDirection: 'row', paddingTop: 30, paddingLeft: 7, alignItems: 'flex-end'}}>
            <Text style={styles.headerFocused}>My Trips</Text>
            <Text style={styles.headerBlurred}>Saved</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Map')}>
              <Text style={styles.headerBlurred}>New</Text>
            </TouchableOpacity>
          </View>
          {this.state.routes ? <FlatList
            data={this.state.routes}
            renderItem={({ item, index }) => {
              let photoRef = item.pins[0].properties.photoRefs[0] === 'String' ? PHOTO_REFERENCE : item.pins[0].properties.photoRefs[0];
              return (
                <PathCard
                  title={item.name}
                  photoReference={`https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${photoRef}&maxheight=800&maxWidth=800`}
                  onPress={() => this.props.navigation.navigate('PathDetail', {
                    markers: item.pins,
                    name: item.name
                  })}
                />
              );
            }}
            keyExtractor={item => item.place_id}
            contentContainerStyle={{alignItems: 'center', width: '100%', backgroundColor: 'transparent'}} /> : 
            <Text style={{padding: 30, alignSelf: 'center', color: HOF}}>Wow, so empty :)</Text>}
        </View>
      </View>
    );
  }
}

export default CollectionsScreen;

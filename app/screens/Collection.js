import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import * as firebase from 'firebase';

import { DARKER_GREY, GREY, ACCENT_GREEN, HOF } from '../config/styles.js';
import { SERVER_ADDR, PLACE_ID, PHOTO_REFERENCE, MAPS_API_KEY, UID } from '../config/settings.js';
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
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: GREY,
    padding: 15
  }
});

class CollectionScreen extends Component {

  state = {
    routes: null
  };

  componentDidMount() {
    firebase.auth().currentUser.getIdToken().then(token => {
      fetch(`${SERVER_ADDR}/users/${UID}/forks`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: 'Bearer '.concat(token)
        }
      })
        .then(response => response.json())
        .then(responseJson => this.setState({
          routes: responseJson
        }))
        .catch(error => console.error(error));
      }
    );
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <Text style={{fontSize: 30, padding: 10}}>Saved</Text>
          {this.state.responseJson ? <FlatList
            data={this.state.routes}
            renderItem={({ item, index }) => {
              let photoRef = item.pins[0].properties.photoReference[0] === 'String' ? PHOTO_REFERENCE : item.pins[0].properties.photoReference[0];
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
            <Text style={{padding: 10, alignSelf: 'center', color: HOF}}>Wow, so empty</Text>}
        </View>
      </View>
    );
  }
}

export default CollectionScreen;

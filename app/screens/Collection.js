import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import * as firebase from 'firebase';

import { DARKER_GREY, GREY, ACCENT_GREEN } from '../config/styles.js';
import { SERVER_ADDR, PLACE_ID, PHOTO_REFERENCE, MAPS_API_KEY } from '../config/settings.js';
import PathCard from '../components/PathCard.js';
import { LongButton } from '../components/Buttons.js';

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
    routes: null,
    // simulate likes & bookmarks
    likes: null,
    bookmarks: null,
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
        .then(responseJson => this.setState({
          routes: responseJson,
          likes: new Array(responseJson.length),
          bookmarks: new Array(responseJson.length)
        }))
        .catch(error => console.error(error));
      }
    );
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <LongButton
            title='New path'
            icon='add'
            onPress={() => this.props.navigation.navigate('Map')}
            style={styles.buttonStyle}
            textStyle={{marginLeft: 40}}
          />
          <FlatList
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
                  liked={this.state.likes[index]}
                  bookmarked={this.state.bookmarks[index]}
                  onLike = {() => {
                    let likes = [...this.state.likes];
                    likes[index] = !this.state.likes[index];
                    this.setState({likes: likes});
                  }}
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
      </View>
    );
  }
}

export default CollectionScreen;

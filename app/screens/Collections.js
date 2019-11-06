import React, { Component, Fragment } from 'react';
import { View, StyleSheet, FlatList, Text, StatusBar, TouchableOpacity, SafeAreaView } from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import { DARKER_GREY, GREY } from '../config/styles.js';
import { SERVER_ADDR, MAPS_API_KEY } from '../config/settings.js';
import RouteCard from '../components/RouteCard.js';

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
  },
  safeArea: {
    flex: 1,
    backgroundColor: GREY
  },
  safeStatusArea: {
    flex: 0,
    backgroundColor: '#fff'
  }
});

class CollectionsScreen extends Component {

  state = {
    routes: []
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
        routes: responseJson
      }))
      .catch(error => console.error(error));
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView style={styles.safeStatusArea} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.sectionContainer}>
              <View style={{flexDirection: 'row', paddingTop: 30, paddingLeft: 7, alignItems: 'flex-end'}}>
                <Text style={styles.headerFocused}>My Trips</Text>
                <Text style={styles.headerBlurred}>Saved</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Map')}>
                  <Text style={styles.headerBlurred}>New</Text>
                </TouchableOpacity>
              </View>
              {this.state.routes.length != 0 ? <FlatList
                data={this.state.routes}
                renderItem={({ item }) => {
                  const photoRef = item.pins[0].properties.photoRefs[0];
                  return (
                    <RouteCard
                      title={item.name}
                      photoRef={`https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${photoRef}&maxheight=800&maxWidth=800`}
                      onPress={() => this.props.navigation.navigate('PathDetail', {
                        markers: item.pins,
                        name: item.name
                      })}
                    />
                  );
                }}
                keyExtractor={item => item._id}
                contentContainerStyle={{alignItems: 'center', width: '100%', backgroundColor: 'transparent'}}/> :
                <Text style={{padding: 30, alignSelf: 'center', color: DARKER_GREY}}>Wow, so empty :)</Text>}
            </View>
          </View>
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
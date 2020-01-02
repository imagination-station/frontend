
import React, { Component, Fragment } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import { ACCENT, GREY } from '../config/styles.js';
import { TEST_SERVER_ADDR } from '../config/settings.js';

// dimensions of the screen
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30
  },
  textBox: {
    height: 45,
    width: width - 70, // 70 = width of paddingHorizontal + width of icon
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
    fontSize: 16
  },
  listContainer: {
    width: '100%',
    height: '40%',
  },
  nextButton: {
    backgroundColor: ACCENT,
    borderRadius: 45 / 2,
    marginRight: 10
  },
  nextButtonDisabled: {
    backgroundColor: GREY,
    borderRadius: 45 / 2,
    marginRight: 10
  }
});

function SearchItem(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={{paddingVertical: 15}}>
        <Text style={{fontSize: 16}}>{props.item.matching_full_name}</Text>
    </TouchableOpacity>
  );
}

class Location extends Component {

  static navigationOptions = () => {
    return {
      header: null
    };
  }

  state = {
    textInput: '',
    results: [],
    location: null,
    autoDetectionHandled: false,
    snappedToCity: false,
  }

  SEARCH_TIMEOUT = 100; // ms

  constructor(props) {
    super(props);
    this.props.navigation.state.key = 'Location';
  } 

  componentDidMount() {
    this.searchTimer = null;

    // get city based on user's current location
    if (this.props.purpose == 'UPDATE_USER') {
      navigator.geolocation.getCurrentPosition(
        position => {
          let latitude = JSON.stringify(position.coords.latitude);
          let longitude = JSON.stringify(position.coords.longitude);

          fetch(`https://api.teleport.org/api/locations/${latitude},${longitude}/`)
            .then(response => response.json())
            .then(responseJson => fetch(responseJson._embedded['location:nearest-cities'][0]._links['location:nearest-city'].href))
            .then(response => response.json())
            .then(responseJson => {
              this.setState({
                location: responseJson,
                autoDetectionHandled: true,
                snappedToCity: true,
                textInput: responseJson.full_name
              });
            });
        },
        err => {
          console.log(err);
        }
      );
    } else {
      this.setState({autoDetectionHandled: true});
    }
  }

  onChangeText = text => {
    this.setState({textInput: text});
    if (!this.searchTimer && text !== '') {
      this.searchTimer = setTimeout(() => {
        fetch(`https://api.teleport.org/api/cities/?search=${this.state.textInput.replace(' ', '%20')}`)
          .then(response => response.json())
          .then(responseJson => this.setState({
            results: responseJson._embedded['city:search-results'],
            snappedToCity: false
          }));
        this.searchTimer = null;
      }, this.SEARCH_TIMEOUT);
    }
  }

  onPressSearchItem = item => {
    fetch(item._links['city:item'].href)
    .then(response => response.json())
    .then(responseJson => {
      this.setState({
        location: responseJson,
        textInput: responseJson.full_name,
        snappedToCity: true
      });
    });
  }

  onPressNext = () => {
    if (this.props.purpose == 'UPDATE_USER') {
      firebase.auth().currentUser.getIdToken()
        .then(token =>
          fetch(`${TEST_SERVER_ADDR}/api/users/${this.props.user._id}`, {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              location: this.state.location.geoname_id
            })
          })
        )
        .then(response => {
          if (response.ok) {
            return firebase.auth().currentUser.getIdToken();
          }
        })
        .then(token =>
          fetch(`${TEST_SERVER_ADDR}/api/users/${this.props.user._id}`, {
            headers: {
              Accept: 'application/json',
              'Content-type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
        )
        .then(response => response.json())
        .then(responseJson => {
          this.props.setUser(responseJson);
          this.props.navigation.navigate('Interests');
        })
        .catch(error => console.error(error));
    } else if (this.props.purpose == 'CREATE_ROUTE') {
      this.props.loadRoute({
        name: '',
        creator: this.props.user,
        location: {
          fullName: this.state.location.full_name,
          name: this.state.location.name,
          coordinates: [
            this.state.location.location.latlon.latitude,
            this.state.location.location.latlon.longitude
          ],
          _id: this.state.location.geoname_id,
        },
        pins: [],
        tags: [],
        collaborators: []
      });
      this.props.navigation.navigate('RouteDetails', {new: true});
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name='keyboard-arrow-left' size={45} />
          </TouchableOpacity>
          <TouchableOpacity
            style={this.state.snappedToCity ? styles.nextButton : styles.nextButtonDisabled}
            disabled={!this.state.snappedToCity}
            onPress={this.onPressNext}
          >
            <Icon
              name='keyboard-arrow-right'
              size={45}
              color={'white'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={{marginBottom: 5}}>
            {this.props.purpose == 'CREATE_ROUTE' ?
              <Text style={{fontSize: 32, fontWeight: 'bold', marginBottom: 5}}>
                Where are you{`\n`}going?
              </Text> :
              <Fragment>
                <Text style={{fontSize: 32, fontWeight: 'bold', marginBottom: 5}}>
                  Where do you{'\n'}live?
                </Text>
                <Text style={{fontSize: 14}}>
                  As a local, your content will be prioritized{'\n'}
                  in you own city.
                </Text>
              </Fragment>
            }
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              autoFocus
              style={{...styles.textBox, color: this.state.snappedToCity ? ACCENT : 'black'}}
              placeholder={this.state.autoDetectionHandled ? 'Search for a city' : 'Getting your city...'}
              onChangeText={this.onChangeText}
              value={this.state.textInput}
            />
            {this.state.autoDetectionHandled ?
              <Icon name='search' size={30} /> :
              <ActivityIndicator size='small' />
            }
          </View>
          <View style={styles.listContainer}>
            <FlatList
              data={this.state.results}
              renderItem={({ item }) => <SearchItem
                item={item}
                // navigation passed in to pop from search page
                onPress={() => this.onPressSearchItem(item)}
              />}
              keyExtractor={item => item._links['city:item'].href}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
}

const mapDispatchToProps = dispatch => {
  return {
    loadRoute: route => dispatch({type: 'LOAD_ROUTE', payload: {
      route: route,
    }}),
    setUser: user => {
      dispatch({type: 'SET_USER', payload: {
        user: user,
      }});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Location);

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import { GREY, PRIMARY, ACCENT } from '../config/styles.js';
import { TEST_SERVER_ADDR } from '../config/settings.js';

const styles = StyleSheet.create({
  button: { 
    color: ACCENT,
    fontSize: 18,
    paddingHorizontal: 7,
    marginRight: 10,
    opacity: 1
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  textBoxContainer: {
    backgroundColor: GREY,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: '2.5%',
    borderRadius: 10
  },
  textBox: {
    height: 46,
    width: '90%',
    paddingLeft: 10
  },
  listContainer: {
    width: '100%',
    height: '50%',
    marginTop: 15
  },
  autoCompleteItem: {
    borderColor: GREY,
    borderBottomWidth: 1,
    padding: 15
  },
  mainText: {
    fontSize: 16
  },
});

function SearchBox(props) {
  return (
    <View style={styles.textBoxContainer}>
      <TextInput
        style={{...styles.textBox, color: props.snappedToCity ? ACCENT : 'black'}}
        placeholder={props.autoDetectionHandled ? 'Search for a city': 'Getting your city...'}
        value={props.textInput}
        onChangeText={props.onChangeText}
        editable={props.autoDetectionHandled}
      />
      {props.autoDetectionHandled ? <TouchableOpacity onPress={props.onClearText}>
        <Icon name='clear' size={30} color='grey' />
      </TouchableOpacity>
      : <ActivityIndicator size='small' color='grey' />}
    </View>
  );
}

function SearchItem(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.autoCompleteItem}>
        <Text style={styles.mainText}>{props.item.matching_full_name}</Text>
      </View>
    </TouchableOpacity>
  );
}

class Location extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={{fontSize: 20, marginLeft: 10}}>Location</Text>,
      headerRight: () => (
        <TouchableOpacity
          disabled={!navigation.getParam('snappedToCity')}
          onPress={navigation.getParam('onPressNext')}
        >
          {/* make Next button opaque until city is chosen */}
          <Text style={{...styles.button, opacity: navigation.getParam('snappedToCity') ? 1 : 0.3}}>Next</Text>
        </TouchableOpacity>
      )
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
    this.props.navigation.setParams({
      snappedToCity: false,
      onPressNext: this.onPressNext
    });

    // get city based on user's current location
    if (this.props.purpose == 'UPDATE_USER') {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = JSON.stringify(position.coords.latitude);
          const longitude = JSON.stringify(position.coords.longitude);

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
              this.props.navigation.setParams({snappedToCity: true});
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
    this.props.navigation.setParams({snappedToCity: false});
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

  onClearText = () => {
    this.props.navigation.setParams({snappedToCity: false});
    this.setState({
      textInput: '',
      results: [],
      snappedToCity: false
    });
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
      this.props.navigation.setParams({snappedToCity: true, location: responseJson});
    });
  }

  onPressNext = () => {
    if (this.props.purpose == 'UPDATE_USER') {
      firebase.auth().currentUser.getIdToken().then(token =>
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
          this.props.navigation.navigate('Interests');
        })
        .catch(error => console.error(error));
    } else if (this.props.purpose == 'CREATE_ROUTE') {
      this.props.loadRoute({
        name: '',
        creator: this.props.user._id,
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
        tags: []
      });
      this.props.navigation.navigate('RouteDetail', {new: true});
    }
  }

  render() {
    let message;
    if (this.props.purpose == 'CREATE_ROUTE') {
      message = (
        <View style={{width: '90%', marginVertical: 10, marginHorizontal: '5%'}}>
          <Text style={{fontSize: 32, color: 'grey'}}>Where are you going?</Text>
        </View>
      );
    } else {
      message = (
        <View style={{width: '90%', marginVertical: 10, marginHorizontal: '5%'}}>
          <Text style={{fontSize: 32, color: 'grey'}}>Hello!</Text>
          <Text style={{fontSize: 32, color: 'grey'}}>Where do you live?</Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Icon name='help-outline' size={20} color={PRIMARY} style={{marginRight: 5}}/>
            <Text>Your content will receive priority in your city.</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {message}
        <SearchBox
          autoDetectionHandled={this.state.autoDetectionHandled}
          snappedToCity={this.state.snappedToCity}
          textInput={this.state.textInput}
          onChangeText={this.onChangeText}
          onClearText={this.onClearText}
        />
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
    }})
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Location);
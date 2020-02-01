
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

class RouteCreator extends Component {

  static navigationOptions = () => {
    return {
      header: null
    };
  }

  state = {
    name: '',
    locationInput: '',
    results: [],
    location: null,
    snappedToCity: false,
  }

  SEARCH_TIMEOUT = 100; // ms

  constructor(props) {
    super(props);
    this.props.navigation.state.key = 'Location';
  } 

  componentDidMount() {
    // Timer state machine
    this.searchTimer = null;
    // this is to let Collections 
    this.props.setRefresh();
  }

  onChangeLocationInput = text => {
    this.setState({locationInput: text});
    if (!this.searchTimer && text !== '') {
      this.searchTimer = setTimeout(() => {
        fetch(`https://api.teleport.org/api/cities/?search=${this.state.locationInput.replace(' ', '%20')}`)
          .then(response => response.json())
          .then(responseJson => this.setState({
            results: responseJson._embedded['city:search-results'].slice(0, 5),
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
        locationInput: responseJson.full_name,
        results: [],
        snappedToCity: true
      });
    });
  }

  nextDisabled = () => {
    return this.state.name == '' || !this.state.snappedToCity;
  }

  onPressNext = () => {
    firebase.auth().currentUser.getIdToken().then(token =>	
      fetch(`${TEST_SERVER_ADDR}/api/routes/saved`, {	
          method: 'POST',	
          headers: {	
            Accept: 'application/json',	
            'Content-type': 'application/json',	
            Authorization: `Bearer ${token}`	
          },	
          body: JSON.stringify({	
            name: this.state.name,	
            creator: this.props.user._id,	
            city: this.state.location.geoname_id,
            pins: []			
          })	
      })	
    )
      .then(response => response.json())
      .then(responseJson => {
        this.props.loadRoute({
          _id: responseJson.id,
          name: this.state.name,
          creator: this.props.user,
          city: {
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
        // Let collections know to re-fetch
        this.props.setRefresh();
        this.props.navigation.navigate('RouteDetails');
      })
      .catch(error => console.error(error));	
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name='keyboard-arrow-left' size={45} />
          </TouchableOpacity>
          <TouchableOpacity
            style={this.nextDisabled() ? styles.nextButtonDisabled : styles.nextButton}
            disabled={this.nextDisabled()}
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
          <View style={{marginBottom: 50}}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Trip name</Text>
            <TextInput
              autoFocus
              style={styles.textBox}
              placeholder={'Barcelona Getaway'}
              onChangeText={text => this.setState({name: text})}
              value={this.state.name}
            />
          </View>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>Where to?</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={{...styles.textBox, color: this.state.snappedToCity ? ACCENT : 'black'}}
              placeholder='Search for a city'
              onChangeText={this.onChangeLocationInput}
              value={this.state.locationInput}
            />
            <Icon name='search' size={30} />
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
    setRefresh: () => dispatch({type: 'SET_REFRESH', payload: {
      refresh: true
    }})
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteCreator);
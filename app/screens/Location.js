
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Button from '../components/Buttons.js';
import { GREY, DARKER_GREY, PRIMARY, ACCENT } from '../config/styles.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  textBoxContainer: {
    backgroundColor: GREY,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '2.5%',
  },
  textBox: {
    height: 46,
    width: '90%',
    paddingLeft: 10,
  },
  list: {
    height: '50%',
    width: '100%',
    borderTopWidth: 5,
    borderColor: GREY,
    paddingHorizontal: '2.5%',
  },
  autoCompleteItem: {
    borderColor: GREY,
    borderBottomWidth: 1,
    padding: 10
  },
  mainText: {
    fontSize: 16,
  },
  secondaryText: {
    fontSize: 10,
    color: 'grey'
  }
});

class CitySearch extends Component {
  state = {
    textInput: this.props.searchInput,
    results: null
  };

  SEARCH_TIMEOUT = 100; // ms

  componentWillMount() {
    this.searchTimer = null;
  }

  componentDidMount() {
    if (this.state.textInput) {
      fetch(`https://api.teleport.org/api/cities/?search=${this.state.textInput.replace(' ', '%20')}`)
        .then(response => response.json())
        .then(responseJson => this.setState({results: responseJson._embedded['city:search-results']}));
    }
  }

  onChangeText = text => {
    this.setState({textInput: text});
    if (!this.searchTimer && text !== '') {
      this.searchTimer = setTimeout(() => {
        fetch(`https://api.teleport.org/api/cities/?search=${this.state.textInput.replace(' ', '%20')}`)
          .then(response => response.json())
          .then(responseJson => this.setState({results: responseJson._embedded['city:search-results']}));
        this.searchTimer = null;
      }, this.SEARCH_TIMEOUT);
    }
  }

  render() {
    return (
      <View style={searchStyles.container}>
        <View style={searchStyles.textBoxContainer}>
          <TextInput
            autoFocus
            style={searchStyles.textBox}
            placeholder='Search'
            value={this.state.textInput}
            onChangeText={this.onChangeText}
          />
          <TouchableOpacity onPress={() => this.setState({textInput: ''})}>
            <Icon name='clear' size={30} />
          </TouchableOpacity>
        </View>
        <View style={searchStyles.list}>
          <FlatList
            data={this.state.results}
            renderItem={({ item }) => <SearchItem
              item={item}
              // navigation passed in to pop from search page
              onPress={() => this.props.onPressItem(item, this.props.navigation)}
            />}
            keyExtractor={item => item._links['city:item'].href}
          />
        </View>
      </View>
    );
  }
}

function SearchItem(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={searchStyles.autoCompleteItem}>
        <Text style={searchStyles.mainText}>{props.item.matching_full_name}</Text>
      </View>
    </TouchableOpacity>
  );
}


class Location extends Component {

  static navigationOptions = {
    headerTitle: () => <Text style={{fontSize: 20, marginLeft: 10}}>Sign up</Text>,
    headerRight: () => (
      <Button title='Next' />
    )
  };

  state = {
    textInput: '',
    location: null,
    autoDetectionHandled: false
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);

        fetch(`https://api.teleport.org/api/locations/${latitude},${longitude}/`)
          .then(response => response.json())
          .then(responseJson => fetch(responseJson._embedded['location:nearest-cities'][0]._links['location:nearest-city'].href))
          .then(response => response.json())
          .then(responseJson => this.setState({
            location: responseJson,
            autoDetectionHandled: true,
            textInput: responseJson.full_name
          }));
      },
      err => {
        console.log(err);
      }
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={searchStyles.textBoxContainer}>
          <TextInput
            style={searchStyles.textBox}
            placeholder={this.state.autoDetectionHandled ? 'Search': 'Getting your city...'}
            value={this.state.textInput}
            onChangeText={this.onChangeText}
            editable={this.state.autoDetectionHandled}
          />
          {this.state.autoDetectionHandled ? <TouchableOpacity onPress={() => this.setState({textInput: ''})}>
            <Icon name='clear' size={30} />
          </TouchableOpacity>
          : <ActivityIndicator size='small' color='black' />}
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 24, marginBottom: 5, marginTop: 100}}>Where do you live?</Text>
          {/* <Text style={{fontSize: 16}}>Your content will receive priority in the city you live in.</Text> */}
        </View>
      </View>
    );
  }
}

export default Location;

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  FlatList,
  Platform,
  Slider,
  PixelRatio,
  ActivityIndicator
} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TimePicker from 'react-native-simple-time-picker';
import { LinearGradient } from 'expo-linear-gradient';

import RouteCard from '../components/RouteCard.js';

import { GREY, DARKER_GREY, PRIMARY, ACCENT } from '../config/styles.js';
import { SERVER_ADDR, PLACE_ID, GEONAME_ID, MAPS_API_KEY, TAGS } from '../config/settings.js';

const {width, height} = Dimensions.get('window');

const CITY_IMG_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
const CITY_IMG_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height / 2);

const METERS_TO_MILES = 1609.34;
const SECONDS_TO_MINUTES = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  sectionContainer: {
    backgroundColor: 'white',
    width: '100%',
    paddingTop: 7
  },
  sectionHeader: {
    fontSize: 12,
    marginBottom: 5,
    color: DARKER_GREY
  },
  imageText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 48,
    width: width
  },
  cityImage: {
    height: height / 2,
    resizeMode: 'cover'
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  endPadding: {
    flexGrow: 1
  },
  searchBoxContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    height: 46,
    borderRadius: 15,
    width: '90%',
    top: Platform.OS === 'ios' ? 45 : 10 + StatusBar.currentHeight,
    marginHorizontal: '5%',
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5
  },
  searchBox: {
    backgroundColor: 'transparent',
    height: 46,
    paddingHorizontal: 10,
    width: '80%',
    color: 'grey'
  },
});

const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '2.5%',
    paddingTop: 10
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
    padding: 15
  },
  mainText: {
    fontSize: 16,
  },
  secondaryText: {
    fontSize: 10,
    color: 'grey'
  }
});

const filterStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16
  },
  textCon: {
    width: 320,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
            <Icon name='search' size={30} />
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

class RouteFilter extends Component {
  state = {
    selectedHours: Math.floor(this.props.time / 60),
    selectedMinutes: this.props.time - (60 * Math.floor(this.props.time / 60)),
    selectedDistance: this.props.distance,
    minimumDistance: this.props.minimumDistance,
    maximumDistance: this.props.maximumDistance
  };

  render() {
    const { selectedHours, selectedMinutes } = this.state;
    const left = this.state.selectedDistance * (width - 55)/21 - 75;
    return(
      <View style={filterStyles.container}>
        <Text style={{fontWeight: 'bold'}}>Time Filter</Text>
        <Text>{selectedHours} hr : {selectedMinutes} min</Text>
        <TimePicker
          style={{height: 50}}
          selectedHours={selectedHours}
          selectedMinutes={selectedMinutes}
          onChange={(hours, minutes) => {
            this.setState({ selectedHours: hours, selectedMinutes: minutes });
            this.props.filterTime(hours * 60 + minutes);
          }}
        />
        <Text style={{fontWeight: 'bold'}}>Distance Filter</Text>
        <Slider
          style={{width: 200, height: 50}}
          minimumValue={this.state.minimumDistance}
          maximumValue={this.state.maximumDistance}
          minimumTrackTintColor='#eb8993'
          maximumTrackTintColor='#577590'
          step={0.25}
          value={this.state.selectedDistance}
          onValueChange={distance => {
            let dist = distance.toFixed(2);
            this.setState({selectedDistance: dist});
            this.props.filterDistance(dist);
          }}
        />
        <View style={styles.textCon}>
          <Text style={{color: '#eb8993', left: left}}>{this.state.selectedDistance + ' mi'}</Text>
        </View>
      </View>
    )
  }
}

function SearchBox(props) {
  return (
    <View style={styles.searchBoxContainer}>
      <TextInput
        style={styles.searchBox}
        placeholderTextColor = 'rgba(0, 0, 0, 0.7)'
        placeholder='Try "Barcelona"'
        onTouchEnd={props.onPress}
      />
    </View>
  )
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

class ExploreScreen extends Component {

  state = {
    city: null,
    photoUri: '',
    searchInput: '',
    refreshing: false,
    loaded: false
  };

  componentDidMount() {
    this.scrollValue = new Animated.Value(0);

    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      /* fetch city by user location (lat, lng) via Telepoort first,
         then fetch Google placeId using city's full name.

         Once placeId is found, use that to get city image
       */
      fetch(`https://api.teleport.org/api/locations/${lat},${lng}`)
        .then(response => response.json())
        .then(responseJson => {
          const url = responseJson._embedded['location:nearest-cities'][0]._links['location:nearest-city'].href;
          return fetch(url);
        })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({city: responseJson});
          this.fetchCityImage(responseJson);
        });
    });
  }

  fetchCityImage = city => {
    // try to fetch image from Teleport first (sometimes slow)
    if (city._links['city:urban_area']) {
      fetch(city._links['city:urban_area'].href + 'images/')
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.photos[0].image.mobile) {
            this.setState({
              photoUri: responseJson.photos[0].image.mobile,
              loaded: true
            });
          }
        });
      return;
    }

    // if no image found, try Google
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city.full_name}&key=${MAPS_API_KEY}`)
      .then(response => response.json())
      .then(responseJson => {
        const placeId = responseJson.results[0].place_id;
        return fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${MAPS_API_KEY}`);
      })
      .then(response => response.json())
      .then(responseJson => {
        const ref = responseJson.result.photos[0].photo_reference;

        this.setState({
          photoUri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${ref}&maxheight=${CITY_IMG_HEIGHT}&maxWidth=${CITY_IMG_WIDTH}`,
          loaded: true
        });
      });
  }

  onRefresh() {
    console.log('refreshed!');
  }

  onPressSearch = () => {
    this.props.navigation.navigate('CitySearch', {
      searchInput: this.state.searchInput,
      onPressItem: this.onPressSearchItem,
    });
  }

  onPressSearchItem = (item, navigation) => {
    this.setState({loaded: false}, () => {
      navigation.goBack();
      fetch(item._links['city:item'].href)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({city: responseJson});
          this.fetchCityImage(responseJson);
        });
    });
  }

  render() {
    if (!this.state.loaded) {
      return (
        <View style={{...styles.container, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size='large' color={PRIMARY} />
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)} />
        }
      >
        <SearchBox onPress={this.onPressSearch} />
        <View>
          <Image
            source={{uri: this.state.photoUri}} 
            style={styles.cityImage}
            loadingIndicatorSource={require('../assets/placeholder.jpg')}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          <View style={{paddingLeft: 10, position: 'absolute', bottom: 10}}>
            <Text style={styles.imageText}>
              {this.state.loaded ? this.state.city.name : 'Loading...'}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.userId,
    latitude: state.latitude,
    longitude: state.longitude
  };
}

export const CitySearchScreen = connect(mapStateToProps)(CitySearch);
export const RouteFilterScreen = connect(mapStateToProps)(RouteFilter);
export default connect(mapStateToProps)(ExploreScreen);

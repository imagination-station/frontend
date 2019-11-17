
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
  StatusBar,
  FlatList,
  Platform,
  Slider
} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TimePicker from 'react-native-simple-time-picker';

import RouteCard from '../components/RouteCard.js';

import { GREY, DARKER_GREY, PRIMARY, ACCENT } from '../config/styles.js';
import { SERVER_ADDR, PLACE_ID, GEONAME_ID, MAPS_API_KEY } from '../config/settings.js';

const {width, height} = Dimensions.get('window');

const METERS_TO_MILES = 1609.34;
const SECONDS_TO_MINUTES = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionContainer: {
    backgroundColor: 'white',
    width: '100%',
    paddingTop: 20
  },
  sectionHeader: {
    fontSize: 12,
    marginBottom: 5,
    color: DARKER_GREY
  },
  imageContainer: {
    height: Math.floor(height / 2)
  },
  imageText: {
    color: 'white',
    fontSize: 48,
  },
  image: {
    height: Math.floor(height / 2),
    resizeMode: 'cover'
  },
  endPadding: {
    flexGrow: 1
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBoxContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flexDirection: 'row',
    height: 46,
    borderRadius: 10,
    width: '95%',
    top: Platform.OS === 'ios' ? 45 : 10 + StatusBar.currentHeight,
    marginHorizontal: '2.5%',
    position: 'absolute',
    alignItems: 'center',
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
    alignItems: 'center'
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

class RouteFilter extends Component {
  state = {
    selectedHours: Math.floor(this.props.time / 60),
    selectedMinutes: this.props.time - (60 * Math.floor(this.props.time / 60)),
    selectedDistance: this.props.distance,
    minimumDistance: this.props.minimumDistance,
    maximumDistance: this.props.maximumDistance
  };

  componentWillMount() {
    console.log('will mount');
  }

  componentDidMount() {
    console.log('didMount');
  }

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

function SearchItem(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={searchStyles.autoCompleteItem}>
        <Text style={searchStyles.mainText}>{props.item.matching_full_name}</Text>
      </View>
    </TouchableOpacity>
  );
}

function CityImage(props) {
  return (
    <View style={styles.imageContainer}>
      <Image source={{uri: props.uri}} style={styles.image} />
        <View style={styles.searchBoxContainer}>
          <TextInput
            style={styles.searchBox}
            placeholder='Try "Barcelona"'
            onTouchEnd={props.onPressSearchBox}
          />
          <TouchableOpacity onPress={this.onClearSearch}>
            <Icon name='clear' size={30} color='grey' />
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onPressFilter}>
            <Icon name='menu' size={30} color='grey' />
          </TouchableOpacity>
        </View>
        <View style={{paddingLeft: 10, position: 'absolute', bottom: 10}}>
          <Text style={{fontWeight: 'bold', color: PRIMARY}}>Welcome to</Text>
          <Text style={styles.imageText}>{props.title}</Text>
        </View>
    </View>
  );
}

class ExploreScreen extends Component {

  state = {
    routes: [],
    // simulate bookmarks
    bookmarks: [],
    bookmarks_id: [],
    likes: [],
    refreshing: false,
    // hardcoded for Atlanta for now
    geonameid: GEONAME_ID,
    city: null,
    photoUri: '',
    searchInput: '',
    // filtering
    distance: [],
    time: [],
    filterByDistance: false,
    filterByTime: false,
    distanceFilterValue: 0,
    timeFilterValue: 0,
    minimumDistance: 0,
    maximumDistance: 10
  };

  componentDidMount() {
    this.scrollValue = new Animated.Value(0);
    fetch(`https://api.teleport.org/api/cities/geonameid:${this.state.geonameid}/`)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({city: responseJson});
        return fetch(responseJson._links['city:urban_area'].href + 'images/');
      })
      .then(response => response.json())
      .then(responseJson => this.setState({photoUri: responseJson.photos[0].image.mobile}));
    firebase.auth().currentUser.getIdToken().then(token =>
      fetch(`${SERVER_ADDR}/cities/${PLACE_ID}/routes`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    )
    .then(response => response.json())
    .then(responseJson => {
      this.setState({
        routes: responseJson,
        bookmarks: new Array(responseJson.length),
        bookmarks_id: new Array(responseJson.length),
        likes: new Array(responseJson.length),
        distance: new Array(responseJson.length).fill(0),
        time: new Array(responseJson.length).fill(0)
      });
      this.getDistanceAndTime();
    })
    .catch(error => console.error(error));
  }

  getData = () => {
    console.log('getting data');
    console.log(this.props.userId);
    console.log(this.props);
    if (this.props.userId == undefined) {
      return;
    }
    firebase.auth().currentUser.getIdToken().then(token =>
      fetch(`${SERVER_ADDR}/cities/${PLACE_ID}/routes`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    )
    .then(response => response.json())
    .then(responseJson => this.setState({
      routes: responseJson,
      bookmarks: new Array(responseJson.length),
      bookmarks_id: new Array(responseJson.length),
      likes: new Array(responseJson.length),
      distance: new Array(responseJson.length).fill(0),
      time: new Array(responseJson.length).fill(0)
    }))
    .catch(error => console.error(error));
    this.setState({refreshing: false});
  }

  getDistanceAndTime = () => {
    console.log('getting distance and time data');
    let fetches = [];
    for (let i = 0; i < this.state.routes.length; i++) {
      fetches.push([]);
      let markers = this.state.routes[i].pins;
      for (let j = 0; j < markers.length - 1; j++) {
        fetches[i].push(
          fetch(`https://maps.googleapis.com/maps/api/directions/json?key=${MAPS_API_KEY}&origin=place_id:${markers[j].properties.placeId}&destination=place_id:${markers[j+1].properties.placeId}&mode=walking`)
            .then(response => response.json())
        );
      }
      Promise.all(fetches[i])
        .then(responseJson => {
          let distance = 0;
          let time = 0;
          for (let k = 0; k < responseJson.length; k++) {
            distance += responseJson[k].routes[0].legs[0].distance.value;
            time += responseJson[k].routes[0].legs[0].duration.value;
          }
          distance /= METERS_TO_MILES;
          time /= SECONDS_TO_MINUTES;
          let distanceArray = [...this.state.distance];
          let timeArray = [...this.state.time];
          distanceArray[i] = distance;
          timeArray[i] = time;
          this.setState({
            distance: distanceArray,
            time: timeArray
          });
        });
    }
  }

  setDistanceLimit = (distance) => {
    this.setState({
      distanceFilterValue: distance,
      filterByDistance: true
    })
  }

  setTimeLimit = (time) => {
    this.setState({
      timeFilterValue: time,
      filterByTime: true
    })
  }

  onRefresh() {
    this.getData();
  }

  onPressFilter = () => {
    console.log(this.state.distance);
    this.props.navigation.navigate('RouteFilter', {
      filterDistance: this.setDistanceLimit,
      filterTime: this.setTimeLimit,
      time: this.state.timeFilterValue,
      distance: this.state.distanceFilterValue,
      minimumDistance: this.state.minimumDistance,
      maximumDistance: this.state.maximumDistance
    });
  }

  onPressSearch = () => {
    this.props.navigation.navigate('CitySearch', {
      searchInput: this.state.searchInput,
      onPressItem: this.onPressSearchItem,
    });
  }

  onPressSearchItem = (item, navigation) => {
    navigation.goBack();
    fetch(item._links['city:item'].href)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({city: responseJson});
        return fetch(responseJson._links['city:urban_area'].href + 'images/');
      })
      .then(response => response.json())
      .then(responseJson => this.setState({photoUri: responseJson.photos[0].image.mobile}));
  }

  render() {
    return (
    <ScrollView contentContainerStyle={styles.scrollView} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />}>
      <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
          <CityImage title={this.state.city ? this.state.city.name : 'Loading...'} uri={this.state.photoUri} onPressSearchBox={this.onPressSearch} onPressFilter={this.onPressFilter} />
          <View style={styles.sectionContainer}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 20}}>Art and Architecture</Text>
            <Animated.ScrollView
              contentContainerStyle={styles.endPadding}
              horizontal
              scrollEventThrottle={1}
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event([
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.scrollValue,
                    },
                  }
                }
              ], {useNativeDriver: true}
              )}
              style={{width: '100%', backgroundColor: 'transparent', paddingLeft: 10, marginBottom: 25}}
            >
              {this.state.routes.map((item, index) => {
                const timeCondition = this.state.filterByTime && this.state.timeFilterValue != 0 ? this.state.time[index] <= this.state.timeFilterValue : true;
                const distanceCondition = this.state.distanceFilterValue != this.state.maximumDistance && this.state.distanceFilterValue != this.state.minimumDistance ? this.state.distance[index] <= this.state.distanceFilterValue : true;
                if (timeCondition && distanceCondition) {
                  let photoRef = item.pins[0].properties.photoRefs[0];
                  return (
                    <RouteCard
                      key={item._id}
                      title={item.name}
                      photoRef={`https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${photoRef}&maxheight=800&maxWidth=800`}
                      onPress={() => this.props.navigation.navigate('RouteDetail', {
                        route: item
                      })}
                      bookmarked={this.state.bookmarks[index]}
                      liked={this.state.likes[index]}
                      onBookmark = {() => {
                        let bookmarks = [...this.state.bookmarks];
                        bookmarks[index] = !this.state.bookmarks[index];
                        this.setState({bookmarks: bookmarks});
                        let bookmarks_id = [...this.state.bookmarks_id];
                        let routeId = this.state.routes[index]._id;
                        console.log(`Route ID: ${routeId}`);
                        console.log(bookmarks);
                        if (bookmarks[index]) {
                          firebase.auth().currentUser.getIdToken().then(token =>
                            fetch(`${SERVER_ADDR}/users/${this.props.userId}/forks`, {
                              method: 'POST',
                              headers: {
                                Accept: 'application/json',
                                'Content-type': 'application/json',
                                Authorization: `Bearer ${token}`
                              },
                              body: JSON.stringify({
                                routeId: routeId,
                              })
                            })
                          )
                          .then(response => response.json())
                          .then(responseJson => {
                            let tempID = responseJson["Mongo ObjectID"];
                            bookmarks_id[index] = tempID;
                            this.setState({bookmarks_id: bookmarks_id});
                          })
                         } else {
                           let route_id = this.state.bookmarks_id[index];
                           console.log(`Deleting ${route_id}`);
                           firebase.auth().currentUser.getIdToken().then(token =>
                             fetch(`${SERVER_ADDR}/cities/routes/${route_id}`, {
                               method: 'DELETE',
                               headers: {
                                 Accept: 'application/json',
                                 'Content-type': 'application/json',
                                 Authorization: `Bearer ${token}`
                               }
                             }))
                             .then(response => response.json())
                             .then(responseJson => {
                               console.log(responseJson);
                             })
                        }
                      }}
                      onLike = {() => {
                        let likes = [...this.state.likes];
                        likes[index] = !this.state.likes[index];
                        this.setState({likes: likes});
                        let routeId = this.state.routes[index]._id;
                        console.log(`Route ID: ${routeId}`);
                        console.log(likes);
                        like = likes[index] ? "like" : "unlike";
                        console.log(like);
                        firebase.auth().currentUser.getIdToken().then(token =>
                          fetch(`${SERVER_ADDR}/cities/routes/${routeId}/likes`, {
                            method: 'PATCH',
                            headers: {
                              Accept: 'application/json',
                              'Content-type': 'application/json',
                              Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              type: like,
                              userId: this.props.userId
                            })
                          })
                        )
                        .then(response => response.text())
                        .then(responseText => {
                          console.log(responseText);
                        })
                      }}
                    />
                  );
                }
              })}
            </Animated.ScrollView>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 20}}>Foodie</Text>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.userId
  };
}

export const CitySearchScreen = connect(mapStateToProps)(CitySearch);
export const RouteFilterScreen = connect(mapStateToProps)(RouteFilter);
export default connect(mapStateToProps)(ExploreScreen);

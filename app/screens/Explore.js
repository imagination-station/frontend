
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
  Platform
} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import RouteCard from '../components/RouteCard.js';

import { GREY, DARKER_GREY, PRIMARY, MINT_CREAM } from '../config/styles.js';
import { SERVER_ADDR, PLACE_ID, GEONAME_ID, MAPS_API_KEY } from '../config/settings.js';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
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
  imageText: {
    color: 'black',
    fontSize: 40,
  },
  endPadding: {
    flexGrow: 1
  },
  scrollView: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBoxContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 46,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft: 20,
  },
  searchBox: {
    color: 'grey',
    marginLeft: 10,
    fontSize: 15
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
    routes: [],
    bookmarks: [],
    bookmarks_id: [],
    likes: [],
    refreshing: false,
    // hardcoded for Atlanta for now
    geonameid: GEONAME_ID,
    city: null,
    searchInput: ''
  };

  componentDidMount() {
    this.scrollValue = new Animated.Value(0);
    fetch(`https://api.teleport.org/api/cities/geonameid:${this.state.geonameid}/`)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({city: responseJson});
      })
      .catch(err => {
        console.log(error);
      });

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
      likes: new Array(responseJson.length)
    }))
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
      likes: new Array(responseJson.length)
    }))
    .catch(error => console.error(error));
    this.setState({refreshing: false});
  }

  onRefresh() {
      console.log('refreshing');
      this.getData();
  }

  onPressSearch = () => {
    this.props.navigation.navigate('CitySearch', {
      searchInput: this.state.searchInput,
      onPressItem: this.onPressSearchItem,
    });
  }

  onPressSearchItem = (item, navigation) => {
    fetch(item._links['city:item'].href)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({city: responseJson}, navigation.goBack);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={this.onPressSearch}>
            <View style={styles.searchBoxContainer}>
              <Icon name='search' size={30} color='grey' />
              <Text style={styles.searchBox}>Try "Barcelona"</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={{backgroundColor: MINT_CREAM, paddingLeft: 20, paddingTop: 50}}>
            <Text style={{fontWeight: 'bold', color: PRIMARY}}>EXPLORE CITY</Text>
            <Text style={styles.imageText}>{this.state.city ? this.state.city.name : ''}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 20}}>Nearby</Text>
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
                let photoRef = item.pins[0].properties.photoRefs[0];
                return (
                  <RouteCard
                    key={item._id}
                    title={item.name}
                    photoRef={`https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${photoRef}&maxheight=800&maxWidth=800`}
                    numLikes={item.numLikes}
                    onPress={() => this.props.navigation.navigate('RouteDetail', {
                      route: item
                    })}
                    bookmarked={this.state.bookmarks[index]}
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
                    }
                  }
                  />
                );
              })}
            </Animated.ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.userId
  };
}

export const CitySearchScreen = connect(mapStateToProps)(CitySearch);
export default connect(mapStateToProps)(ExploreScreen);
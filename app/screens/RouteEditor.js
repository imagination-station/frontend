import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Picker,
  Platform,
  PixelRatio
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Header } from 'react-navigation-stack';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
import resolveAssetSource from 'resolveAssetSource';

const pin =  require('../assets/pin.png'); 

const PIN_WIDTH = resolveAssetSource(pin).width;
const PIN_HEIGHT = resolveAssetSource(pin).width;
const PIXEL_RATIO = PixelRatio.get();

import Button from '../components/Buttons.js';
import globalStyles, { GREY, DARKER_GREY, PRIMARY, ACCENT } from '../config/styles.js';
import {
  MAPS_API_KEY,
  SERVER_ADDR,
  INIT_LOCATION,
  PLACE_ID,
  TAGS,
  PLACEHOLDER_IMG
} from '../config/settings.js';

// dimensions of the screen
const {width, height} = Dimensions.get('window');

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = Math.floor(width / 1.5);

const mapStyles = StyleSheet.create({
  searchBoxContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    height: 46,
    borderRadius: 10,
    width: '95%',
    top: 10,
    marginHorizontal: '2.5%',
    position: 'absolute',
    alignItems: 'center',
  },
  searchBox: {
    backgroundColor: 'transparent',
    height: 46,
    paddingHorizontal: 10,
    width: '90%',
    color: 'grey'
  },
  animated: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  drawer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  endPadding: {
    flexGrow: 1
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginBottom: 5,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
    borderRadius: 10,
    elevation: 0.2
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center'
  },
  textContent: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold'
  },
  cardDescription: {
    fontSize: 12,
    color: '#444'
  },
  cardButtonBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    padding: 10
  },
  filler: {
    backgroundColor: 'transparent',
    marginBottom: 5,
    height: CARD_HEIGHT,
    width: CARD_WIDTH / 4 - 10,
    overflow: 'hidden'
  },
  actionCardContent: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 50,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  focusedCard: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginBottom: 5,
    height: CARD_HEIGHT * 1.4,
    width: '90%',
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 7
  },
  drawerButton: {
    width: 50,
    height: 15,
    backgroundColor: '#e3e3e3',
    borderRadius: 15,
    marginBottom: 10
  },
  infoContainer: {
    flex: 2.4,
    width: width,
    alignItems: 'center'
  },
  nameBox: {
    borderWidth: 1,
    borderColor: DARKER_GREY,
    height: 46,
    paddingHorizontal: 10,
    width: '90%',
    borderRadius: 5
  },
  pin: {
    position: 'absolute',
    width: Math.floor(PIN_WIDTH / PIXEL_RATIO),
    height: Math.floor(PIN_HEIGHT / PIXEL_RATIO),
    justifyContent: 'center',
    alignItems: 'center'
  }
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

const noteEditorStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center'
  },
  editor: {
    width: '100%',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    alignSelf: 'flex-start',
    textAlignVertical: 'top',
    width: '100%'
  },
  charCount: {
    alignSelf: 'flex-start',
    color: DARKER_GREY
  }
});

// hardcoded dummy data; this is what the data will actually look like
const DATA = [
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [33.790648, -84.384635]
    },
    properties: {
      placeId: 'ChIJzal6QUUE9YgRYZqYJzKOXAo',
      mainText: 'Museum of Design Atlanta',
      secondaryText: 'Peachtree Street Northeast, Atlanta, GA, USA',
      photoRefs: [
        'CmRaAAAArfg8qF1oPtvFj18kTkcVbIDtR3Arm04aoHSbno1GNaeEOLANbECjkVf_4SmLdo7uVs7SfD71XjrSbMoEHBZm8EZc53WCXPxNlGxC6b2-DRqxRI0BEZrs5yXQ-HVTjObrEhD5ekbW-N2N1DCujiI1nYgXGhQXIEURuVaLx2_N_nZUGIpmiPyCSA',
        'CmRaAAAApMwKX8N6EhXmxuytk8uqqz4XZwQYDHVDgk8XMigwwu4MnSuGnbbnPb6fCp1LaiOJXkx61D1s7M4kdAibCTy4wug3MTpEFGOAT_wHao1B-2mTF3GTU6gWG-0agXGE2qzkEhCNWHKzJ-OHG2iKfjAhIDo0GhQnmSb2pTi3XIMz00TAXpbHPbvUrQ',
        'CmRaAAAA_RFTA6jpX2KiHBW7SWRCkzCYEUnb27xDvA2UZGAZtKvQLAZRT-zbHL4FRlAg86q6CalB-6C9PBGa5y8PLLEBzMSodtmQBeNwTjb4Zb6QDDY3qNo3eYWrV5I8XWZM2BGCEhB86xeYE6mruzEeiFC0xVx9GhQ2jqq80jNH_smOex63RQCmh-GkcA',
        'CmRaAAAAwpvEMIuqhMPV3zlYk3_1Lnurfv6G636fXQjgHnuySgie5_K-pIeS8FnPWcU0L4JlxeqZC480YtGR36KcuoAPE7H6rP03SAYNTAqwWNrbJm6v7_llTHMolcj5W0n_puDsEhAXbKPL8JBmkPzGNgImSjj6GhRbeGfEAc8-933-sM5tcHkDhA9TNA',
      ],
      note: 'Really cool museum! Would definitely recommend!',
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [33.7949046, -84.4147967]
    },
    properties: {
      placeId: 'ChIJr3p2s-cE9YgR2uIvhPLls3E',
      mainText: 'Urban Tree Cidery',
      secondaryText: 'Howell Mill Road Northwest, Atlanta, GA, USA',
      photoRefs: ['CmRaAAAAN1JSSlKydw6W6-7_eeuYOkJzvVBTW5LBaW0W1sxPnyhkZPKbP4PEbqoPXRU5Q9MHJXBOFzOEJl8KBvB64bI3xtnCOeh9RaUihdBq3-Bi3fOPopG33WVW8avzEZrJ0Dq-EhA4tZV5xpLQP_yEaMXFLzfOGhTeLYBn2z2mW3VmvlOCbUEucED2gg'],
      note: 'Chill, unpretentious vibes',
    }
  }
];

class MapSearch extends Component {
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
      fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${this.state.textInput}&key=${MAPS_API_KEY}&location=${INIT_LOCATION.latitude},${INIT_LOCATION.longitude}`)
        .then(response => response.json())
        .then(responseJson => this.setState({results: responseJson.predictions}));
    }
  }

  onChangeText = text => {
    this.setState({textInput: text});
    if (!this.searchTimer) {
      this.searchTimer = setTimeout(() => {
        fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${MAPS_API_KEY}&location=${INIT_LOCATION.latitude},${INIT_LOCATION.longitude}`)
          .then(response => response.json())
          .then(responseJson => this.setState({results: responseJson.predictions}));
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
            keyExtractor={item => item.place_id}
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
        <Text style={searchStyles.mainText}>{props.item.structured_formatting.main_text}</Text>
        <Text style={searchStyles.secondaryText}>{props.item.structured_formatting.secondary_text}</Text>
      </View>
    </TouchableOpacity>
  );
}

class NoteEditor extends Component {
  state = {
    note: this.props.markers[this.props.selected].properties.note 
  };

  MAX_LENGTH = 280; // same as Twitter

  render() {
    return (
      <View style={noteEditorStyles.container}>
        <View style={noteEditorStyles.editor}>
          <TextInput
            autoFocus
            multiline
            numberOfLines={10}
            maxLength={this.MAX_LENGTH}
            onChangeText={text => this.setState({note: text})}
            placeholder={this.props.markers[this.props.selected].properties.mainText}
            value={this.state.note}
            style={noteEditorStyles.textInput}
          />
          <Text
            style={noteEditorStyles.charCount}
          >
            {`${this.MAX_LENGTH - (this.state.note ? this.state.note.length : 0)}`}
          </Text>
        </View>
        <Button
          title='DONE'
          onPress={() => {
            this.props.update(this.state.note);
            this.props.navigation.goBack();
          }}
        />
      </View>
    );
  }
}

function Card(props) {
  const source = props.marker.properties.photoRefs ?
    {uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoRefs[0]}&maxheight=800&maxWidth=${CARD_WIDTH}`} :
    {uri: PLACEHOLDER_IMG};
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={mapStyles.card}>
        <Image source={source} style={mapStyles.cardImage} resizeMode='cover' />
        <View style={{position: 'absolute', top: 10, left: 10, width: 25, height: 25, borderRadius: 25 / 2, backgroundColor: ACCENT, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'white'}}>{props.index + 1}</Text>
        </View>
        <View style={mapStyles.textContent}>
          <Text numberOfLines={1} style={mapStyles.cardtitle}>
            {props.marker.properties.mainText}
          </Text>
          <Text numberOfLines={1} style={mapStyles.cardDescription}>
            {props.marker.properties.secondaryText}
          </Text>
        </View>
        <View style={mapStyles.cardButtonBar}>
          <Button title={'Remove'} onPress={props.onRemove} small />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function FocusedCard(props) {
  const source = props.marker.properties.photoRefs ?
    {uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoRefs[0]}&maxheight=800&maxWidth=${CARD_WIDTH}`} :
    {uri: PLACEHOLDER_IMG};

  return (
    <View style={mapStyles.focusedCard}>
      <Image source={source} style={mapStyles.cardImage} resizeMode='cover' />
      <View style={mapStyles.textContent}>
        <Text numberOfLines={1} style={mapStyles.cardtitle}>
          {props.marker.properties.mainText}
        </Text>
        <Text numberOfLines={1} style={mapStyles.cardDescription}>
          {props.marker.properties.secondaryText}
        </Text>
      </View>
      <View style={mapStyles.cardButtonBar}>
        <Button title={'Add'} onPress={props.onAdd} />
      </View>
    </View>
  );
}

function ActionCard(props) {
  let content;
  if (props.length == 0) {
    content = (
      <Text style={{color: DARKER_GREY, textAlign: 'center'}}>
        {'Search or tap on the map to add places :)'}
      </Text>
    );
  } else {
    content = [
      <Text style={{color: DARKER_GREY}} key='num_places'>
        {`${props.length} places`}
      </Text>,
      <Text style={{color: DARKER_GREY}} key='distance'>
        {`${props.distance} m`}
      </Text>,
      <Text style={{color: DARKER_GREY}} key='time'>
        {`${Math.floor(props.duration / 60)} mins`}
      </Text>,
      props.view != 'info' && 
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}} key='buttons'>
          <Button title={'View All'} onPress={props.viewAll} small />
          <Button title={`Create Route`} onPress={props.showRouteInfo} small />
        </View>
    ];
  }

  return (
    <View style={mapStyles.card}>
      <View style={mapStyles.actionCardContent}>
        {content}
      </View>
    </View>
  );
}


function DrawerButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={mapStyles.drawerButton}/>
      
    </TouchableOpacity>
  );
}

function Tag(props) {
  return (
    <View style={{flexDirection: 'row', backgroundColor: ACCENT, height: 30, width: 'auto', padding: 3, alignItems: 'center', borderRadius: 5, marginRight: 10, marginBottom: 10}}>
      <Text style={{color: 'white', paddingRight: 5}} numberOfLines={1} ellipsizeMode='tail'>{props.title}</Text>
      <TouchableOpacity onPress={props.onClear}>
        <Icon name='clear' size={17} color='white' />
      </TouchableOpacity>
    </View>
  );
}

class MapScreen extends Component {

  static navigationOptions = {
    tabBarVisible: false
  };

  state = {
    view: 'map',
    searchInput: '',
    drawerCollapsed: false,
    focused: null,
    // route metadata
    name: '',
    tags: []
  };

  componentWillMount() {
    this.mapRef = null;
    this.scrollViewRef = null;
    this.searchBoxRef = null;

    this.refreshToken = null;
    this.collapseValue = new Animated.Value(height - Header.HEIGHT - (55 + CARD_HEIGHT));
    this.scrollValue = new Animated.Value(0);

    this.focusChanged = false;
  }

  componentWillUnmount() {
    this.props.clear();
  }

  onPressSearch = () => {
    this.props.navigation.navigate('MapSearch', {
      searchInput: this.state.searchInput,
      onPressItem: this.onPressSearchItem,
    });
  }

  onClearSearch = () => {
    this.setState({searchInput: '', focused: null});
  }

  fetchPlaceDetails = (placeId, callback) => {
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${MAPS_API_KEY}`)
    .then(response => response.json())
    .then(responseJson => {
      // limit showing photos to 4 to save ca$h
      const photos = responseJson.result.photos ? responseJson.result.photos.map(elem => elem.photo_reference).slice(0, 4) : null;
      const marker = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            responseJson.result.geometry.location.lat,
            responseJson.result.geometry.location.lng
          ]
        },
        properties: {
          placeId: placeId,
          mainText: responseJson.result.name,
          secondaryText: responseJson.result.formatted_address,
          photoRefs: photos
        }
      };

      this.closeDrawer();
      this.setState({
        searchInput: responseJson.result.name,
        focused: marker,
      }, callback);
    });
  }

  onPressSearchItem = (item, navigation) => {
    this.fetchPlaceDetails(item.place_id, () => {
      navigation.goBack();
      this.mapRef.animateCamera({
        center: {
          latitude: this.state.focused.geometry.coordinates[0],
          longitude: this.state.focused.geometry.coordinates[1],
        },
        zoom: 17
      }, 30);
    });
  }

  onPoiClick = event => {
    event.persist(); // necessary to persist event data for some reason
    this.fetchPlaceDetails(event.nativeEvent.placeId, () => {
      this.mapRef.animateCamera({
        center: {
          latitude: this.state.focused.geometry.coordinates[0],
          longitude: this.state.focused.geometry.coordinates[1],
        },
        zoom: 17
      }, 30);
    });
  }

  onLongPress = event => {
    event.persist();
    const latitude = event.nativeEvent.coordinate.latitude;
    const longitude = event.nativeEvent.coordinate.longitude;
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAPS_API_KEY}`)
      .then(response => response.json())
      .then(responseJson => {
        let hasPhoto = false;
        let placeId;
        // cycle through returns places to see if there are any photos
        for (i = 0; i <= Math.floor(Object.keys(responseJson.results).length / 3); i++) {
          placeId = responseJson.results[i].place_id;
          fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${MAPS_API_KEY}`)
            .then(response => response.json())
            .then(responseJson => {
              if (!hasPhoto) {
                let photos = responseJson.result.photos;
                if (photos != undefined) {
                  hasPhoto = true;
                  photos = responseJson.result.photos.map(elem => elem.photo_reference);
                  const marker = {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [
                        parseFloat(latitude),
                        parseFloat(longitude)
                      ]
                    },
                    properties: {
                      placeId: placeId,
                      mainText: responseJson.result.name,
                      secondaryText: responseJson.result.formatted_address,
                      photoRefs: photos
                    }
                  };
                  this.closeDrawer();
                  this.setState({
                    searchInput: responseJson.result.name,
                    focused: marker,
                  }, () => {
                    this.mapRef.animateCamera({
                      center: {
                        latitude: this.state.focused.geometry.coordinates[0],
                        longitude: this.state.focused.geometry.coordinates[1],
                      },
                      zoom: 18
                    }, 30);
                  });
                }
              }
            });
            if (hasPhoto) {
              break;
            }
          }
          if (!hasPhoto) {
            this.fetchPlaceDetails(responseJson.results[0].place_id, () => {
              this.mapRef.animateCamera({
                center: {
                  latitude: this.state.focused.geometry.coordinates[0],
                  longitude: this.state.focused.geometry.coordinates[1],
                },
                zoom: 18
              }, 30);
            });            
          }
      });
  }

  toggleDrawer = () => {
    let toValue;
    if (this.state.drawerCollapsed) {
      toValue = height - Header.HEIGHT - (55 + CARD_HEIGHT);
    } else {
      if (Platform.OS === 'ios') {
        toValue = height - Header.HEIGHT - 80;
      } else {
        toValue = height - Header.HEIGHT - 35;
      }
  }

    Animated.timing(
      this.collapseValue,
      {
        toValue: toValue,
        duration: 200
      }
    ).start(() => this.setState({drawerCollapsed: !this.state.drawerCollapsed, view: 'map'}));
  }

  closeDrawer = () => {
    Animated.timing(
      this.collapseValue,
      {
        toValue: Platform.OS === 'ios' ? height - Header.HEIGHT - 80 : height - Header.HEIGHT - 35,
        duration: 200
      }
    ).start(() => this.setState({drawerCollapsed: true}));
  }

  showRouteInfo = () => {
    this.setState({view: 'info'}, () => {
      Animated.timing(
        this.collapseValue,
        {
          toValue: 0,
          duration: 200
        }
      ).start();
    });
  }

  onAddItem = async () => {
    let info;
    if (this.props.markers.length > 0) {
      await fetch(`https://maps.googleapis.com/maps/api/directions/json?key=${MAPS_API_KEY}&origin=place_id:${this.props.markers[this.props.markers.length-1].properties.placeId}&destination=place_id:${this.state.focused.properties.placeId}&mode=walking`)
        .then(response => response.json())
        .then(responseJson => {
          info = {
            distance: responseJson.routes[0].legs[0].distance,
            duration: responseJson.routes[0].legs[0].duration
          }
        });
    }

    this.props.addMarker(this.state.focused, info);
    this.setState({
      focused: null,
      searchInput: '',
    }, this.toggleDrawer);
  }

  onPressAddTags = () => {
    this.props.navigation.navigate('AddTags');
    console.log("Button pressed");
  }

  onComplete = () => {
    firebase.auth().currentUser.getIdToken().then(token =>
      fetch(`${SERVER_ADDR}/cities/routes`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: this.state.name,
          creator: this.props.userId,
          city: PLACE_ID,
          pins: this.props.markers,
          tags: this.state.tags
        })
      })
    )
      .then(response => {
        this.props.navigation.goBack();
      })
      .catch(error => console.error(error));
  }

  clearTag = value => {
    this.setState({
      tags: this.state.tags.filter(tag => tag != value)
    });
  }

  render() {
    const reducer = (res, marker, index) => {
      res.push(
        <Card
          marker={marker}
          onPress={() => {
            this.props.viewDetail(index);
            this.props.navigation.navigate('PlaceDetail', {editable: true});
          }}
          onRemove={() => this.props.removeMarker(marker.properties.placeId)}
          key={marker.properties.placeId}
          index={index}
        />
      );

      if (this.props.steps[index]) {
        res.push(
          <TouchableOpacity
            onPress={() => {
              if (index === this.props.showRoute) {
                this.props.clearRoute();
              } else {
                this.props.selectRoute(index);
                this.mapRef.fitToSuppliedMarkers(
                  [this.props.markers[index], this.props.markers[index+1]].map(marker => marker.properties.placeId),
                  {
                    edgePadding: {
                      top: 500,
                      left: 500,
                      bottom: 800,
                      right: 500
                    },
                    animated: true
                  }
                );
              }
            }}
            key={`${marker.properties.placeId}_leg`}
          >
            <View style={{...mapStyles.filler, alignItems: 'center', justifyContent: 'center'}}>
              <Icon name='directions-walk' size={30} color={index === this.props.showRoute ? PRIMARY : DARKER_GREY} />
              <Text style={{color: index === this.props.showRoute ? PRIMARY : DARKER_GREY}}>
                {this.props.steps[index].distance.text}
              </Text>
              <Text style={{color: index === this.props.showRoute ? PRIMARY : DARKER_GREY}}>
                {this.props.steps[index].duration.text}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }

      return res;
    }

    const cards = this.props.markers.reduce(reducer, []);

    return (
      <View style={globalStyles.container}>
        <MapView
          provider={'google'}
          style={globalStyles.container}
          onPoiClick={this.onPoiClick}
          onLongPress={this.onLongPress}
          initialRegion={{
            latitude: INIT_LOCATION.latitude,
            longitude: INIT_LOCATION.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          ref={ref => this.mapRef = ref}
        >
          {this.props.markers.map((marker, index) => 
            <Marker
              key={marker.properties.placeId}
              identifier={marker.properties.placeId}
              coordinate={{latitude: marker.geometry.coordinates[0], longitude: marker.geometry.coordinates[1]}}
              title={marker.properties.mainText}
              description={marker.properties.secondaryText}
              icon={pin}
            >
              <View style={mapStyles.pin}>
                <Text style={{color: 'white'}}>{index+1}</Text>
              </View>
            </Marker>
          )}
          {this.state.focused &&
            <Marker
              key={this.state.focused.properties.placeId}
              identifier={this.state.focused.properties.placeId}
              coordinate={{latitude: this.state.focused.geometry.coordinates[0], longitude: this.state.focused.geometry.coordinates[1]}}
              title={this.state.focused.properties.mainText}
              description={this.state.focused.properties.secondaryText}
              icon={pin}
            />
          }
          { this.props.showRoute !== null ? <MapViewDirections
            origin={`place_id:${this.props.markers[this.props.showRoute].properties.placeId}`}
            destination={`place_id:${this.props.markers[this.props.showRoute+1].properties.placeId}`}
            apikey={MAPS_API_KEY}
            strokeColor={PRIMARY}
            strokeWidth={6}
            // lineDashPattern={[5, 30]}
          /> : null}
        </MapView>
        <View style={mapStyles.searchBoxContainer}>
          <TextInput
            style={mapStyles.searchBox}
            placeholder='Search'
            value={this.state.searchInput}
            onTouchEnd={this.onPressSearch}
          />
          <TouchableOpacity onPress={this.onClearSearch}>
            <Icon name='clear' size={30} />
          </TouchableOpacity>
        </View>
        <Animated.View style={{...mapStyles.animated, top: this.collapseValue}}>
          {/* show focused card */}
          {this.state.focused && <FocusedCard
            marker={this.state.focused}
            onAdd={this.onAddItem} 
          />}
          <View style={mapStyles.drawer} >
            <DrawerButton onPress={this.toggleDrawer} />
            <Animated.ScrollView
              style={{flex: 1}}
              scrollEnabled={this.props.markers.length > 0}
              ref={ref => this.scrollViewRef = ref}
              contentContainerStyle={mapStyles.endPadding}
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
            >
              <View style={mapStyles.filler} />
              {cards}
              <ActionCard
                length={this.props.markers.length}
                viewAll={() => {
                  this.mapRef.fitToSuppliedMarkers(
                    this.props.markers.map(marker => marker.properties.placeId),
                    {
                      edgePadding: {
                        top: 100,
                        left: 75,
                        bottom: 500,
                        right: 75
                      },
                      animated: true
                    }
                  );
                }}
                showRouteInfo={this.showRouteInfo}
                view={this.state.view}
                distance={this.props.steps.reduce((res, cur) => res + cur.distance.value, 0)}
                duration={this.props.steps.reduce((res, cur) => res + cur.duration.value, 0)}
              />
              <View style={mapStyles.filler} />
            </Animated.ScrollView>
            {this.state.view === 'info' &&
              <View style={mapStyles.infoContainer}>
                <TextInput
                  style={{...mapStyles.nameBox, marginBottom: 10}}
                  placeholder={'Name your route'}
                  onChangeText={text => this.setState({name: text})}
                  value={this.state.name}
                />
                {/* <Picker
                  style={{height: 50, width: 150, alignSelf: 'flex-start', marginLeft: '5%', marginBottom: 10, borderWidth: 1}}
                  selectedValue='Add Tags'
                  onValueChange={value => {
                    if (value != 'Add Tags' && !this.state.tags.includes(value)) {
                      this.setState({
                        tags: [...this.state.tags, value]
                      });
                    }
                  }}
                >
                  <Picker.Item label='Add Tags' value={'Add Tags'} />
                  {TAGS.map(tag => <Picker.Item label={tag} value={tag} key={tag}/>)}
                </Picker> */}
                <Button title={'Add Tags'} onPress={this.onPressAddTags} />
                <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: '5%', flexWrap: 'wrap'}}>
                  {this.state.tags.map(tag => <Tag title={tag} onClear={() => this.clearTag(tag)} key={tag} />)}
                </View>
                <Button title={'DONE'} onPress={this.onComplete} />
              </View>
            }
          </View>
        </Animated.View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    markers: state.markers,
    steps: state.steps,
    selected: state.selected,
    userId: state.userId,
    showRoute: state.showRoute
  };
}

const mapDispatchToProps = dispatch => {
  return {
    addMarker: (marker, routeInfo) => dispatch({type: 'ADD', payload: {
      marker: marker,
      routeInfo: routeInfo
    }}),
    removeMarker: id => dispatch({type: 'REMOVE', payload: {
      id: id
    }}),
    viewDetail: index => dispatch({type: 'VIEW_DETAIL', payload: {
      selectedIndex: index
    }}),
    update: note => dispatch({type: 'UPDATE', payload: {
      note: note
    }}),
    clear: () => dispatch({type: 'CLEAR'}),
    selectRoute: index => dispatch({type: 'SELECT_ROUTE', payload: {
      selectedIndex: index
    }}),
    clearRoute: () => dispatch({type: 'CLEAR_ROUTE'})
  };
}

export const MapSearchScreen = connect(mapStateToProps)(MapSearch);
export const NoteEditorScreen = connect(mapStateToProps, mapDispatchToProps)(NoteEditor);

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
  PixelRatio,
  BackHandler
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Header } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
// import resolveAssetSource from 'resolveAssetSource';
import OptionsMenu from 'react-native-options-menu';
import { Linking } from 'expo';

import Button from '../components/Buttons.js';
import { GREY, DARKER_GREY, PRIMARY, ACCENT } from '../config/styles.js';
import {
  MAPS_API_KEY,
  INIT_LOCATION,
  TEST_SERVER_ADDR,
  PLACEHOLDER_IMG
} from '../config/settings.js';

// dimensions of the screen
const {width, height} = Dimensions.get('window');

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = Math.floor(width / 1.5);

const FOCUSED_CARD_HEIGHT = CARD_HEIGHT * 1.4;
const FOCUSED_CARD_WIDTH = width * 0.9;
const FOCUSED_IMG_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(FOCUSED_CARD_HEIGHT);
const FOCUSED_IMG_WIDTH = PixelRatio.getPixelSizeForLayoutSize(FOCUSED_CARD_WIDTH);

const OFFSET_DIV = CARD_WIDTH * (5/4);

const IMG_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(CARD_HEIGHT);
const IMG_WIDTH = PixelRatio.getPixelSizeForLayoutSize(CARD_WIDTH);

const DRAWER_OPEN = Platform.OS === 'ios' ? height - (Header.HEIGHT) - (CARD_HEIGHT + 80) : height - (Header.HEIGHT + StatusBar.currentHeight) - (CARD_HEIGHT + 35);
const DRAWER_CLOSED = Platform.OS === 'ios' ? height - Header.HEIGHT - 80 : height - Header.HEIGHT - 35;
const DRAWER_EXPANDED = 0;

const pin =  require('../assets/pin.png');

const PIN_WIDTH = 92; //resolveAssetSource(pin).width;
const PIN_HEIGHT = 110; //resolveAssetSource(pin).width;
const PIXEL_RATIO = PixelRatio.get();

const METERS_TO_MILES = 1609.34;
const SECONDS_TO_MINUTES = 60;

const mapStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchBoxContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    height: 46,
    borderRadius: 20,
    width: '90%',
    top: 10,
    marginHorizontal: '5%',
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
  focusedCard: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginBottom: 5,
    height: FOCUSED_CARD_HEIGHT,
    width: '90%',
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 7
  },
  cardButtonBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    padding: 10
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
  cardNumber: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center'
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
    borderColor: GREY,
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
    alignItems: 'center',
  }
});

function Card(props) {
  const source = props.marker.properties.photoRefs ?
    {uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoRefs[0]}&maxheight=${IMG_HEIGHT}&maxWidth=${IMG_WIDTH}`} :
    {uri: PLACEHOLDER_IMG};

  return (
    <TouchableWithoutFeedback onPress={props.onMore}>
      <View style={mapStyles.card}>
        <Image source={source} style={mapStyles.cardImage} resizeMode='cover' />
        {/* Number label */}
        <View style={{position: 'absolute', top: 5, right: 5}}>
          <OptionsMenu
            customButton={<Icon name='more-vert' size={30} color={ACCENT} />}
            options={props.options}
            actions={props.actions}
          />
        </View>
        <View style={mapStyles.cardNumber}>
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
      </View>
    </TouchableWithoutFeedback>
  );
}

function FocusedCard(props) {
  const source = props.marker.properties.photoRefs ?
    {uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoRefs[0]}&maxheight=${FOCUSED_IMG_HEIGHT}&maxWidth=${FOCUSED_IMG_WIDTH}`} :
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
  let mins = Math.floor(props.duration / 60);
  let hours = Math.floor(mins / SECONDS_TO_MINUTES);
  mins = mins % 60;
  let timeString;
  if (hours == 0) {
    timeString = `${mins} mins`;
  } else if (hours == 1) {
    timeString = `${hours} hour ${mins} mins`;
  } else {
    timeString = `${hours} hours ${mins} mins`;
  }
  let miles = (props.distance / METERS_TO_MILES).toFixed(2);

  if (!props.loaded) {
    content = (
      <Text style={{color: DARKER_GREY, textAlign: 'center'}}>
        {'Loading...'}
      </Text>
    );
  } else {
    content = [
      // <Text style={{color: DARKER_GREY}} key='num_pins'>
      //   {`${props.numPins} pins`}
      // </Text>,
      // <Text style={{color: DARKER_GREY}} key='distance'>
      //   {`${miles} mi`}
      // </Text>,
      // <Text style={{color: DARKER_GREY}} key='time'>
      //   {`${timeString}`}
      // </Text>,
      props.view != 'info' &&
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}} key='buttons'>
          <TouchableOpacity onPress={props.showRouteInfo} >
            <Icon name='more-horiz' size={30} color={ACCENT} />
          </TouchableOpacity>
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
    </View>
  );
}

class RouteDetailScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: false,
      headerTitle: () => <Text style={{fontSize: 20}}>Route Details</Text>,
      headerLeft: () => <Icon name='arrow-back' size={30} style={{marginLeft: 10}} onPress={navigation.getParam('onBack')} />,
      headerRight: () => (
        navigation.getParam('editing') ? <TouchableOpacity onPress={navigation.getParam('onPressSave')}>
          <Icon name='save' size={30} color={ACCENT} style={{marginRight: 10}} />
        </TouchableOpacity> :
        <OptionsMenu
          customButton={<Icon name='more-vert' size={30} color='black' style={{marginRight: 10}} />}
          options={['Edit', 'Delete']}
          actions={[navigation.getParam('onPressEdit'), () => console.log('Delete')]}
        />
      )
    };
  }

  state = {
    view: 'map',
    drawer: 'open',
    // if new, default to editing
    editing: this.props.navigation.getParam('new'),
    // whether route is loaded to redux store
    loaded: false,
    searchInput: '',
    focused: null
  };

  constructor(props) {
    super(props);
    // capture hardware back button for Android
    this.didFocus = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBack)
    );

    const pins = this.props.navigation.getParam('route').pins;
    if (pins.length != 0) {
      // longer names here because this is what Teleport uses
      this.initLocation = {
        latitude: pins[0].geometry.coordinates[0],
        longitude: pins[0].geometry.coordinates[1]
      };
    } else {
      this.initLocation = this.props.navigation.getParam('location').location.latlon;
    }
  }

  componentWillMount() {
    this.mapRef = null;
    // for animating bottom drawer collapse
    this.collapseValue = new Animated.Value(DRAWER_OPEN);
    
    this.props.navigation.setParams({
      onBack: this.onBack,
      onPressEdit: () => {
        this.setState({editing: true});
        this.props.navigation.setParams({editing: true});
      },
      onPressSave: this.onComplete
    });
  }

  componentDidMount() {
    const markers = this.props.navigation.getParam('route').pins;
    const placeIds = markers.map(marker => 'place_id:' + marker.properties.placeId);

    const origins = [...placeIds];
    const destinations = [...placeIds];

    origins.pop();
    destinations.shift();

    if (!this.props.navigation.getParam('new')) {
      fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?key=${MAPS_API_KEY}&origins=${origins.join('|')}&destinations=${destinations.join('|')}&mode=walking`)
      .then(response => response.json())
      .then(responseJson => {
        const distances = responseJson.rows.map((row, index) => row.elements[index].distance);
        this.props.loadRoute(markers, distances);
      });
    }

    this.willBlur = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBack)
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.markers === null && this.props.markers !== null) {
      this.setState({loaded: true});
    }
  }

  componentWillUnmount() {
    this.props.clear();
    this.didFocus.remove();
    this.willBlur.remove();
  }

  onBack = () => {
    if (this.state.view == 'info') {
      this.toggleDrawer();
      return true;    
    }

    if (this.props.navigation.getParam('new')) {
      this.props.navigation.goBack('Location');
    } else {
      this.props.navigation.goBack();
    }

    return true;
  }

  toggleDrawer = () => {
    let toValue;
    let nextState;

    // if drawer expanded...
    if (this.state.view == 'info') {
      this.didEnterRouteInfo && this.didEnterRouteInfo.remove();
      // drawer must have been open
      toValue = DRAWER_OPEN;
      nextState = 'open';
    } else {
      if (this.state.drawer == 'open') {
        toValue = DRAWER_CLOSED;
        nextState = 'closed';
      } else {
        toValue = DRAWER_OPEN;
        nextState = 'open';
      }
    }

    // update state first, then animate
    this.setState({drawer: nextState, view: 'map'}, Animated.timing(
      this.collapseValue,
      {
        toValue: toValue,
        duration: 200
      }
    ).start);
  }

  closeDrawer = () => {
    this.setState({drawer: 'closed', view: 'map'}, Animated.timing(
      this.collapseValue,
      {
        toValue: DRAWER_CLOSED,
        duration: 200
      }
    ).start);
  }

  showRouteInfo = () => {
    this.setState({view: 'info'}, () => {
      this.didEnterRouteInfo = this.props.navigation.addListener(
        'didFocus',
        payload => BackHandler.addEventListener(
          'hardwareBackPress',
          this.toggleDrawer
        )
      );
      Animated.timing(
        this.collapseValue,
        {
          toValue: DRAWER_EXPANDED,
          duration: 200
        }
      ).start();
    });
  }

  onPressSearch = () => {
    this.props.navigation.navigate('MapSearch', {
      location: this.initLocation,
      searchInput: this.state.searchInput,
      onPressItem: this.onPressSearchItem,
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

  onAddItem = async () => {
    let distance;
    if (this.props.markers.length > 0) {
      await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?key=${MAPS_API_KEY}&origins=place_id:${this.props.markers[this.props.markers.length-1].properties.placeId}&destinations=place_id:${this.state.focused.properties.placeId}&mode=walking`)
        .then(response => response.json())
        .then(responseJson => {
          distance = responseJson.rows[0].elements[0].distance;
          console.log(distance);
        });
    }

    if (distance) {
      this.state.focused.properties.distToNext = distance;
    }

    this.props.addMarker(this.state.focused);
    this.setState({
      focused: null,
      searchInput: '',
    }, this.toggleDrawer);
  }

  onComplete = () => {
    firebase.auth().currentUser.getIdToken().then(token =>
      fetch(`${TEST_SERVER_ADDR}/api/users/${firebase.auth().currentUser.uid}/routes/saved`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: this.state.name,
          creator: firebase.auth().currentUser.uid,
          location: this.props.navigation.getParam('location').geoname_id,
          pins: this.props.markers,
          tags: this.state.tags
        })
      })
    )
      .then(response => {
        this.props.toggleRefresh();
        this.setState({editing: false});
        this.props.navigation.setParams({editing: false});
        // if (this.props.from == 'location') {
        //   this.props.navigation.goBack('Location');
        // } else {
        //   this.props.navigation.goBack();
        // }
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
      const options = ['Remove'];
      const actions = [() => this.props.removeMarker(marker.properties.placeId)];

      if (index != 0) {
        options.push('Move Left');
        actions.push(() => this.props.swapMarkers(index-1, index));
      }
      if (index != this.props.markers.length -1) {
        options.push('Move Right');
        actions.push(() => this.props.swapMarkers(index, index+1));
      }

      res.push(
        <Card
          key={marker.properties.placeId}
          marker={marker}
          onPress={() => {
            this.mapRef.animateCamera({
              center: {
                latitude: marker.geometry.coordinates[0],
                longitude: marker.geometry.coordinates[1],
              },
              zoom: 17
            }, 30);
          }}
          onMore={() => {
            this.props.viewDetail(index);
            this.props.navigation.navigate('PlaceDetail');
          }}
          index={index}
          options={options}
          actions={actions}
        />
      );

      // if (this.props.steps[index]) {
      //   res.push(
      //     <TouchableOpacity
      //       onPress={() => {
      //       // Open Google Maps
      //       Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${this.props.markers[index+1].properties.secondaryText}&travelmode=walking`);
      //       //   if (index === this.props.showRoute) {
      //       //     this.props.clearRoute();
      //       //   } else {
      //       //     this.props.selectRoute(index);
      //       //     this.mapRef.fitToSuppliedMarkers(
      //       //       [this.props.markers[index], this.props.markers[index+1]].map(marker => marker.properties.placeId),
      //       //       {
      //       //         edgePadding: {
      //       //           top: 100,
      //       //           left: 100,
      //       //           bottom: 300,
      //       //           right: 100
      //       //         },
      //       //         animated: true
      //       //       }
      //       //     );
      //       //   }
      //       // }}
      //       // key={`${marker.properties.placeId}_leg`}
      //       }}
      //     >
      //       <View style={{...mapStyles.filler, alignItems: 'center', justifyContent: 'center'}}>
      //         <Icon name='directions-walk' size={30} color={DARKER_GREY} />
      //         <Text style={{color: DARKER_GREY}}>
      //           {this.props.steps[index].text}
      //         </Text>
      //         {/* <Text style={{color: index === this.props.showRoute ? PRIMARY : DARKER_GREY}}>
      //           {this.props.steps[index].duration.text}
      //         </Text> */}
      //       </View>
      //     </TouchableOpacity>
      //   );
      // }

      return res;
    }

    const cards = this.props.markers.reduce(reducer, []);

    return (
      <View style={mapStyles.container}>
        <MapView
          provider={'google'}
          style={mapStyles.container}
          onPoiClick={this.state.editing && this.onPoiClick}
          initialRegion={{
            latitude: this.initLocation.latitude,
            longitude: this.initLocation.longitude, 
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          showsUserLocation={true}
          ref={ref => this.mapRef = ref}
        >
          {this.props.markers.map((marker, index) =>
            <Marker
              key={marker.properties.placeId}
              identifier={marker.properties.placeId}
              coordinate={{latitude: marker.geometry.coordinates[0], longitude: marker.geometry.coordinates[1]}}
              title={marker.properties.mainText}
              description={marker.properties.secondaryText}
              image={pin}
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
        </MapView>
        {this.state.editing && <View style={mapStyles.searchBoxContainer}>
          <TextInput
            style={mapStyles.searchBox}
            placeholder='Search'
            value={this.state.searchInput}
            onTouchEnd={this.onPressSearch}
          />
          <TouchableOpacity onPress={this.onClearSearch}>
            <Icon name='clear' size={30} color='grey' />
          </TouchableOpacity>
        </View>}
        <Animated.View style={{...mapStyles.animated, top: this.collapseValue}}>
          {/* show focused card */}
          {this.state.focused && <FocusedCard
            marker={this.state.focused}
            onAdd={this.onAddItem}
          />}
          <View style={mapStyles.drawer} >
            <DrawerButton onPress={this.toggleDrawer} />
            <ScrollView
              style={{flex: 1}}
              scrollEnabled={this.props.markers.length > 0}
              contentContainerStyle={mapStyles.endPadding}
              horizontal
              scrollEventThrottle={1}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={event => {
                const i = Math.round(event.nativeEvent.contentOffset.x / OFFSET_DIV);
                if (i == this.props.markers.length) {
                  this.mapRef.fitToSuppliedMarkers(
                    this.props.markers.map(marker => marker.properties.placeId),
                    {
                      edgePadding: {
                        top: CARD_HEIGHT,
                        left: 150,
                        bottom: CARD_HEIGHT,
                        right: 150
                      },
                      animated: true
                    }
                  );
                } else {
                  this.mapRef.animateCamera({
                    center: {
                      latitude: this.props.markers[i].geometry.coordinates[0],
                      longitude: this.props.markers[i].geometry.coordinates[1],
                    },
                    zoom: 15
                  }, 30);
                }
              }}
            >
              <View style={mapStyles.filler} />
              {cards}
              <ActionCard
                loaded={this.state.loaded}
                showRouteInfo={this.showRouteInfo}
                view={this.state.view}
                // distance={this.props.steps.reduce((res, cur) => res + cur.distance.value, 0)}
                // duration={this.props.steps.reduce((res, cur) => res + cur.duration.value, 0)}
              />
              <View style={mapStyles.filler} />
            </ScrollView>
            {this.state.view === 'info' &&
              <View style={mapStyles.infoContainer}>
                <Text style={{alignSelf: 'flex-start', margin: 15, fontSize: 20, fontWeight: 'bold', width: 300}}>
                  {this.props.navigation.getParam('route').name}
                </Text>
                {this.props.navigation.getParam('route').tags != undefined &&
                <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15, flexWrap: 'wrap'}}>
                  {this.props.navigation.getParam('route').tags.map(tag => <Tag title={tag} key={tag} />)}
                </View>
                }
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
    showRoute: state.showRoute,
    userId: state.userId
  };
}

const mapDispatchToProps = dispatch => {
  return {
    viewDetail: index => dispatch({type: 'VIEW_DETAIL', payload: {
      selectedIndex: index
    }}),
    addMarker: (marker, distance) => dispatch({type: 'ADD', payload: {
      marker: marker,
      distance: distance
    }}),
    removeMarker: id => dispatch({type: 'REMOVE', payload: {
      id: id
    }}),
    swapMarkers: (a, b) => dispatch({type: 'SWAP', payload: {
      a: a,
      b: b
    }}),
    clear: () => dispatch({type: 'CLEAR'}),
    loadRoute: (markers, steps) => dispatch({type: 'LOAD_ROUTE', payload: {
      markers: markers,
      steps: steps
    }}),
    selectRoute: index => dispatch({type: 'SELECT_ROUTE', payload: {
      selectedIndex: index
    }}),
    clearRoute: () => dispatch({type: 'CLEAR_ROUTE'}),
    toggleRefresh: () => dispatch({type: 'TOGGLE_REFRESH'})
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteDetailScreen);

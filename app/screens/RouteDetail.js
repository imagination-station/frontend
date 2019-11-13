import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  PixelRatio
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Header } from 'react-navigation-stack';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
import resolveAssetSource from 'resolveAssetSource';

import Button from '../components/Buttons.js';
import globalStyles, { GREY, DARKER_GREY, PRIMARY, ACCENT } from '../config/styles.js';
import {
  MAPS_API_KEY,
  INIT_LOCATION,
  PLACEHOLDER_IMG
} from '../config/settings.js';

// dimensions of the screen
const {width, height} = Dimensions.get('window');

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = Math.floor(width / 1.5);

const pin =  require('../assets/pin.png'); 

const PIN_WIDTH = resolveAssetSource(pin).width;
const PIN_HEIGHT = resolveAssetSource(pin).width;
const PIXEL_RATIO = PixelRatio.get();

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
    alignItems: 'center'
  }
});

function Card(props) {
  const source = props.marker.properties.photoRefs ?
    {uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoRefs[0]}&maxheight=800&maxWidth=${CARD_WIDTH}`} :
    {uri: PLACEHOLDER_IMG};
  return (
    <TouchableWithoutFeedback onPress={props.onMore}>
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
          <Button title={'Focus'} onPress={props.onPress} small />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function ActionCard(props) {
  let content;
  if (props.length == 0) {
    content = (
      <Text style={{color: DARKER_GREY, textAlign: 'center'}}>
        {'Loading...'}
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
          <Button title='View All' onPress={props.viewAll} small />
          <Button title='Info' onPress={props.showRouteInfo} small />
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

  static navigationOptions = {
    tabBarVisible: false
  };

  state = {
    view: 'map',
    drawerCollapsed: false
  };

  componentWillMount() {
    this.mapRef = null;
    this.scrollViewRef = null;

    this.refreshToken = null;
    this.collapseValue = new Animated.Value(height - Header.HEIGHT - (55 + CARD_HEIGHT));
    this.scrollValue = new Animated.Value(0);
  }

  componentDidMount() {
    let fetches = [];

    const markers = this.props.navigation.getParam('route').pins;
    // get walking directions between each markers
    for (let i = 0; i < markers.length - 1; i++) {
      fetches.push(
        fetch(`https://maps.googleapis.com/maps/api/directions/json?key=${MAPS_API_KEY}&origin=place_id:${markers[i].properties.placeId}&destination=place_id:${markers[i+1].properties.placeId}&mode=walking`)
          .then(response => response.json())
      );
    }

    Promise.all(fetches)
      .then(responsesJson => {
        const steps = responsesJson.map(responseJson => {
          const info = {
            distance: responseJson.routes[0].legs[0].distance,
            duration: responseJson.routes[0].legs[0].duration 
          };
          return info;
        });

        this.props.loadRoute(this.props.navigation.getParam('route').pins, steps);
        if (this.props.navigation.getParam('route').pins.length > 1) {
          // show first leg by default
          this.props.selectRoute(0);
        }
      }
    );
  }

  componentWillUnmount() {
    this.props.clear();
  }

  toggleDrawer = () => {
    let toValue;
    if (this.state.drawerCollapsed) {
      toValue = height - Header.HEIGHT - (55 + CARD_HEIGHT);
    } else {
      toValue = height - Header.HEIGHT - 35;
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
        toValue: height - Header.HEIGHT - 35,
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

  render() {
    const reducer = (res, marker, index) => {
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
          {this.props.showRoute !== null ? <MapViewDirections
            origin={`place_id:${this.props.markers[this.props.showRoute].properties.placeId}`}
            destination={`place_id:${this.props.markers[this.props.showRoute+1].properties.placeId}`}
            apikey={MAPS_API_KEY}
            strokeColor={PRIMARY}
            strokeWidth={6}
            // lineDashPattern={[5, 30]}
          /> : null}
        </MapView>
        <Animated.View style={{...mapStyles.animated, top: this.collapseValue}}>
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
                <Text style={{alignSelf: 'flex-start', margin: 15, fontSize: 20, fontWeight: 'bold', width: 300}}>
                  {this.props.navigation.getParam('route').name}
                </Text>
                <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15, flexWrap: 'wrap'}}>
                  {this.props.navigation.getParam('route').tags.map(tag => <Tag title={tag} key={tag} />)}
                </View>
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
    clear: () => dispatch({type: 'CLEAR'}),
    loadRoute: (markers, steps) => dispatch({type: 'LOAD_ROUTE', payload: {
      markers: markers,
      steps: steps
    }}),
    selectRoute: index => dispatch({type: 'SELECT_ROUTE', payload: {
      selectedIndex: index
    }}),
    clearRoute: () => dispatch({type: 'CLEAR_ROUTE'})
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteDetailScreen);
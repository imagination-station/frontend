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
  TouchableWithoutFeedback
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Header } from 'react-navigation-stack';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';

import Button, { LongButton } from '../components/Buttons.js';
import ImageCarousel from '../components/ImageCarousel.js';
import globalStyles, { GREY, DARKER_GREY, PRIMARY } from '../config/styles.js';
import {
  MAPS_API_KEY,
  SERVER_ADDR,
  INIT_LOCATION,
  PLACE_ID
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
  doneContainer: {
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
  }
});


function Card(props) {
  const source = props.marker.properties.photoRefs ?
    {uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoRefs[0]}&maxheight=800&maxWidth=${CARD_WIDTH}`} :
    {uri: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/404_Store_Not_Found.jpg/1024px-404_Store_Not_Found.jpg`};
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={mapStyles.card}>
        <Image source={source} style={mapStyles.cardImage} resizeMode='cover' />
        <View style={mapStyles.textContent}>
          <Text numberOfLines={1} style={mapStyles.cardtitle}>
            {props.marker.properties.mainText}
          </Text>
          <Text numberOfLines={1} style={mapStyles.cardDescription}>
            {props.marker.properties.secondaryText}
          </Text>
        </View>
        {/* <View style={mapStyles.cardButtonBar}>
          <Button title={'Remove'} onPress={props.onRemove} small />
        </View> */}
      </View>
    </TouchableWithoutFeedback>
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
      <Text style={{color: DARKER_GREY}}>
        {`${props.length} places`}
      </Text>,
      <Text style={{color: DARKER_GREY}}>
        {`${props.distance} m`}
      </Text>,
      <Text style={{color: DARKER_GREY}}>
        {`${Math.floor(props.duration / 60)} mins`}
      </Text>,
      !props.isDone && 
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
          <Button title={'View All'} onPress={props.viewAll} small />
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
          key={marker.placeId}
          marker={marker}
          onPress={() => {
            this.props.viewDetail(index);
            this.props.navigation.navigate('PlaceDetail');
          }}
        />
      );

      if (this.props.steps[index]) {
        res.push(
          <TouchableOpacity onPress={() => {
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
          }}>
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
          {this.props.markers.map(marker => 
            <Marker
              key={marker.properties.placeId}
              identifier={marker.properties.placeId}
              coordinate={{latitude: marker.geometry.coordinates[0], longitude: marker.geometry.coordinates[1]}}
              title={marker.properties.mainText}
              description={marker.properties.secondaryText}
            />
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
                done={this.showDoneScreen}
                isDone={this.state.view === 'done'}
                distance={this.props.steps.reduce((res, cur) => res + cur.distance.value, 0)}
                duration={this.props.steps.reduce((res, cur) => res + cur.duration.value, 0)}
              />
              <View style={mapStyles.filler} />
            </Animated.ScrollView>
            {this.state.view === 'info' &&
              <View style={mapStyles.doneContainer}>
                <Text>{this.props.navigation.getParam('route').name}</Text>
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
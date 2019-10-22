import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Header } from 'react-navigation-stack';
import * as firebase from 'firebase';

import Button from '../components/Buttons.js';
import globalStyles, { GREY, DARKER_GREY } from '../config/styles.js';
import {
  MAPS_API_KEY,
  SERVER_ADDR,
  UID,
  INIT_LOCATION,
  PLACE_ID
} from '../config/settings.js';

// dimensions of the screen
const {width, height} = Dimensions.get('window');

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = Math.floor(width / 1.5);

const mapStyles = StyleSheet.create({
  mapView: {
    alignItems: 'center',
  },
  searchBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 46,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '95%',
    top: 10,
    marginHorizontal: '2.5%',
    position: 'absolute'
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
  collapseButton: {
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

const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  textBox: {
    height: 46,
    width: '95%',
    marginTop: 10,
    paddingHorizontal: 10
  },
  list: {
    height: '50%',
    width: '100%',
    borderTopWidth: 5,
    borderColor: GREY,
    paddingHorizontal: '2.5%',
  },
  buttonBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
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

function SearchScreen(props) {
  return (
    <View style={searchStyles.container}>
      {props.children}
      <View style={searchStyles.list}>
        <FlatList
          data={props.results}
          renderItem={({ item }) => <SearchItem
            item={item}
            onPress={() => props.onPressItem(item)}
          />}
          keyExtractor={item => item.place_id}
        />
        <View style={searchStyles.buttonBar}>
          <Button title='CLEAR' onPress={props.clear} />
          <Button title='BACK' onPress={props.goBack} />
        </View>
      </View>
    </View>
  );
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

function Card(props) {
  const source = props.marker.properties.photoReference[0] == undefined ?
    {uri: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/404_Store_Not_Found.jpg/1024px-404_Store_Not_Found.jpg`} :
    {uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoReference[0]}&maxheight=800&maxWidth=${CARD_WIDTH}`
  };

  return (
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
      <View style={mapStyles.cardButtonBar}>
        <Button title={'Add Note'} small />
      </View>
    </View>
  );
}

function FocusedCard(props) {
  const source = props.marker.properties.photoReference[0] == undefined ?
    {uri: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/404_Store_Not_Found.jpg/1024px-404_Store_Not_Found.jpg`} :
    {uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoReference[0]}&maxheight=800&maxWidth=${CARD_WIDTH}`
  };

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
        <Button title={'Dismiss'} onPress={props.onDismiss} />
      </View>
    </View>
  );
}

function DetailCard(props) {
  return (
    <View style={mapStyles.card}>
      <View style={mapStyles.actionCardContent}>
        <Text style={{color: DARKER_GREY}}>
          {`${props.length} places`}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 30}}>
          <Button title={'View All'} onPress={props.viewAll} small />
        </View>
      </View>
    </View>
  );
}


function CollapseButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={mapStyles.collapseButton}/>
    </TouchableOpacity>
  );
}

class MapScreen extends Component {

  static navigationOptions = {
    tabBarVisible: false
  };

  state = {
    view: 'map',
    search: '',
    searchResults: null,
    collapsed: false,
    region: {
      latitude: INIT_LOCATION.latitude,
      longitude: INIT_LOCATION.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    },
    maxZoomLevel: 20,
    markers: this.props.navigation.getParam('markers'),
    focused: null,
    name: this.props.navigation.getParam('name')
  };

  componentWillMount() {
    this.mapRef = null;
    this.scrollViewRef = null;
    this.searchBoxRef = null;

    this.searchTimer = null;
    this.refreshToken = null;
    this.collapseValue = new Animated.Value(height - Header.HEIGHT - (55 + CARD_HEIGHT));
    this.scrollValue = new Animated.Value(0);

    this.focusChanged = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.view !== this.state.view) {
      if (this.state.view === 'search') {
        this.searchBoxRef.focus();
      }
    }
  }

  onChangeSearchText = text => {
    this.setState({search: text});
    if (!this.searchTimer) {
      this.searchTimer = setTimeout(() => {
        fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${MAPS_API_KEY}&location=${INIT_LOCATION.latitude},${INIT_LOCATION.longitude}`)
          .then(response => response.json())
          .then(responseJson => this.setState({searchResults: responseJson.predictions}));
        this.searchTimer = null;
      }, 100);
    }
  }

  onPressSearchItem = item => {
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${MAPS_API_KEY}`)
      .then(response => response.json())
      .then(responseJson => {
        const photoReference = responseJson.result.photos == undefined ? [undefined] : responseJson.result.photos.map(elem => elem.photo_reference)
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
            placeId: item.place_id,
            mainText: item.structured_formatting.main_text,
            secondaryText: item.structured_formatting.secondary_text,
            photoReference: photoReference
          }
        };

        this.closeDrawer();
        this.focusChanged = true;
        this.setState({
          search: item.structured_formatting.main_text,
          view: 'map',
          focused: marker
        });
      });
  }

  onPressMap = event => {
    Keyboard.dismiss();
  }

  onPoiClick = event => {
    event.persist();
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${event.nativeEvent.placeId}&key=${MAPS_API_KEY}`)
      .then(response => response.json())
      .then(responseJson => {
        const photoReference = responseJson.result.photos == undefined ? [undefined] : responseJson.result.photos.map(elem => elem.photo_reference)
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
            placeId: event.nativeEvent.placeId,
            mainText: responseJson.result.name,
            secondaryText: responseJson.result.formatted_address,
            photoReference: photoReference
          }
        };

      this.closeDrawer();
      this.setState({
        search: responseJson.result.name,
        view: 'map',
        focused: marker,
        maxZoomLevel: 17 // limit zoom temporarily
      }, () => {
        this.mapRef.fitToSuppliedMarkers([event.nativeEvent.placeId], {
          edgePadding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
          },
          animated: true
        });
      });
    });
  }

  toggleDrawer = () => {
    let toValue;
    if (this.state.collapsed) {
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
    ).start(() => this.setState({collapsed: !this.state.collapsed, view: 'map'}));
  }

  closeDrawer = () => {
    Animated.timing(
      this.collapseValue,
      {
        toValue: height - Header.HEIGHT - 35,
        duration: 200
      }
    ).start(() => this.setState({collapsed: true}));
  }

  render() {
    let searchBox = (<TextInput
      ref={ref => this.searchBoxRef = ref}
      style={this.state.view === 'search' ? searchStyles.textBox : mapStyles.searchBox}
      placeholder={'Search'}
      onFocus={() => this.setState({view: 'search'})}
      value={this.state.search}
      onChangeText={this.onChangeSearchText}
    />);

    if (this.state.view === 'search') {
      return (
        <SearchScreen
          results={this.state.searchResults}
          onPressItem={this.onPressSearchItem}
          clear={() => this.setState({search: ''})}
          goBack={() => this.setState({view: 'map'})}
          textBoxRef={this.searchBoxRef}
        >
          {searchBox}
        </SearchScreen>
      );
    }

    return (
      <View style={globalStyles.container}>
        <View style={globalStyles.container}>
          <MapView
            maxZoomLevel={this.state.maxZoomLevel}
            provider={'google'}
            style={globalStyles.container}
            onPress={this.onPressMap}
            onPoiClick={this.onPoiClick}
            initialRegion={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta
            }}
            ref={ref => this.mapRef = ref}
            onRegionChangeComplete={region => {
              this.setState({region: region, maxZoomLevel: 20});
            }}
            onMapReady={() => {
              if (this.focusChanged) {
                this.focusChanged = false;
                this.mapRef.setCamera({
                  center: {
                    latitude: this.state.focused.geometry.coordinates[0],
                    longitude: this.state.focused.geometry.coordinates[1],
                  },
                  zoom: 17
                });
              }
            }}
          >
            {this.state.markers.map(marker => 
              <Marker
                key={marker.properties.placeId}
                identifier={marker.properties.placeId}
                coordinate={{latitude: marker.geometry.coordinates[0], longitude: marker.geometry.coordinates[1]}}
                title={marker.properties.mainText}
                description={marker.properties.secondaryText}
              />
            )}
            {this.state.focused &&
              <Marker
                key={this.state.focused.properties.placeId}
                identifier={this.state.focused.properties.placeId}
                coordinate={{latitude: this.state.focused.geometry.coordinates[0], longitude: this.state.focused.geometry.coordinates[1]}}
                title={this.state.focused.properties.mainText}
                description={this.state.focused.properties.secondaryText}
              />
            }
          </MapView>
          {searchBox}
          <Animated.View style={{...mapStyles.animated, top: this.collapseValue}}>
            {/* show focused card */}
            {this.state.focused && <FocusedCard
              marker={this.state.focused}
              onDismiss={() => this.setState({focused: null})}
              onAdd={this.onAddItem} 
            />}
            <View style={mapStyles.drawer} >
              <CollapseButton onPress={this.toggleDrawer} />
              <Animated.ScrollView
                style={{flex: 1}}
                scrollEnabled={this.state.markers.length > 0}
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
                    },
                  }],
                  {useNativeDriver: true}
                )}
              >
                <View style={mapStyles.filler} />
                {this.state.markers.map(marker => 
                  <Card
                    key={marker.placeId}
                    marker={marker}
                    onRemove={() => this.onRemoveItem(marker.properties.placeId)}
                  />
                )}
                <DetailCard
                  length={this.state.markers.length}
                  viewAll={() => {
                    this.mapRef.fitToSuppliedMarkers(
                      this.state.markers.map(marker => marker.properties.placeId),
                      {
                        edgePadding: {
                          top: 500,
                          left: 500,
                          bottom: 500,
                          right: 500
                        },
                        animated: true
                      }
                    );
                  }}
                />
                <View style={mapStyles.filler} />
              </Animated.ScrollView>
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }
}

export default MapScreen;
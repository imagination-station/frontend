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
import MapView, { Callout, Marker } from 'react-native-maps';
import { Header } from 'react-navigation-stack';
import * as firebase from 'firebase';

import Button from '../components/Button.js';
import globalStyles, { GREY, DARKER_GREY } from '../config/styles.js';
import {
  MAPS_API_KEY,
  SERVER_ADDR,
  UID,
  INIT_LOCATION,
  PLACE_ID,
  NAME,
  PHOTO_REFERENCE
} from '../config/settings.js';

// dimensions of the screen
const {width, height} = Dimensions.get('window');

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = Math.floor(width / 1.5);

const styles = StyleSheet.create({
  mapView: {
    alignItems: 'center',
  },
  searchView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  searchBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 46,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '95%',
    top: 10
  },
  searchList: {
    marginTop: 10,
    width: '100%',
    height: 400,
    borderColor: GREY,
    borderTopWidth: 5,
    padding: '2.5%'
  },
  searchItem: {
    borderColor: GREY,
    borderBottomWidth: 1,
    padding: 10
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
  actionCard: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginBottom: 5,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
    borderRadius: 10,
    elevation: 0.2
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
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
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
})

// hardcoded data; this is what it will actually look like
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
      photoReference: ['CmRaAAAApMwKX8N6EhXmxuytk8uqqz4XZwQYDHVDgk8XMigwwu4MnSuGnbbnPb6fCp1LaiOJXkx61D1s7M4kdAibCTy4wug3MTpEFGOAT_wHao1B-2mTF3GTU6gWG-0agXGE2qzkEhCNWHKzJ-OHG2iKfjAhIDo0GhQnmSb2pTi3XIMz00TAXpbHPbvUrQ'],
      note: 'Really cool museum!',
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
      photoReference: ['CmRaAAAAN1JSSlKydw6W6-7_eeuYOkJzvVBTW5LBaW0W1sxPnyhkZPKbP4PEbqoPXRU5Q9MHJXBOFzOEJl8KBvB64bI3xtnCOeh9RaUihdBq3-Bi3fOPopG33WVW8avzEZrJ0Dq-EhA4tZV5xpLQP_yEaMXFLzfOGhTeLYBn2z2mW3VmvlOCbUEucED2gg'],
      note: 'Chill, unpretentious vibes',
    }
  }
];

function SearchList(props) {
  return (
    <View style={styles.searchList}>
      <FlatList
        data={props.results}
        renderItem={({ item }) => <SearchItem
          item={item}
          onPress={() => props.onPressItem(item)}
        />}
        keyExtractor={item => item.place_id}
      />
      <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
        <Button title='CLEAR' onPress={props.clear} />
        <Button title='BACK' onPress={props.goBack} />
      </View>
    </View>
  );
}

function SearchItem(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.searchItem}>
        <Text style={{fontSize: 16}}>{props.item.structured_formatting.main_text}</Text>
        <Text style={{fontSize: 14, color: 'grey'}}>{props.item.structured_formatting.secondary_text}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Card(props) {
  const source = {
    uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoReference[0]}&maxheight=800&maxWidth=${CARD_WIDTH}`
  };

  return (
    <View style={styles.card}>
      <Image
        source={source}
        style={styles.cardImage}
        resizeMode='cover'
      />
      <View style={styles.textContent}>
        <Text
          numberOfLines={1}
          style={styles.cardtitle}
        >
          {props.marker.properties.mainText}
        </Text>
        <Text
          numberOfLines={1}
          style={styles.cardDescription}
        >
          {props.marker.properties.secondaryText}
        </Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, padding: 10}}>
        <Button title={'Add Note'} small />
        <Button title={'Remove'} onPress={props.onRemove} small />
      </View>
    </View>
  );
}

function FocusedCard(props) {
  const source = {
    uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoReference[0]}&maxheight=800&maxWidth=${CARD_WIDTH}`
  };

  return (
    <View style={styles.focusedCard}>
      <Image
        source={source}
        style={styles.cardImage}
        resizeMode='cover'
      />
      <View style={styles.textContent}>
        <Text
          numberOfLines={1}
          style={styles.cardtitle}
        >
          {props.marker.properties.mainText}
        </Text>
        <Text
          numberOfLines={1}
          style={styles.cardDescription}
        >
          {props.marker.properties.secondaryText}
        </Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, padding: 10}}>
        <Button title={'Add'} onPress={props.onAdd} />
        <Button title={'Dismiss'} onPress={props.onDismiss} />
      </View>
    </View>
  );
}

function ActionCard(props) {
  let content;
  const textStyle = {color: DARKER_GREY};
  if (props.length == 0) {
    content = (
      <Text style={textStyle}>
        {'No places added yet :('}
      </Text>
    );
  } else {
    content = [
      <Text style={textStyle}>
        {`${props.length} total places added`}
      </Text>,
      !props.isDone && 
        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 30}}>
          <Button title={'View All'} onPress={props.viewAll} small />
          <Button title={`Create Path`} onPress={props.done} small />
        </View>
    ];
  }

  return (
    <View style={styles.actionCard}>
      <View style={styles.actionCardContent}>
        {content}
      </View>
    </View>
  );
}


function CollapseButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.collapseButton}/>
    </TouchableOpacity>
  );
}

class MapScreen extends Component {
  state = {
    search: '',
    searchResults: null,
    view: 'map',
    collapsed: false,
    maxZoomLevel: 20,
    markers: [],
    focused: null,
    name: ''
  };

  componentWillMount() {
    this.mapRef = null;
    this.scrollViewRef = null;

    this.searchTimer = null;
    this.refreshToken = null;
    this.collapseValue = new Animated.Value(height - Header.HEIGHT - (55 + CARD_HEIGHT));
    this.scrollValue = new Animated.Value(0);

    this.token = null;
  }

  onSearch = text => {
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
            photoReference: responseJson.result.photos.map(elem => elem.photo_reference)
          }
        };

        this.closeDrawer();
        this.setState({
          search: item.structured_formatting.main_text,
          view: 'map',
          focused: marker,
          maxZoomLevel: 17
        }, () => {
          this.mapRef.fitToSuppliedMarkers([item.place_id], {
            edgePadding: {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50
            },
            animated: true
          });
        }
      );
    });
  }

  onPressMap = event => {
    Keyboard.dismiss();
    console.log(event.nativeEvent.coordinate);
  }

  onPoiClick = event => {
    console.log(event.nativeEvent.placeId);
    event.persist();
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${event.nativeEvent.placeId}&key=${MAPS_API_KEY}`)
      .then(response => response.json())
      .then(responseJson => {
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
            photoReference: responseJson.result.photos.map(elem => elem.photo_reference)
          }
        };

      this.closeDrawer();
      this.setState({
        search: responseJson.result.name,
        view: 'map',
        focused: marker,
        maxZoomLevel: 17
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

  showDoneScreen = () => {
    this.setState({view: 'done'}, () => {
      Animated.timing(
        this.collapseValue,
        {
          toValue: 0,
          duration: 200
        }
      ).start();
    });
  }

  onAddItem = () => {
    this.setState({
      markers: [...this.state.markers, this.state.focused],
      focused: null,
      search: '',
      searchResults: null
    }, this.toggleDrawer);
  }

  onRemoveItem = id => {
    this.setState({
      markers: this.state.markers.filter(marker => marker.properties.placeId != id)
    });
  }

  onCreatePath = () => {
    firebase.auth().currentUser.getIdToken(true).then(token => {
      console.log('token: ', token);
      
      fetch(`${SERVER_ADDR}/cities/routes`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: 'Bearer '.concat(token)
        },
        body: JSON.stringify({
          name: this.state.name,
          creator: UID,
          city: PLACE_ID,
          pins: this.state.markers
        })
      })
        .then(response => console.log(response))
        .catch(error => console.error(error));
      }
    );
  }

  render() {
    let calloutStyle;
    let calloutViewStyle;

    if (this.state.view === 'search') {
      calloutStyle = {width: '100%', height: '100%'};
      calloutViewStyle = styles.searchView;
    } else {
      calloutStyle = {width: '100%'};
      calloutViewStyle = styles.mapView;
    }

    return (
      <View style={globalStyles.container}>
        <MapView
          provider={'google'}
          style={globalStyles.container}
          onPress={this.onPressMap}
          onPoiClick={this.onPoiClick}
          initialRegion={{
            latitude: INIT_LOCATION.latitude,
            longitude: INIT_LOCATION.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          ref={ref => this.mapRef = ref}
          maxZoomLevel={this.state.maxZoomLevel}
          onRegionChangeComplete={() => {
            if (this.state.maxZoomLevel != 20) {
              this.setState({maxZoomLevel: 20});
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
        <Callout style={calloutStyle}>
          <View style={calloutViewStyle}>
            <TextInput
              style={styles.searchBox}
              placeholder={'Search'}
              onFocus={() => this.setState({view: 'search'})}
              value={this.state.search}
              onChangeText={this.onSearch}
            />
            {
              this.state.view === 'search' ?
                <SearchList
                  results={this.state.searchResults}
                  onPressItem={this.onPressSearchItem}
                  clear={() => this.setState({search: '', searchResults: null})}
                  goBack={() => {
                    this.setState({view: 'map'});
                    Keyboard.dismiss();
                  }}
                /> : null
            }
          </View>
        </Callout>
        {this.state.view === 'map' || this.state.view === 'done' ?
          <Animated.View style={{...styles.animated, top: this.collapseValue}}>
            {/* show focused card */}
            {this.state.focused && <FocusedCard
              marker={this.state.focused}
              onDismiss={() => this.setState({focused: null})}
              onAdd={this.onAddItem} 
            />}
            <View style={styles.drawer} >
              <CollapseButton onPress={this.toggleDrawer} />
              <Animated.ScrollView
                style={{flex: 1}}
                scrollEnabled={this.state.markers.length > 0}
                ref={ref => this.scrollViewRef = ref}
                contentContainerStyle={styles.endPadding}
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: this.scrollValue,
                        },
                      },
                    },
                  ],
                  { useNativeDriver: true }
                )}
              >
                <View style={styles.filler} />
                {this.state.markers.map(marker => 
                  <Card
                    key={marker.placeId}
                    marker={marker}
                    onRemove={() => this.onRemoveItem(marker.properties.placeId)}
                  />
                )}
                <ActionCard
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
                  done={this.showDoneScreen}
                  isDone={this.state.view === 'done'}
                   />
                <View style={styles.filler} />
              </Animated.ScrollView>
              {this.state.view === 'done' &&
                <View style={styles.doneContainer}>
                  <TextInput
                    style={{...styles.nameBox, marginBottom: 10}}
                    placeholder={'Name your path'}
                    onChangeText={text => this.setState({name: text})}
                    value={this.state.name}
                  />
                  <Button title={'DONE'} onPress={this.onCreatePath} />
                </View>
              }
            </View>
          </Animated.View> : null
        }
      </View>
    );
  }
}

export default MapScreen;
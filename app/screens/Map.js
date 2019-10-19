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

import Button from '../components/Button.js';
import globalStyles, { GREY, DARKER_GREY, ACCENT, ACCENT_GREEN } from '../config/styles.js';
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

const detailStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollViewContainer: {
    alignItems: 'center'
  },
  scrollIndicator: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10
  },
  indicatorDot: {
    height: 6,
    width: 6,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 3
  },
  imageScrollView: {
    height: 300,
    width: width
  },
  image: {
    height: 300,
    width: width
  },
  textContainer: {
    padding: 10
  },
  mainText: {
    fontSize: 24,
    marginBottom: 3
  },
  secondaryText: {
    color: DARKER_GREY
  },
  sectionHeader: {
    fontSize: 12,
    marginBottom: 5,
    marginTop: 25,
    color: ACCENT
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: GREY,
    padding: 10
  }
});

const noteEditorStyles = StyleSheet.create({

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
      photoReference: [
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
      photoReference: ['CmRaAAAAN1JSSlKydw6W6-7_eeuYOkJzvVBTW5LBaW0W1sxPnyhkZPKbP4PEbqoPXRU5Q9MHJXBOFzOEJl8KBvB64bI3xtnCOeh9RaUihdBq3-Bi3fOPopG33WVW8avzEZrJ0Dq-EhA4tZV5xpLQP_yEaMXFLzfOGhTeLYBn2z2mW3VmvlOCbUEucED2gg'],
      note: 'Chill, unpretentious vibes',
    }
  }
];

export class SearchScreen extends Component {
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
              onPress={() => {
                this.props.onPressItem(item, this.props.navigation);
              }}
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

export class DetailScreen extends Component {

  componentWillMount() {
    this.scrollValue = new Animated.Value(0);
  }

  render() {
    let position = Animated.divide(this.scrollValue, width);

    return (
      <View style={detailStyles.container}>
        <View style={detailStyles.scrollViewContainer}>
          <Animated.ScrollView
            style={detailStyles.imageScrollView}
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
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
            {this.props.place.properties.photoReference.map(ref =>
              <Image
                source={{uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${ref}&maxheight=800&maxWidth=${CARD_WIDTH}`}}
                style={detailStyles.image}
              />
            )}
          </Animated.ScrollView>
          <View style={detailStyles.scrollIndicator}>
            {this.props.place.properties.photoReference.map((_, i) => {
              let opacity = position.interpolate({
                inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
                outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
                extrapolate: 'clamp' // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
              });
              return (
                <Animated.View
                  key={i}
                  style={{...detailStyles.indicatorDot, opacity}}
                />
              );
            })}
          </View>
        </View>
        <View style={detailStyles.textContainer}>
          <Text style={detailStyles.mainText}>{this.props.place.properties.mainText}</Text>
          <Text style={detailStyles.secondaryText}>{this.props.place.properties.secondaryText}</Text>
          <Text style={detailStyles.sectionHeader}>NOTES</Text>
          {this.props.place.properties.note ? <View>
            <Text>{this.props.place.properties.note}</Text>
            <Text style={{color: DARKER_GREY, fontSize: 10, marginTop: 2}}>Last edited 10/18/2019</Text>
          </View> : <Text style={{color: 'grey'}}>
            Write interesting facts, things to do, or anything you want to record about this place.
          </Text>}
          <BigButton
            icon='create'
            title='Edit notes'
            onPress={() => this.props.navigation.navigate('NoteEditor')}
          />
        </View>
      </View>
    );
  }
}

function BigButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={detailStyles.buttonStyle}>
        {props.icon && <Icon name={props.icon} size={30} color='#00A699'/>}
        <Text style={{marginLeft: 40}}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export class NoteEditorScreen extends Component {
  render() {
    return (
      <View style={globalStyles.container}>
        <Text>Note editor screen</Text>
      </View>
    );
  }
}

function Card(props) {
  const source = {
    uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoReference[0]}&maxheight=800&maxWidth=${CARD_WIDTH}`
  };

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
        <View style={mapStyles.cardButtonBar}>
          <Button title={'Remove'} onPress={props.onRemove} small />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function FocusedCard(props) {
  const source = {
    uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${props.marker.properties.photoReference[0]}&maxheight=800&maxWidth=${CARD_WIDTH}`
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
      <Text style={{color: DARKER_GREY}}>
        {`${props.length} places added`}
      </Text>,
      !props.isDone && 
        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 30}}>
          <Button title={'View All'} onPress={props.viewAll} small />
          <Button title={`Create Path`} onPress={props.done} small />
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

class MapScreen extends Component {

  static navigationOptions = {
    tabBarVisible: false
  };

  state = {
    view: 'map',
    searchInput: '',
    collapsed: false,
    region: {
      latitude: INIT_LOCATION.latitude,
      longitude: INIT_LOCATION.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    },
    markers: [],
    focused: null,
    name: ''
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

  componentDidUpdate(_, prevState) {
    if (prevState.view !== this.state.view) {
      if (this.state.view === 'search') {
        this.searchBoxRef.focus();
      }
    }
  }

  onPressSearch = () => {
    this.props.navigation.navigate('MapSearch', {
      searchInput: this.state.searchInput,
      onPressItem: this.onPressSearchItem,
      onClearText: () => this.setState({searchInput: ''})
    });
  }

  onClearSearch = () => {
    this.setState({searchInput: '', focused: null});
  }

  onPressSearchItem = (item, navigation) => {
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
            photoReference: responseJson.result.photos.map(elem => elem.photo_reference).slice(0, 4)
          }
        };

        this.closeDrawer();
        this.setState({
          searchInput: item.structured_formatting.main_text,
          view: 'map',
          focused: marker
        }, () => {
          navigation.goBack();
          this.mapRef.animateCamera({
            center: {
              latitude: this.state.focused.geometry.coordinates[0],
              longitude: this.state.focused.geometry.coordinates[1],
            },
            zoom: 17
          }, 20);
        });
      });
  }

  onPoiClick = event => {
    event.persist(); // necessary to persist event data for some reason
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
            photoReference: responseJson.result.photos.map(elem => elem.photo_reference).slice(0, 4)
          }
        };

      this.closeDrawer();
      this.setState({
        searchInput: responseJson.result.name,
        view: 'map',
        focused: marker,
      }, () => {
        this.mapRef.animateCamera({
          center: {
            latitude: this.state.focused.geometry.coordinates[0],
            longitude: this.state.focused.geometry.coordinates[1],
          },
          zoom: 15
        }, 30);
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
    firebase.auth().currentUser.getIdToken().then(token => {      
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
        .then(this.props.navigation.goBack)
        .catch(error => console.error(error));
      }
    );
  }

  render() {
    return (
      <View style={globalStyles.container}>
        <MapView
          provider={'google'}
          style={globalStyles.container}
          onPoiClick={this.onPoiClick}
          initialRegion={{
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta
          }}
          ref={ref => this.mapRef = ref}
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
                  }
                }
              ], {useNativeDriver: true}
              )}
            >
              <View style={mapStyles.filler} />
              {this.state.markers.map(marker => 
                <Card
                  key={marker.placeId}
                  marker={marker}
                  onPress={() => this.props.navigation.navigate('PlaceDetail', {place: marker})}
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
              <View style={mapStyles.filler} />
            </Animated.ScrollView>
            {this.state.view === 'done' &&
              <View style={mapStyles.doneContainer}>
                <TextInput
                  style={{...mapStyles.nameBox, marginBottom: 10}}
                  placeholder={'Name your path'}
                  onChangeText={text => this.setState({name: text})}
                  value={this.state.name}
                />
                <Button title={'DONE'} onPress={this.onCreatePath} />
              </View>
            }
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default MapScreen;
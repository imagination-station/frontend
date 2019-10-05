import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  FlatList,
  Text,
  TouchableOpacity,
  Button,
  Animated,
  Dimensions,
  Image
} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { Header } from 'react-navigation-stack';

const {width, height} = Dimensions.get('window');
const INIT_LOCATION = {
  latitude: 33.749,
  longitude: -84.38798
};

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = Math.floor(width / 1.5);

const API_KEY = 'AIzaSyChXhlWL4QeFhqRPoAJRVHdOfl-YaMci-E';

console.log('height: ', height);

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
    alignItems: 'center'
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
    paddingLeft: 10,
    paddingRight: 10,
    width: '95%',
    top: 10,
  },
  searchBoxFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 46,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    width: '95%',
    top: 10,
  },
  searchList: {
    marginTop: 10,
    width: '100%',
    height: 400,
    borderColor: '#f2f2f2',
    borderTopWidth: 5,
    padding: '2.5%',
  },
  searchItem: {
    borderColor: '#f2f2f2',
    borderBottomWidth: 1,
    padding: 10
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center'
  },
  cardContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    elevation: 2,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowRadius: 3,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
    borderRadius: 10,
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
      <Button
        title='GO BACK'
        onPress={props.goBack}
      />
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
    uri: `https://maps.googleapis.com/maps/api/place/photo?key=${API_KEY}&photoreference=${props.marker.properties.photoReference[0]}&maxheight=800&maxWidth=${CARD_WIDTH}`
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
    markers: DATA,
    focused: null,
  };

  constructor(props) {
    super(props);
    this.mapRef = null;
    this.searchTimer = null;
    this.collapseValue = new Animated.Value(height - Header.HEIGHT - (55 + CARD_HEIGHT));
  }

  componentWillMount() {
    this.animation = new Animated.Value(0);
  }

  onSearch = text => {
    this.setState({search: text});
    if (!this.searchTimer) {
      this.searchTimer = setTimeout(() => {
        fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${API_KEY}&location=${INIT_LOCATION.latitude},${INIT_LOCATION.longitude}`)
          .then(response => response.json())
          .then(responseJson => this.setState({searchResults: responseJson.predictions}));
        this.searchTimer = null;
      }, 100);
    }
  }

  onPressSearchItem = item => {
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${API_KEY}`)
      .then(response => response.json())
      .then(responseJson => {
        const marker = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              responseJson.result.geometry.location.lat,
              responseJson.result.geometry.location.lng,
            ]
          },
          properties: {
            placeId: item.place_id,
            mainText: item.structured_formatting.main_text,
            secondaryText: item.structured_formatting.secondary_text,
            photoReference: responseJson.result.photos.map(elem => elem.photo_reference)
          }
        };

        this.setState({
          search: item.structured_formatting.main_text,
          view: 'map',
          focused: marker
        }, () => this.mapRef.fitToSuppliedMarkers([item.place_id], {
          edgePadding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
          },
          animated: false
        }));
      });
  }

  collapse = () => {
    let toValue;
    if (!this.state.collapsed) {
      toValue = height - Header.HEIGHT - 35;
    } else {
      toValue = height - Header.HEIGHT - (55 + CARD_HEIGHT)
    }

    Animated.timing(
      this.collapseValue,
      {
        toValue: toValue,
        duration: 200
      }
    ).start(() => this.setState({collapsed: !this.state.collapsed}));
  }

  render() {
    let calloutStyle;
    let calloutViewStyle;
    let searchBoxStyle = styles.searchBox;

    if (this.state.view === 'search') {
      calloutStyle = {width: '100%', height: '100%'};
      calloutViewStyle = styles.searchView;
      searchBoxStyle = styles.searchBoxFocused;
    } else {
      calloutStyle = {width: '100%'};
      calloutViewStyle = styles.mapView;
    }

    const animatedStyle = {
      position: 'absolute',
      top: this.collapseValue,
      bottom: 0,
      left: 0,
      right: 0,
      paddingVertical: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      alignItems: 'center'
    };

    return (
      <View style={{flex: 1}}>
        <MapView
          style={{flex: 1}}
          onPress={() => Keyboard.dismiss()}
          initialRegion={{
            latitude: 33.7490,
            longitude: -84.3880,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          ref={ref => this.mapRef = ref}
          maxZoomLevel={19}
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
              style={searchBoxStyle}
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
                  goBack={() => {
                    this.setState({view: 'map'});
                    Keyboard.dismiss();
                  }}
                /> : null
            }
          </View>
        </Callout>
        {/* <View style={styles.cardContainer}>
          {this.state.focused && <Card marker={this.state.focused} />}
        </View> */}
        {this.state.view === 'map' ? 
          <Animated.View style={animatedStyle}>
            <CollapseButton onPress={this.collapse}/>
            <Animated.ScrollView
              contentContainerStyle={styles.endPadding}
              horizontal
              scrollEventThrottle={1}
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: this.animation,
                      },
                    },
                  },
                ],
                { useNativeDriver: true }
              )}
            >
              {this.state.markers.map(marker => 
                <Card key={marker.placeId} marker={marker} />
              )}
            </Animated.ScrollView>
          </Animated.View>: null
        }
      </View>
    );
  }
}

export default MapScreen;
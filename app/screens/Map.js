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

const {width, height} = Dimensions.get('window');

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = Math.floor(width / 1.5);

const API_KEY = 'AIzaSyChXhlWL4QeFhqRPoAJRVHdOfl-YaMci-E';

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
    borderColor: '#F2F2F2',
    borderTopWidth: 5,
    padding: '2.5%',
  },
  searchItem: {
    borderColor: '#F2F2F2',
    borderBottomWidth: 1,
    padding: 10
  },
  scrollView: {
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
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden'
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
      photoReference: 'CmRaAAAApMwKX8N6EhXmxuytk8uqqz4XZwQYDHVDgk8XMigwwu4MnSuGnbbnPb6fCp1LaiOJXkx61D1s7M4kdAibCTy4wug3MTpEFGOAT_wHao1B-2mTF3GTU6gWG-0agXGE2qzkEhCNWHKzJ-OHG2iKfjAhIDo0GhQnmSb2pTi3XIMz00TAXpbHPbvUrQ',
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
      photoReference: 'CmRaAAAAN1JSSlKydw6W6-7_eeuYOkJzvVBTW5LBaW0W1sxPnyhkZPKbP4PEbqoPXRU5Q9MHJXBOFzOEJl8KBvB64bI3xtnCOeh9RaUihdBq3-Bi3fOPopG33WVW8avzEZrJ0Dq-EhA4tZV5xpLQP_yEaMXFLzfOGhTeLYBn2z2mW3VmvlOCbUEucED2gg',
      note: 'Chill, unpretentious vibes',
    }
  }
];

function SearchList(props) {
  return (
    <View style={styles.searchList}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <SearchItem
          item={item}
          onPress={() => props.onPressItem(item)}
        />}
        keyExtractor={item => item.placeId}
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
        <Text style={{fontSize: 16}}>{props.item.properties.mainText}</Text>
        <Text style={{fontSize: 14, color: 'grey'}}>{props.item.properties.secondaryText}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Card(props) {
  const source = {
    uri: `https://maps.googleapis.com/maps/api/place/photo?key=${API_KEY}&photoreference=${props.marker.photoReference}&maxheight=800&maxWidth=${CARD_WIDTH}`
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
          {props.marker.title}
        </Text>
        <Text
          numberOfLines={1}
          style={styles.cardDescription}
        >
          {props.marker.description}
        </Text>
      </View>
    </View>
  );
}

class MapScreen extends Component {
  state = {
    search: '',
    view: 'map',
    markers: [],
    focused: '',

  };

  constructor(props) {
    super(props);
    this.mapRef = null;
  }

  componentWillMount() {
    this.animation = new Animated.Value(0);
  }

  onPressSearchItem = item => {
    this.setState({
      search: item.properties.mainText,
      view: 'map',
      markers: [...this.state.markers, {
        id: item.properties.placeId,
        latlng: {
          latitude: item.geometry.coordinates[0],
          longitude: item.geometry.coordinates[1]
        },
        title: item.properties.mainText,
        description: item.properties.secondaryText,
        photoReference: item.properties.photoReference
      }]
    }, () => this.mapRef.fitToSuppliedMarkers([item.properties.placeId], {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        },
        animated: true
      })
    );
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
              key={marker.id}
              identifier={marker.id}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          )}
        </MapView>
        <Callout style={calloutStyle}>
          <View style={calloutViewStyle}>
            <TextInput
              style={searchBoxStyle}
              placeholder={'Search'}
              onFocus={() => this.setState({view: 'search'})}
              value={this.state.search}
            />
            {
              this.state.view === 'search' ?
                <SearchList
                  onPressItem={this.onPressSearchItem}
                  goBack={() => {
                    this.setState({view: 'map'});
                    Keyboard.dismiss();
                  }}
                /> : null
            }
          </View>
        </Callout>
        {this.state.view === 'map' ? 
          <Animated.ScrollView
            style={styles.scrollView}
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
              <Card key={marker.id} marker={marker} />
            )}
          </Animated.ScrollView> : null
        }
      </View>
    );
  }
}

export default MapScreen;
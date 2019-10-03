import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, FlatList, Text } from 'react-native';
import MapView, { Callout } from 'react-native-maps';

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
    height: 300,
    borderColor: '#F2F2F2',
    borderTopWidth: 5,
    padding: '2.5%'
  },
  searchItem: {
    borderColor: '#F2F2F2',
    borderBottomWidth: 1,
    padding: 10
  },
  searchItemText: {
    fontSize: 16,
  }
})

const DATA = [
  {
    name: 'Place 1',
  },
  {
    name: 'Place 2'
  },
  {
    name: 'Place 3',
  },
  {
    name: 'Place 4'
  }
];

function SearchItem(props) {
  return (
    <View style={styles.searchItem}>
      <Text style={styles.searchItemText}>{props.name}</Text>
    </View>
  );
}

function SearchList(props) {
  return (
    <View style={styles.searchList}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <SearchItem name={item.name} />}
        keyExtractor={item => item.name}
      />
    </View>
  );
}

class MapScreen extends Component {
  state = {
    search: '',
    view: 'map'
  };

  searchFocusHandler = () => {

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
          onPress={Keyboard.dismiss}
          initialRegion={{
            latitude: 33.7490,
            longitude: -84.3880,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
        <Callout style={calloutStyle}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={{flex: 1}}
          >
            <View style={calloutViewStyle}>
              <TextInput
                style={searchBoxStyle}
                placeholder={'Search'}
                onFocus={() => this.setState({view: 'search'})}
                onBlur={() => this.setState({view: 'map'})}
              />
              {this.state.view === 'search' ? <SearchList /> : null}
            </View>
          </TouchableWithoutFeedback>
        </Callout>
      </View>
    );
  }
}

export default MapScreen;
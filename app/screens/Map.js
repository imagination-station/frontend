import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, FlatList, Text } from 'react-native';
import MapView, { Callout } from 'react-native-maps';

const styles = StyleSheet.create({
  calloutMapView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calloutSearchView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  calloutSearch: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    height: 40,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    width: '90%',
    top: 20,
    borderColor: '#BABABA',
    borderWidth: 1
  }
})

const data = [
  {
    name: 'blah1',
  },
  {
    name: 'blah2'
  }
];

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
    let searchResults = null;

    if (this.state.view === 'search') {
      calloutStyle = {width: '100%', height: '100%'};
      calloutViewStyle = styles.calloutSearchView;
      searchResults = <FlatList
        style={{width: '90%', height: 200}}
        data={data}
        renderItem={item => <Text>{item.name}</Text>}
        keyExtractor={item => item.name}
      />;
    } else {
      calloutStyle = {width: '100%'};
      calloutViewStyle = styles.calloutMapView;
    }

    return (
      <View style={{flex: 1}}>
        <MapView
          style={{flex: 1}}
          onPress={Keyboard.dismiss}
        />
        <Callout style={calloutStyle}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={{flex: 1}}
          >
            <View style={calloutViewStyle}>
              <TextInput
                style={styles.calloutSearch}
                placeholder={'Search'}
                onFocus={() => this.setState({view: 'search'})}
                onBlur={() => this.setState({view: 'map'})}
              />
              {searchResults}
            </View>
          </TouchableWithoutFeedback>
        </Callout>
      </View>
    );
  }
}

export default MapScreen;
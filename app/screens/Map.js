import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import MapView, { Callout } from 'react-native-maps';

const styles = StyleSheet.create({
  calloutView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  calloutSearch: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 40,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    width: '70%',
    top: 20
  }
})

class MapScreen extends Component {
  state = {
    search: ''
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <MapView style={{flex: 1}} />
        <Callout style={{width: '100%'}}>
          <View style={styles.calloutView}>
            <TextInput
              style={styles.calloutSearch}
              placeholder={'Search'}
            />
          </View>
        </Callout>
      </View>
    );
  }
}

export default MapScreen;
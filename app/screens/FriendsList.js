import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { GREY, DARKER_GREY, PRIMARY } from '../config/styles.js';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollViewContainer: {
    alignItems: 'center'
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
    color: PRIMARY
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

class FriendsList extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: false,
      headerTitle: () => <Text style={{fontSize: 20}}>Share</Text>
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Travel with your facebook friends</Text>
        <Text>Only friends who also downloaded Shoestring will show up.</Text>
        <Text>Friends you share with will be given permission to edit your trip.</Text>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    pins: state.pins,
    selected: state.selected
  };
}

export default connect(mapStateToProps)(FriendsList);
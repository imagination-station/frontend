import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as firebase from 'firebase';

import { GREY, DARKER_GREY, PRIMARY } from '../config/styles.js';

// dimensions of the screen
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15
  },
  scrollViewContainer: {
    alignItems: 'center'
  },
  textContainer: {
    padding: 10
  },
  textBox: {
    height: 45,
    width: width - 60, // 60 = width of paddingHorizontal + width of icon
    borderBottomWidth: 2,
    borderBottomColor: 'grey'
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
      header: props =>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name='keyboard-arrow-left' size={45} />
          </TouchableOpacity>
        </View>,
    };
  }

  state = {
    friends: null
  }

  componentDidMount() {
    fetch(`https://graph.facebook.com/${firebase.auth().currentUser.providerData[0].uid}/friends?access_token=${this.props.accessToken}`)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({friends: responseJson});
      });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={{paddingTop: 30, marginBottom: 5}}>
            <Text style={{fontSize: 32, fontWeight: 'bold', marginBottom: 5}}>Travel with your{'\n'}Friends.</Text>
            <Text style={{fontSize: 14}}>
              People you share with will be able to view and edit your trip.{'\n'}
              Only friends who downloaded {'&'} connected their{'\n'}
              Facebook account will show up.
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 30}}>
            <TextInput
              autoFocus
              style={styles.textBox}
              placeholder='Search'
            />
            <Icon name='search' size={30} />
          </View>
          <View>
            <Text>{`${JSON.stringify(this.state.friends)}`}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.accessToken
  };
}

export default connect(mapStateToProps)(FriendsList);
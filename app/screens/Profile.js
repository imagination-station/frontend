import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  SafeAreaView,
  Platform,
  Modal,
  Clipboard
} from 'react-native';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

import { DARKER_GREY, GREY, PRIMARY, ACCENT } from '../config/styles.js';

const PROFILE_PIC_SIZE = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 0.5,
    backgroundColor: 'white'
  },
  profilePic: {
    width: PROFILE_PIC_SIZE,
    height: PROFILE_PIC_SIZE,
    borderRadius: PROFILE_PIC_SIZE / 2
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 25
  },
  headerMainText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  headerSecondaryText: {
    color: PRIMARY,
    fontSize: 16
  },
  sectionContainer: {
    padding: 20,
    backgroundColor: 'white',
    width: '100%'
  },
  sectionHeader: {
    fontSize: 12,
    marginBottom: 5,
    color: DARKER_GREY
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: GREY,
    paddingVertical: 15
  },
  button: {
    color: ACCENT,
    fontSize: 16,
    paddingHorizontal: 7
  },
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY
  },
  safeStatusArea: {
    flex: 0,
    backgroundColor: '#fff'
  }
});

function ActionButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.actionButton}>
        <Text style={props.textStyle}>{props.title}</Text>
        {props.icon && <Icon name={props.icon} size={25} />}
      </View>
    </TouchableOpacity>
  );
}

function Button(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={styles.button}>{props.title}</Text>
    </TouchableOpacity>
  );
}

class ProfileScreen extends Component {

  state = {
    modalVisible: false
  }

  componentDidMount() {
    this.firebaseListener = firebase.auth().onAuthStateChanged(user => {
      if (user == null) {
        this.props.navigation.navigate('Auth');
      }
    });
  }

  componentWillUnmount() {
    this.firebaseListener && this.firebaseListener();
  }

  logout = () => {
    firebase.auth().signOut();
  }

  tutorial = () => {
    this.props.navigation.navigate('Tutorial');
  }

  render() {
    const bio = this.props.user.bio ? this.props.user.bio : `Hello! My name is ${this.props.user.fullName}.`;

    return (
      <SafeAreaView style={styles.safeArea}>
        <Modal
          animationType='fade'
          visible={this.state.modalVisible}
          transparent
        >
          <TouchableWithoutFeedback onPress={() => this.setState({modalVisible: false})}>
            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableWithoutFeedback onPress={() => console.log('hello world!')}>
                <View style={{width: 300, height: 190, padding: 10, backgroundColor: 'white', elevation: 1}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>Your fingerprint is:</Text>
                  <Text style={{alignSelf: 'center', marginVertical: 10}}>{this.props.user.fingerprint}</Text>
                  <Text>You use fingerprints for searching and adding friends.</Text>
                  <View style={{height: 14, marginTop: 10}}>
                    <Text style={{color: ACCENT}}>{this.state.message}</Text>
                  </View>
                  <View style={{alignSelf: 'flex-end', flexDirection: 'row', marginTop: 20}}>
                    <Button title='Copy' onPress={() => {
                      Clipboard.setString(this.props.user.fingerprint);
                      this.setState({message: 'Fingerprint copied to clipboard!'});
                      setTimeout(() => this.setState({message: ''}), 5000);
                      }}
                    />
                    <Button title='Close' onPress={() => this.setState({modalVisible: false})} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image style={{width: 70, height: 70, borderRadius: 70 / 2}} source={{uri: this.props.user.photoUrl}} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerMainText}>{this.props.user.fullName}</Text>
              <Text style={styles.headerSecondaryText}>{this.props.user.location.fullName}</Text>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>BIO</Text>
            <Text style={{lineHeight: 20}}>{bio}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>SOCIAL</Text>
            <ActionButton
              title='View fingerprint'
              onPress={() => this.setState({modalVisible: true})}
            />
            <ActionButton
              title='Add friends'
              onPress={() => this.props.navigation.navigate('FriendSearch')}
            />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>ACTIONS</Text>
            <ActionButton
              title='Log out'
              onPress={this.logout}
              textStyle={{color: 'red'}}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(ProfileScreen);

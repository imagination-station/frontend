import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import * as firebase from 'firebase';

import { GREY, DARKER_GREY, PRIMARY, ACCENT } from '../config/styles.js';
import { MAPS_API_KEY, TEST_SERVER_ADDR } from '../config/settings.js';

const {width, height} = Dimensions.get('window');
const IMG_SIZE = width / 2;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: 'transparent',
    width: '100%',
    height: 45
  },
  sectionContainer: {
    padding: 10,
    paddingBottom: 15,
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: GREY,
    borderBottomWidth: 1
  },
  sectionHeader: {
    fontSize: 12,
    marginBottom: 5,
    color: PRIMARY
  }
});

const photoRemoverStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30
  },
  image: {
    width: IMG_SIZE,
    height: IMG_SIZE
  },
  check: {
    position: 'absolute',
    top: 5,
    right: 5
  }
});

class PhotoRemover extends Component {

  static navigationOptions = {
    tabBarVisible: false,
    header: null
  }

  state = {
    selected: new Set()
  }

  onTogglePhoto = item => {
    let updatedSelected = new Set(this.state.selected);

    if (this.state.selected.has(item)) {
      updatedSelected.delete(item);
    } else {
      updatedSelected.add(item);
    }

    this.setState({selected: updatedSelected});
  }

  onDelete = () => {
    let refs = this.props.selectedBuf.properties.photoRefs;
    let pinData = {photoRefs: refs.filter(item => !this.state.selected.has(item))};

    firebase.auth().currentUser.getIdToken()
      .then(token =>	
        fetch(`${TEST_SERVER_ADDR}/api/pins/${this.props.selectedBuf._id}`, {	
            method: 'PUT',	
            headers: {	
              Accept: 'application/json',	
              'Content-type': 'application/json',	
              Authorization: `Bearer ${token}`	
            },	
            body: JSON.stringify(pinData)
        })	
      )
      .then(response => {
        this.props.updatePin(pinData);
        this.setState({selected: new Set()});
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{marginRight: 5}}>
            <Icon name='keyboard-arrow-left' size={45} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.selected.size == 0}
            onPress={this.onDelete}
          >
            <Icon name='delete-forever' size={30} color={this.state.selected.size == 0 ? GREY : 'red'} />
          </TouchableOpacity>
        </View>
        <View style={photoRemoverStyles.container}>
          <FlatList
            data={this.props.selectedBuf.properties.photoRefs}
            numColumns={2}
            renderItem={({ item }) =>
              <SelectedImage
                selected={this.state.selected.has(item)}
                onPress={() => this.onTogglePhoto(item)}
                source={{uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${item}&maxheight=800&maxWidth=1000`}}
              />
            }
          />
        </View>        
      </SafeAreaView>
    );
  }
}

function SelectedImage(props) {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={{width: IMG_SIZE, height: IMG_SIZE}}>
        <Image source={props.source} style={photoRemoverStyles.image} resizeMode='cover' />
        {props.selected ? <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.5)']}
          style={{position: 'absolute', width: '100%', height: '100%'}}
        /> : null}
        {props.selected ? <Icon
          name='check-circle'
          size={20}
          color='white'
          style={photoRemoverStyles.check}
        /> : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

class PlaceEditor extends Component {

  static navigationOptions = {
    tabBarVisible: false,
    header: null
  };

  onPressEditTitle = () => {
    this.props.navigation.navigate('TextEditor', {
      initialText: this.props.selectedBuf.properties.mainText,
      maxLength: 280,
      placeholder: 'New title',
      onDone: this.onEditTitle
    });
  }

  onEditTitle = text => {
    let pinData = {mainText: text};

    firebase.auth().currentUser.getIdToken()
      .then(token =>	
        fetch(`${TEST_SERVER_ADDR}/api/pins/${this.props.selectedBuf._id}`, {	
            method: 'PUT',	
            headers: {	
              Accept: 'application/json',	
              'Content-type': 'application/json',	
              Authorization: `Bearer ${token}`	
            },	
            body: JSON.stringify(pinData)
        })	
      )
      .then(response => {
        this.props.updatePin(pinData);
      })
      .catch(error => console.error(error));	
  }

  onPressEditNote = () => {
    this.props.navigation.navigate('TextEditor', {
      initialText: this.props.selectedBuf.properties.note,
      maxLength: 280,
      placeholder: 'New note',
      onDone: this.onEditNote
    });
  }

  onEditNote = text => {
    let pinData = {note: text};

    firebase.auth().currentUser.getIdToken()
      .then(token =>	
        fetch(`${TEST_SERVER_ADDR}/api/pins/${this.props.selectedBuf._id}`, {	
            method: 'PUT',	
            headers: {	
              Accept: 'application/json',	
              'Content-type': 'application/json',	
              Authorization: `Bearer ${token}`	
            },	
            body: JSON.stringify(pinData)
        })	
      )
      .then(response => {
        this.props.updatePin(pinData);
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{marginRight: 5}}>
              <Icon name='keyboard-arrow-left' size={45} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <View>
            <Text style={styles.sectionHeader}>TITLE</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode='tail' 
              style={{width: 300}}  
            >
              {this.props.selectedBuf.properties.mainText}
            </Text>
          </View>
          <TouchableOpacity onPress={this.onPressEditTitle}>
            <Icon name='edit' size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.sectionContainer}>
          <View>
            <Text style={styles.sectionHeader}>NOTE</Text>
            <Text
              numberOfLines={5}
              ellipsizeMode='tail'
              style={{width: 300}}
            >
              {this.props.selectedBuf.properties.note}
            </Text>
          </View>
          <TouchableOpacity onPress={this.onPressEditNote}>
            <Icon name='edit' size={30}/>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionContainer}>
          <View>
            <Text style={styles.sectionHeader}>PHOTOS</Text>
            <Text
              numberOfLines={5}
              ellipsizeMode='tail'
              style={{width: 300}}
            >
              {`${this.props.selectedBuf.properties.photoRefs.length} photo(s)`}
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => {
              // TODO: implement photo adder
              Alert.alert(
                'Hello',
                "You've discovered a feature not yet implemented. Coming soon!",
                [
                  {
                    text: 'OK'
                  }
                ]
              );
            }}>
              <Icon name='add' size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('PhotoRemover')}>
              <Icon name='remove' size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    pins: state.pins,
    selected: state.selected,
    selectedBuf: state.selectedBuf
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updatePin: data => dispatch({type: 'UPDATE_SELECTED', payload: {
      data: data
    }})
  };
}

export const PhotoRemoverScreen = connect(mapStateToProps, mapDispatchToProps)(PhotoRemover);

export default connect(mapStateToProps, mapDispatchToProps)(PlaceEditor);
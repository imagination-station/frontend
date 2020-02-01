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
    alignItems: 'center'
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
    selected: new Set(),
    photoRefs: this.props.selectedBuf.properties.photoRefs
  }

  componentDidMount() {
    this.props.navigation.setParams({
      disabled: this.state.selected.size == 0,
      onDelete: this.onDelete
    });
  }

  onTogglePhoto = item => {
    let updatedSelected = new Set(this.state.selected);

    if (this.state.selected.has(item)) {
      updatedSelected.delete(item);
    } else {
      updatedSelected.add(item);
    }

    this.setState({selected: updatedSelected});
    this.props.navigation.setParams({disabled: updatedSelected.size == 0});
  }

  onDelete = () => {
    this.setState({
      photoRefs: this.state.photoRefs.filter(item => !this.state.selected.has(item)),
      selected: new Set()
    }, () => {
      this.props.updatePin({photoRefs: this.state.photoRefs});
      this.props.navigation.setParams({disabled: true});
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={photoRemoverStyles.container}>
          <FlatList
            data={this.state.photoRefs}
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

  componentDidMount() {
    this.props.navigation.setParams({onSave: this.onSave});
  }

  onSave = () => {
    // if updating existing pin...
    if (this.props.selectedBuf._id) {
      firebase.auth().currentUser.getIdToken().then(token =>
        fetch(`${TEST_SERVER_ADDR}/api/users/${firebase.auth().currentUser.uid}/pins/${this.props.selectedBuf._id}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(this.props.selectedBuf)
        })
      ) 
        .then(response => {
          this.props.commitPin();
          this.props.navigation.goBack();
        })
        .catch(error => console.error(error));
    } else {
      this.props.commitPin();
      this.props.navigation.goBack();
    }
  }

  onEditTitle = () => {
    this.props.navigation.navigate('TextEditor', {
      initialText: this.props.selectedBuf.properties.mainText,
      maxLength: 280,
      placeholder: 'New title',
      onDone: text => this.props.updatePin({mainText: text}),
    });
  }

  onEditNote = () => {
    this.props.navigation.navigate('TextEditor', {
      initialText: this.props.selectedBuf.properties.note,
      maxLength: 280,
      placeholder: 'New note',
      onDone: text => this.props.updatePin({note: text})
    });
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
          <TouchableOpacity onPress={this.onEditTitle}>
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
          <TouchableOpacity onPress={this.onEditNote}>
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
    pins: state.pins,
    selected: state.selected,
    selectedBuf: state.selectedBuf
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updatePin: data => dispatch({type: 'UPDATE_PIN', payload: {
      data: data
    }}),
    commitPin: () => dispatch({type: 'COMMIT_PIN'})
  };
}

export const PhotoRemoverScreen = connect(mapStateToProps, mapDispatchToProps)(PhotoRemover);

export default connect(mapStateToProps, mapDispatchToProps)(PlaceEditor);
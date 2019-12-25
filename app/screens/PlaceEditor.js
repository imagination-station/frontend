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
  Image
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

import { GREY, DARKER_GREY, PRIMARY, ACCENT } from '../config/styles.js';
import { MAPS_API_KEY } from '../config/settings.js';

const {width, height} = Dimensions.get('window');
const IMG_SIZE = width / 2;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1
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

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: false,
      headerTitle: () => <Text style={{fontSize: 20}}>Remove Photos</Text>,
      headerRight: () =>
        <TouchableOpacity
          onPress={navigation.getParam('onDelete')}
          disabled={navigation.getParam('disabled')}
        >
          <Icon
            name='delete'
            size={30}
            color={ACCENT}
            style={{
              marginRight: 10,
              opacity: navigation.getParam('disabled') ? 0.3 : 1
            }}
          />
        </TouchableOpacity>
    };
  }

  state = {
    selected: [],
    photoRefs: this.props.selectedBuf.properties.photoRefs
  }

  componentDidMount() {
    this.props.navigation.setParams({
      disabled: this.state.selected.length == 0,
      onDelete: this.onDelete
    });
  }

  onTogglePhoto = item => {
    if (this.state.selected.includes(item)) {
      this.setState({
        selected: this.state.selected.filter(elem => item != elem)
      }, () => {
        this.props.navigation.setParams({
          disabled: this.state.selected == 0
        })
      });
    } else {
      this.setState({
        selected: [...this.state.selected, item]
      }, () => {
        this.props.navigation.setParams({
          disabled: false
        })
      });
    }
  }

  onDelete = () => {
    this.setState({
      photoRefs: this.state.photoRefs.filter(item => !this.state.selected.includes(item)),
      selected: []
    }, () => {
      this.props.updatePin({photoRefs: this.state.photoRefs});
      this.props.navigation.setParams({
        disabled: true
      })
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
                selected={this.state.selected.includes(item)}
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

class PlaceEditorScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: false,
      headerTitle: () => <Text style={{fontSize: 20}}>Edit Place</Text>,
      headerRight: () =>
        <TouchableOpacity onPress={() => console.log('Save')}>
          <Icon
            name='save'
            size={30}
            color={ACCENT}
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
    };
  }

  onEditTitle = () => {
    this.props.navigation.navigate('TextEditor', {
      initialText: this.props.pins[this.props.selected].properties.mainText,
      maxLength: 280,
      placeholder: 'New title',
      onDone: () => console.log('DONE!')
    });
  }

  onEditNote = () => {
    this.props.navigation.navigate('TextEditor', {
      initialText: this.props.pins[this.props.selected].properties.note,
      maxLength: 280,
      placeholder: 'New note',
      onDone: () => console.log('DONE!')
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sectionContainer}>
          <View>
            <Text style={styles.sectionHeader}>TITLE</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode='tail' 
              style={{width: 300}}  
            >
              {this.props.pins[this.props.selected].properties.mainText}
            </Text>
          </View>
          <TouchableOpacity onPress={this.onEditTitle}>
            <Icon name='edit' size={30} color={DARKER_GREY} />
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
              {this.props.pins[this.props.selected].properties.note}
            </Text>
          </View>
          <TouchableOpacity onPress={this.onEditNote}>
            <Icon name='edit' size={30} color={DARKER_GREY} />
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
            <TouchableOpacity>
              <Icon name='add' size={30} color={DARKER_GREY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('PhotoRemover')}>
              <Icon name='remove' size={30} color={DARKER_GREY} />
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
    }})
  };
}

export const PhotoRemoverScreen = connect(mapStateToProps, mapDispatchToProps)(PhotoRemover);

export default connect(mapStateToProps, mapDispatchToProps)(PlaceEditorScreen);
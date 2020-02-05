import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

import { GREY, DARKER_GREY, PRIMARY } from '../config/styles.js';
import { MAPS_API_KEY, PLACEHOLDER_IMG } from '../config/settings.js';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const IMG_SIZE = width / 2;

const styles = StyleSheet.create({
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
    padding: 10,
    marginBottom: 30
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

class PlaceDetailsScreen extends Component {

  static navigationOptions = {
      tabBarVisible: false,
      header: null
  };

  render() {
    const placeholder = 'Write interesting facts, things to do, or anything you want to record about this place.';

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{marginRight: 5}}>
              <Icon name='keyboard-arrow-left' size={45} />
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{borderRadius: 4, padding: 5, backgroundColor: this.props.loading ? ACCENT : 'rgba(0,0,0,0.4)', flexDirection: 'row', alignItems: 'center'}}>
                <Icon name='autorenew' size={15} color='white' style={{marginRight: 5}} />
                <Text style={{fontSize: 12, color: 'white'}}>{this.props.loading ? 'Saving...' : '2 hours ago'}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{paddingRight: 10}} onPress={() => this.props.navigation.navigate('PlaceEditor')}>
              <Icon name='edit' size={30} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>{this.props.selectedBuf.properties.mainText}</Text>
            <Text style={styles.secondaryText}>{this.props.selectedBuf.properties.secondaryText}</Text>
            <Text style={styles.sectionHeader}>NOTES</Text>
            {this.props.selectedBuf.properties.note ?
              <Text>{this.props.selectedBuf.properties.note}</Text> :
              <Text style={{color: 'grey'}}>
                {placeholder}
              </Text>
            }
          </View>
          <FlatList
            data={this.props.selectedBuf.properties.photoRefs}
            numColumns={2}
            renderItem={({ item }) =>
              <Image
                style={{width: IMG_SIZE, height: IMG_SIZE}}
                source={{uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${item}&maxheight=800&maxWidth=1000`}}
              />
            }
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedBuf: state.selectedBuf
  };
}

export default connect(mapStateToProps)(PlaceDetailsScreen);
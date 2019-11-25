import React, { Component } from 'react';
import { View, StyleSheet, Text, Animated, Image, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Appearance, AppearanceProvider, useColorScheme } from 'react-native-appearance';

import { LongButton } from '../components/Buttons.js';
import ImageCollage from '../components/ImageCollage.js';
import { GREY, DARKER_GREY, PRIMARY } from '../config/styles.js';
import { MAPS_API_KEY, PLACEHOLDER_IMG } from '../config/settings.js';

const {width, height} = Dimensions.get('window');
const CARD_WIDTH = Math.floor(width / 1.5);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Appearance.getColorScheme() == 'dark' ? 'black' : 'white'
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
    marginBottom: 3,
    color: Appearance.getColorScheme() == 'dark' ? 'white' : 'black'
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

class PlaceDetailScreen extends Component {

  static navigationOptions = {
    tabBarVisible: false,
    headerStyle: {
      backgroundColor: Appearance.getColorScheme() == 'dark' ? 'black' : 'white'
    },
    headerTitle: () => <Text style={{fontSize: 20, color: Appearance.getColorScheme() == 'dark' ? 'white' : 'black'}}>Place</Text>
  };

  componentWillMount() {
    this.scrollValue = new Animated.Value(0);
  }

  render() {
    const place = this.props.markers[this.props.selected];
    // const photos = place.properties.photoRefs ?
    //   place.properties.photoRefs.map(ref =>
    //     <Image
    //       source={{uri: `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${ref}&maxheight=800&maxWidth=${CARD_WIDTH}`}}
    //       style={styles.image}
    //       key={ref}
    //     />
    //   ) : <Image source={{uri: PLACEHOLDER_IMG}} style={styles.image} />;

    const photoUris = place.properties.photoRefs
        ? place.properties.photoRefs.map(ref => `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${ref}&maxheight=800&maxWidth=1000`)
        : [];


    let placeholder;
    if (this.props.editable) {
      placeholder = 'Write interesting facts, things to do, or anything you want to record about this place.';
    } else {
      placeholder = 'No notes :(';
    }

    return (
      <ScrollView style={styles.container}>
        {/* <ImageCarousel
          width={width}
          scrollValue={this.scrollValue}
          containerStyle={styles.scrollViewContainer}
          scrollViewStyle={styles.imageScrollView}
        >
          {photos}
        </ImageCarousel> */}
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>{place.properties.mainText}</Text>
          <Text style={styles.secondaryText}>{place.properties.secondaryText}</Text>
          <Text style={styles.sectionHeader}>NOTES</Text>
          {place.properties.note ? <View>
            <Text>{place.properties.note}</Text>
            <Text style={{color: DARKER_GREY, fontSize: 10, marginTop: 2}}>Last edited 10/18/2019</Text>
          </View> : <Text style={{color: 'grey'}}>
            {placeholder}
          </Text>}
          {this.props.editable ? <LongButton
            icon='create'
            title='Edit notes'
            style={styles.buttonStyle}
            textStyle={{marginLeft: 40}}
            onPress={() => this.props.navigation.navigate('NoteEditor')}
          /> : null}
        </View>
        <ImageCollage
          containerStyle={{marginTop: 30, marginLeft: 10}}
          uris={photoUris}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    markers: state.markers,
    selected: state.selected,
  };
}

export default connect(mapStateToProps)(PlaceDetailScreen);
